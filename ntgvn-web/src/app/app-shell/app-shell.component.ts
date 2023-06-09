import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@utils/base/base.component';
import { AnonymousUser } from '@app-state';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    token = localStorage.getItem('token');

    router = inject(Router);

    ngOnInit() {
        this.verifyAccessToken();
    }

    verifyAccessToken() {
        if (this.token) {
            this.navToRoot();
        } else {
            this.restartApp();
        }
    }

    navToRoot() {
        this.router.navigate([this.appState.root]);
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
