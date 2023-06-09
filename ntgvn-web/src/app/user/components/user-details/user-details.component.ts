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
import { BLANK_USER, IGroup, IUser, IUserRole } from '@utils/schema';
import { cloneDeep } from 'lodash';
import { take, takeUntil, debounceTime } from 'rxjs'
import { UserFacadeService } from '../../facade/user-facade.service';
import { LogService } from '@utils/service';

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
    logService = inject(LogService);
    activatedRoute = inject(ActivatedRoute);
    userFacade = inject(UserFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    userId = '';
    user = BLANK_USER;

    override formGroup = this.formBuilder.group({
        name: [BLANK_USER.name, [Validators.required]],
        address: [BLANK_USER.address, [Validators.required]],
        phoneNumber: [BLANK_USER.phoneNumber, [Validators.required]],
        email: [BLANK_USER.email, [Validators.required]],
        role: [BLANK_USER.role, [Validators.required]],
        _groupId: [BLANK_USER._groupId]
    });

    userRoleList: IUserRole[] = [];

    groupList: IGroup[] = [];

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.userId = value['id']
                this.userFacade.getUser$(this.userId).subscribe({
                    next: res => {
                        const user = res.value;
                        this.user = user;
                        this.originalData = cloneDeep(user);
                        this.formGroup.patchValue(user);
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
        this.userFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('UserDetailsComponent', err);
            }
        });

        this.userFacade.getUserRoleList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.userRoleList = value;
            }
        });

        this.userFacade.getGroupList$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.groupList = value;
            }
        });

        this.userFacade.loadUserRoleList({ $orderby: 'name asc' });

        this.userFacade.loadGroupList({ $orderby: '_id desc' });

    }

    cancelHandler() {
        this.back();
    }

    updateHandler() {
        const user = this.formGroup.value as any;
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
                this.logService.error('UserDetailsComponent', err);
            }
        });
    }
}
