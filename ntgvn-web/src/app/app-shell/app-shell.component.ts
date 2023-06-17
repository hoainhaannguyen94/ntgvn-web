import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@utils/base/base.component';
import { AnonymousUser } from '@app-state';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../utils/service/auth.service';

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
                            this.appState.me = res.value.user;
                            this.appState.ready = true;
                            this.state.commit(this.appState);
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
        if (this.appState.me.role !== '6486e54057e051f88186a7e4') {
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
}
