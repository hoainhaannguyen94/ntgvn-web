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
import { BLANK_WAREHOUSE, IUser, IWarehouse } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { WarehouseFacadeService } from '../../facade/warehouse-facade.service';

@Component({
    selector: 'warehouse-details',
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
    templateUrl: './warehouse-details.component.html',
    styleUrls: ['./warehouse-details.component.scss']
})
export class WarehouseDetailsComponent extends BaseFormSingleDetailsComponent<IWarehouse> implements OnInit {
    warehouseFacade = inject(WarehouseFacadeService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    warehouseId = '';
    warehouse = BLANK_WAREHOUSE;

    override formGroup = this.formBuilder.group({
        name: [BLANK_WAREHOUSE.name, [Validators.required]],
        address: [BLANK_WAREHOUSE.address, [Validators.required]],
        _managerId: [BLANK_WAREHOUSE._managerId, [Validators.required]]
    });

    managerList: IUser[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.warehouseId = value['id']
                this.warehouseFacade.getWarehouse$(this.warehouseId).subscribe({
                    next: res => {
                        const warehouse = res.value;
                        this.warehouse = warehouse;
                        this.originalData = cloneDeep(warehouse);
                        this.formGroup.patchValue(warehouse);
                    }
                });
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
        });
        this.warehouseFacade.getManagerList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.managerList = value;
            },
            error: err => {
                throw err;
            }
        });

        const managerIdsFilter = this.appState.userRoles.reduce((acc, cur) => {
            if (['manager', 'owner'].includes(cur.name)) {
                acc.push(`role eq '${cur._id}'`);
            }
            return acc;
        }, []).join(' or ');
        this.warehouseFacade.loadManagerList({ $filter: managerIdsFilter });
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
    }

    cancelHandler() {
        this.back();
    }

    updateHandler() {
        const warehouse = this.formGroup.value as any;
        this.warehouseFacade.updateWarehouse$(this.warehouseId, warehouse).subscribe({
            next: () => {
                this.matSnackbar.open(`Warehouse ${warehouse.name} have been updated.`, 'UPDATE', {
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
