import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs';
import { AnonymousUser, IAppState } from '@app-state';
import { OdataResponse } from '@utils/http';
import { AuthService, LogService, UserService } from '@utils/service';
import { StateService } from '@utils/state';

export const authCanActiveGuard = () => {
    const logService = inject(LogService);
    const router = inject(Router);
    const state = inject(StateService<IAppState>);
    const authService = inject(AuthService);
    const userService = inject(UserService);
    const appState = state.currentState;
    const token = localStorage.getItem('token') ?? '';
    const loadUserRoleList = () => {
        userService.getUserRoleList$({
            $orderby: 'name asc'
        }).subscribe({
            next: res => {
                appState.userRoles = res.value;
                state.commit(appState);
            }
        });
    }
    const verifyAccessTokenHanlder = (res: OdataResponse<any>) => {
        if (res.value.valid) {
            appState.token = token;
            appState.me = res.value.user;
            appState.ready = true;
            state.commit(appState);
            if (!appState.userRoles)
                loadUserRoleList();
        } else {
            localStorage.clear();
            appState.token = '';
            appState.me = AnonymousUser;
            appState.ready = false;
            state.commit(appState);
            router.navigate(['/login']);
        }
    }
    return authService.verifyAccessToken$().pipe(
        tap(res => { verifyAccessTokenHanlder(res); }),
        map(res => res.value.valid),
        catchError(err => {
            verifyAccessTokenHanlder({ value: { valid: false } });
            logService.error('authCanActiveGuard', err);
            throw err;
        })
    );
}
