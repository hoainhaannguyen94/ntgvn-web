import { Injectable, inject } from '@angular/core';
import { UserApiService } from '../core/user-api.service';
import { UserStateService } from '../core/user-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IUser } from '@utils/schema';
import { GroupService, LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class UserFacadeService {
    logService = inject(LogService);
    userAPI = inject(UserApiService);
    userState = inject(UserStateService);
    groupService = inject(GroupService);

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
                this.logService.error('UserFacadeService', err);
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
                this.logService.error('UserFacadeService', err);
            }
        });
    }

    getUserList$() {
        return this.userState.getUserList$();
    }

    getUser$(userId: string, params?: OdataParams) {
        return this.userAPI.getUser$(userId, params);
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
                this.logService.error('UserFacadeService', err);
            }
        });
    }

    getUserRoleList$() {
        return this.userState.getUserRoleList$();
    }

    loadGroupList(params?: OdataParams) {
        this.userState.setLoading(true);
        this.groupService.getGroupList$(params).pipe(
            finalize(() => {
                this.userState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.userState.setGroupList(res.value);
            },
            error: err => {
                this.logService.error('UserFacadeService', err);
            }
        });
    }

    getGroupList$() {
        return this.userState.getGroupList$();
    }
}
