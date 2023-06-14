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
import { BLANK_WAREHOUSE, IUser, EUserRole } from '@utils/schema';
import { takeUntil, debounceTime } from 'rxjs';
import { WarehouseFacadeService } from '../../facade/warehouse-facade.service';

@Component({
    selector: 'new-warehouse',
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
        ErrorMessageComponent
    ],
    templateUrl: './new-warehouse.component.html',
    styleUrls: ['./new-warehouse.component.scss']
})
export class NewWarehouseComponent extends BaseFormSingleComponent implements OnInit {
    warehouseFacade = inject(WarehouseFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_WAREHOUSE.name, [Validators.required]],
        address: [BLANK_WAREHOUSE.address, [Validators.required]],
        _managerId: [BLANK_WAREHOUSE._managerId, [Validators.required]]
    });

    managerList: IUser[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formHasChanged = this.formGroup.dirty;
            this.formValid = this.formGroup.valid;
        });
    }

    override registerCoreLayer() {
        this.warehouseFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.warehouseFacade.getManagerList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.managerList = value;
            },
            error: err => {
                throw err;
            }
        });
        this.warehouseFacade.loadManagerList({ $filter: `role eq '${EUserRole.owner}'` });
    }

    cancelHandler() {
        this.router.navigate(['/warehouse/list']);
    }

    submitHandler() {
        const warehouse = this.formGroup.value as any;
        this.warehouseFacade.submitWarehouse$(warehouse).subscribe({
            next: () => {
                this.matSnackbar.open(`Warehouse ${warehouse.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/warehouse/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
