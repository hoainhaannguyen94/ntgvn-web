import { Injectable, inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoginApiService } from '../core/login-api.service';
import { LoginStateService } from '../core/login-state.service';

@Injectable({
    providedIn: 'root'
})
export class LoginFacadeService {
    loginAPI = inject(LoginApiService);
    loginState = inject(LoginStateService);

    isLoading$() {
        return this.loginState.isLoading$();
    }

    login$(phoneNumber: string, password: string): Observable<string> {
        return new Observable<string>(observer => {
            this.loginState.setLoading(true);
            this.loginAPI.getToken$(phoneNumber, password).pipe(
                finalize(() => {
                    this.loginState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    localStorage.setItem('token', res.value);
                    observer.next(res.value);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }
}
