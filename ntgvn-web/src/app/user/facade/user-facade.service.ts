import { Injectable, inject } from '@angular/core';
import { UserApiService } from '../core/user-api.service';
import { UserStateService } from '../core/user-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IUser } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class UserFacadeService {
    userAPI = inject(UserApiService);
    userState = inject(UserStateService);

    isLoading$() {
        return this.userState.isLoading$();
    }

    getCountUsers$() {
        return this.userState.getCountUsers$();
    }

    loadCountUsers(params?: OdataParams) {
        this.userState.setLoading(true);
        this.userAPI.countUsers$(params).pipe(
            finalize(() => {
                this.userState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.userState.setCountUsers(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadUserList(params?: OdataParams) {
        this.userState.setLoading(true);
        this.userAPI.getUserList$(params).pipe(
            finalize(() => {
                this.userState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.userState.setUserList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getUserList$() {
        return this.userState.getUserList$();
    }

    loadUser(userId: string, params?: OdataParams) {
        this.userState.setLoading(true);
        this.userAPI.getUser$(userId, params).pipe(
            finalize(() => {
                this.userState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.userState.setUser(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getUser$() {
        return this.userState.getUser$();
    }

    submitUser$(user: Omit<IUser, '_id'>) {
        return new Observable((observer) => {
            this.userState.setLoading(true);
            this.userAPI.submitUser$(user).pipe(
                finalize(() => {
                    this.userState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    updateUser$(userId: string, user: Omit<IUser, '_id'>) {
        return new Observable((observer) => {
            this.userState.setLoading(true);
            this.userAPI.updateUser$(userId, user).pipe(
                finalize(() => {
                    this.userState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    deleteUser$(userId: string) {
        return new Observable((observer) => {
            this.userState.setLoading(true);
            this.userAPI.deleteUser$(userId).pipe(
                finalize(() => {
                    this.userState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    loadUserRoleList(params?: OdataParams) {
        this.userState.setLoading(true);
        this.userAPI.getUserRoleList$(params).pipe(
            finalize(() => {
                this.userState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.userState.setUserRoleList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getUserRoleList$() {
        return this.userState.getUserRoleList$();
    }
}
