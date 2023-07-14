import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, tap, catchError } from 'rxjs';
import { AnonymousUser, IAppState } from '@app-state';
import { OdataResponse } from '@utils/http';
import { AuthService, LogService, UserService } from '@utils/service';
import { StateService } from '@utils/state';
import { IAppStore } from '@utils/ngrx-store';
import { Store } from '@ngrx/store';
import * as UserActions from '@utils/ngrx-store';

export const authCanActiveGuard = () => {
    const logService = inject(LogService);
    const router = inject(Router);
    const state = inject(StateService<IAppState>);
    const authService = inject(AuthService);
    const userService = inject(UserService);
    const appStore: Store<IAppStore> = inject(Store<IAppStore>);

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
            const user = res.value.user;
            appState.token = token;
            appState.me = user;
            appState.ready = true;
            state.commit(appState);
            appStore.dispatch(UserActions.updateUser(user));
            if (!appState.userRoles)
                loadUserRoleList();
        } else {
            localStorage.clear();
            appState.token = '';
            appState.me = AnonymousUser;
            appState.ready = false;
            state.commit(appState);
            appStore.dispatch(UserActions.resetUser());
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
