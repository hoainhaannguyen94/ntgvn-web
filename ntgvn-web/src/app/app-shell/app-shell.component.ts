import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@utils/base/base.component';
import { AnonymousUser } from '@app-state';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, UserService } from '@utils/service';
import * as UserActions from '@utils/ngrx-store';

@Component({
    selector: 'app-shell',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './app-shell.component.html',
    styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent extends BaseComponent implements OnInit {
    router = inject(Router);
    authService = inject(AuthService);
    userService = inject(UserService);

    token = localStorage.getItem('token');

    ngOnInit() {
        this.verifyAccessToken();
    }

    verifyAccessToken() {
        if (this.token) {
            if (this.appState.me._id) {
                this.navToRoot();
            } else {
                this.authService.verifyAccessToken$().subscribe({
                    next: res => {
                        if (res.value.valid) {
                            const user = res.value.user;
                            this.appState.me = user;
                            this.appState.ready = true;
                            this.state.commit(this.appState);
                            this.appStore.dispatch(UserActions.updateUser(user));
                            this.navToRoot();
                        } else {
                            this.restartApp();
                        }
                    },
                    error: () => {
                        this.restartApp();
                    }
                });
            }
            return;
        }
        this.restartApp();
    }

    navToRoot() {
        this.loadUserRoleList();
        if (this.appState.me['roleName'] !== 'member') {
            this.router.navigate([this.appState.root]);
        } else {
            this.router.navigate(['/lowtech']);
        }
    }

    clearAppStorage() {
        localStorage.clear();
        this.appState.ready = false;
        this.appState.token = '';
        this.appState.me = AnonymousUser;
        this.appStore.dispatch(UserActions.resetUser());
    }

    syncAppState() {
        this.state.commit(this.appState);
    }

    navToLogin() {
        this.router.navigate(['/login']);
    }

    restartApp() {
        this.clearAppStorage();
        this.syncAppState();
        this.navToLogin();
    }

    loadUserRoleList() {
        if (!this.appState.userRoles) {
            this.userService.getUserRoleList$({
                $orderby: 'name asc'
            }).subscribe({
                next: res => {
                    this.appState.userRoles = res.value;
                    this.state.commit(this.appState);
                }
            });
        }
    }
}
