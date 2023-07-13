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
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_PRODUCT, IProduct, IProductCategory, IWarehouse } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { ProductFacadeService } from '../../facade/product-facade.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LogService } from '@utils/service';

@Component({
    selector: 'product-details',
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
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent extends BaseFormSingleDetailsComponent<IProduct> implements OnInit {
    logService = inject(LogService);
    activatedRoute = inject(ActivatedRoute);
    productFacade = inject(ProductFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    productId = '';
    product = BLANK_PRODUCT;

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
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.productId = value['id']
                this.productFacade.getProduct$(this.productId).subscribe({
                    next: res => {
                        const product = res.value;
                        this.product = product;
                        this.originalData = cloneDeep(product);
                        this.formGroup.patchValue(product);
                    }
                });
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.formValid = this.formGroup.valid;
                this.updateFormHasChanged(value);
            }
        });
    }

    override registerCoreLayer() {
        this.productFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('ProductDetailsComponent', err);
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

        this.productFacade.loadProductCategoryList({ $orderby: 'name asc' });

        this.productFacade.loadWarehouseList({ $orderby: 'name asc' });
    }

    cancelHandler() {
        this.back();
    }

    updateHandler() {
        const product = this.formGroup.value as any;
        this.productFacade.updateProduct$(this.productId, product).subscribe({
            next: () => {
                this.matSnackbar.open(`Product ${product.name} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/product/list']);
            },
            error: err => {
                this.logService.error('ProductDetailsComponent', err);
            }
        });
    }
}
