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
import { ErrorMessageComponent } from '@utils/components/error-message';
import { BLANK_USER, IUserRole } from '@common/schemas';
import { debounceTime, takeUntil } from 'rxjs';
import { UserFacadeService } from '../../facade/user-facade.service';
import { LogService } from '@utils/services';

@Component({
    selector: 'new-user',
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
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent extends BaseFormSingleComponent implements OnInit {
    log = inject(LogService);
    userFacade = inject(UserFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    override formGroup = this.formBuilder.group({
        name: [BLANK_USER.name, [Validators.required]],
        address: [BLANK_USER.address, [Validators.required]],
        phoneNumber: [BLANK_USER.phoneNumber, [Validators.required]],
        email: [BLANK_USER.email, [Validators.required]],
        role: [BLANK_USER.role, [Validators.required]]
    });

    userRoleList: IUserRole[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.log.log('NewUserComponent', 'valueChanges', values);
        });
    }

    override registerCoreLayer() {
        this.userFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.userFacade.getUserRoleList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.userRoleList = value;
            }
        });
        this.userFacade.loadUserRoleList();
    }

    cancelHandler() {
        this.router.navigate(['/user/list']);
    }

    submitHandler() {
        const user = this.formGroup.value as any;
        user['password'] = '123456';
        this.userFacade.submitUser$(user).subscribe({
            next: () => {
                this.matSnackbar.open(`User ${user.name} have been created.`, 'CREATE', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.router.navigate(['/user/list']);
            },
            error: err => {
                throw err;
            }
        });
    }
}
