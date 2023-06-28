import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormSingleDetailsComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/component/error-message';
import { BLANK_CUSTOMER, ICustomer } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { CustomerFacadeService } from '../../facade/customer-facade.service';

@Component({
    selector: 'customer-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        ErrorMessageComponent
    ],
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent extends BaseFormSingleDetailsComponent<ICustomer> implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    customerFacade = inject(CustomerFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    customerId = '';
    customer = BLANK_CUSTOMER;

    override formGroup = this.formBuilder.group({
        name: [BLANK_CUSTOMER.name, [Validators.required]],
        address: [BLANK_CUSTOMER.address, [Validators.required]],
        phoneNumber: [BLANK_CUSTOMER.phoneNumber, [Validators.required]]
    });


    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.customerId = value['id']
                this.customerFacade.getCustomer$(this.customerId).subscribe({
                    next: res => {
                        const customer = res.value;
                        this.customer = customer;
                        this.originalData = cloneDeep(customer);
                        this.formGroup.patchValue(customer);
                    }
                });
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
        });
    }

    override registerCoreLayer() {
        this.customerFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
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
        const customer = this.formGroup.value as any;
        this.customerFacade.updateCustomer$(this.customerId, customer).subscribe({
            next: () => {
                this.matSnackbar.open(`Customer ${customer.name} have been updated.`, 'UPDATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/customer/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
