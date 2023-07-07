import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseFormSingleComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_PRODUCT, IProductCategory, IWarehouse } from '@utils/schema';
import { takeUntil, debounceTime } from 'rxjs';
import { ProductFacadeService } from '../../facade/product-facade.service';
import { LogService } from '@utils/service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
    selector: 'new-product',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ErrorMessageComponent
    ],
    templateUrl: './new-product.component.html',
    styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent extends BaseFormSingleComponent implements OnInit {
    log = inject(LogService);
    productFacade = inject(ProductFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_PRODUCT.name, [Validators.required]],
        _categoryId: [BLANK_PRODUCT._categoryId, [Validators.required]],
        type: [BLANK_PRODUCT.type, [Validators.required]],
        _warehouseId: [BLANK_PRODUCT._warehouseId, [Validators.required]],
        unit: [BLANK_PRODUCT.unit, [Validators.required]],
        quantity: [BLANK_PRODUCT.quantity, [Validators.required, Validators.min(0)]],
        retailPrice: [BLANK_PRODUCT.retailPrice, [Validators.required, Validators.min(0)]],
        wholesalePrice: [BLANK_PRODUCT.wholesalePrice, [Validators.required, Validators.min(0)]],
        collaboratorPrice: [BLANK_PRODUCT.collaboratorPrice, [Validators.required, Validators.min(0)]],
        createdAt: [BLANK_PRODUCT.createdAt, [Validators.required]],
        expireAt: [BLANK_PRODUCT.expireAt, [Validators.required]]
    });

    productCategoryList: IProductCategory[] = [];
    warehouseList: IWarehouse[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.info('NewProductComponent', 'valueChanges', values);
        });
    }

    override registerCoreLayer() {
        this.productFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.productFacade.getProductCategoryList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.productCategoryList = value;
            }
        });
        this.productFacade.getWarehouseList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.warehouseList = value;
            }
        });
        this.productFacade.loadProductCategoryList({
            $orderby: 'name asc'
        });
        this.productFacade.loadWarehouseList({
            $orderby: 'name asc'
        });
    }

    cancelHandler() {
        this.back();
    }

    submitHandler() {
        const product = this.formGroup.value as any;
        product.createdAt = product.createdAt.toISOString();
        product.expireAt = product.expireAt.toISOString();
        this.productFacade.submitProduct$(product).subscribe({
            next: () => {
                this.matSnackbar.open(`Product ${product.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/product/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
