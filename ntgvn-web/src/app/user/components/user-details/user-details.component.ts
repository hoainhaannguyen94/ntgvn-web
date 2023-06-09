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
import { ErrorMessageComponent } from '@utils/components/error-message';
import { BLANK_USER, IUser, IUserRole } from '@common/schemas';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { UserFacadeService } from '../../facade/user-facade.service';

@Component({
    selector: 'user-details',
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
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent extends BaseFormSingleDetailsComponent<IUser> implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    userFacade = inject(UserFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    userId = '';
    user = BLANK_USER;

    override formGroup = this.formBuilder.group({
        _id: [BLANK_USER._id],
        name: [BLANK_USER.name, [Validators.required]],
        address: [BLANK_USER.address, [Validators.required]],
        phoneNumber: [BLANK_USER.phoneNumber, [Validators.required]],
        email: [BLANK_USER.email, [Validators.required]],
        role: [BLANK_USER.role, [Validators.required]]
    });

    userRoleList: IUserRole[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.userId = value['id']
                this.userFacade.loadUser(this.userId);
            }
        });
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(this.DEBOUNCE_TIME)).subscribe(values => {
            this.formValid = this.formGroup.valid;
            this.updateFormHasChanged(values);
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
        this.userFacade.getUser$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.user = value;
                this.originalData = cloneDeep(value);
                this.formGroup.patchValue(this.user);
            },
            error: err => {
                throw err;
            }
        });
    }

    cancelHandler() {
        this.router.navigate(['/user/list']);
    }

    updateHandler() {
        const user = this.formGroup.value as any;
        delete user._id;
        this.userFacade.updateUser$(this.userId, user).subscribe({
            next: () => {
                this.matSnackbar.open(`User ${user.name} have been updated.`, 'UPDATE', {
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
