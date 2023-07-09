import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { LoginFacadeService } from './facade/login-facade.service';
import { BaseComponent } from '@utils/base/base.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ErrorMessageComponent } from '@utils/component/error-message';

@Component({
    selector: 'login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        A11yModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatProgressBarModule,
        ErrorMessageComponent
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('inputPassword') inputPassword: ElementRef<HTMLInputElement>;

    loginFacade = inject(LoginFacadeService);
    router = inject(Router);
    matSnackbar = inject(MatSnackBar);
    formBuilder = inject(FormBuilder);

    isShowPassword = false;

    formGroup = this.formBuilder.group({
        phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]]
    });
    formHasChanged = false;
    formValid = false;

    ngOnInit() {
        this.registerCoreLayer();
        this.regLoginFormEvent();
    }

    override registerCoreLayer() {
        this.loginFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
    }
    regLoginFormEvent() {
        this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.formHasChanged = this.formGroup.dirty;
                this.formValid = this.formGroup.valid;
            }
        });
    }

    showPassword(event: MouseEvent) {
        event.stopPropagation();
        this.isShowPassword = true;
        this.inputPassword.nativeElement.setAttribute('type', 'text');
    }

    hidePassword(event: MouseEvent) {
        event.stopPropagation();
        this.isShowPassword = false;
        this.inputPassword.nativeElement.setAttribute('type', 'password');
    }

    login() {
        const body = this.formGroup.value as any;
        this.loginFacade.login$(body.phoneNumber, body.password).subscribe({
            next: () => {
                this.matSnackbar.open(`You are successfully logged in.`, 'LOGIN', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
                this.navigateToAppShell();
            },
            error: () => {
                this.matSnackbar.open(`Check your account info and try again.`, 'LOGIN', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center'
                });
            }
        });
    }

    navigateToAppShell() {
        this.router.navigate(['/shell']);
    }

    @HostListener('window:keydown.enter', ['$event']) handleEnterKeyDown() {
        this.login();
    }
}
