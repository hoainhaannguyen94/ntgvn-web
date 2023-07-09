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
import { ErrorMessageComponent } from '@utils/component/error-message';
import { InputWhitelistDirective } from '@utils/directive';
import { BLANK_CUSTOMER } from '@utils/schema';
import { debounceTime, takeUntil } from 'rxjs';
import { CustomerFacadeService } from '../../facade/customer-facade.service';
import { LogService } from '@utils/service';

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
    logService = inject(LogService);
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
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe({
            next: value => {
                this.logService.info('NewCustomerComponent', 'valueChanges', value);
            }
        });
    }

    override registerCoreLayer() {
        this.customerFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('NewCustomerComponent', err);
            }
        });
    }

    cancelHandler() {
        this.back();
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
                this.logService.error('NewCustomerComponent', err);
            }
        });
    }
}
