import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseFormSingleComponent } from '@utils/base/form';
import { ErrorMessageComponent } from '@utils/components/error-message';
import { InputWhitelistDirective } from '@utils/directives';
import { BLANK_CUSTOMER } from '@common/schemas';
import { debounceTime, takeUntil } from 'rxjs';
import { CustomerFacadeService } from '../../facade/customer-facade.service';
import { LogService } from '@utils/services';

@Component({
    selector: 'new-customer',
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
        ErrorMessageComponent,
        InputWhitelistDirective
    ],
    templateUrl: './new-customer.component.html',
    styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent extends BaseFormSingleComponent implements OnInit {
    log = inject(LogService);
    customerFacade = inject(CustomerFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_CUSTOMER.name, [Validators.required]],
        address: [BLANK_CUSTOMER.address, [Validators.required]],
        phoneNumber: [BLANK_CUSTOMER.phoneNumber, [Validators.required]]
    });

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.log('NewCustomerComponent', 'valueChanges', values);
        });
    }

    override registerCoreLayer() {
        this.customerFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/customer/list']);
    }

    submitHandler() {
        const customer = this.formGroup.value as any;
        this.customerFacade.submitCustomer$(customer).subscribe({
            next: () => {
                this.matSnackbar.open(`Customer ${customer.name} have been created.`, 'CREATE', {
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