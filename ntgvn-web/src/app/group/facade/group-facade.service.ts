import { Injectable, inject } from '@angular/core';
import { GroupApiService } from '../core/group-api.service';
import { GroupStateService } from '../core/group-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IGroup } from '@utils/schema';
import { LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class GroupFacadeService {
    logService = inject(LogService);
    groupAPI = inject(GroupApiService);
    groupState = inject(GroupStateService);

    isLoading$() {
        return this.groupState.isLoading$();
    }

    getCountGroups$() {
        return this.groupState.getCountGroups$();
    }

    loadCountGroups(params?: OdataParams) {
        this.groupState.setLoading(true);
        this.groupAPI.countGroups$(params).pipe(
            finalize(() => {
                this.groupState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.groupState.setCountGroups(res.value.count);
            },
            error: err => {
                this.logService.error('GroupFacadeService', err);
            }
        });
    }

    loadGroupList(params?: OdataParams) {
        this.groupState.setLoading(true);
        this.groupAPI.getGroupList$(params).pipe(
            finalize(() => {
                this.groupState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.groupState.setGroupList(res.value);
            },
            error: err => {
                this.logService.error('GroupFacadeService', err);
            }
        });
    }

    getGroupList$() {
        return this.groupState.getGroupList$();
    }

    getGroup$(groupId: string, params?: OdataParams) {
        return this.groupAPI.getGroup$(groupId, params);
    }

    submitGroup$(group: Omit<IGroup, '_id'>) {
        return new Observable((observer) => {
            this.groupState.setLoading(true);
            this.groupAPI.submitGroup$(group).pipe(
                finalize(() => {
                    this.groupState.setLoading(false);
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

    updateGroup$(groupId: string, group: Omit<IGroup, '_id'>) {
        return new Observable((observer) => {
            this.groupState.setLoading(true);
            this.groupAPI.updateGroup$(groupId, group).pipe(
                finalize(() => {
                    this.groupState.setLoading(false);
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

    deleteGroup$(groupId: string) {
        return new Observable((observer) => {
            this.groupState.setLoading(true);
            this.groupAPI.deleteGroup$(groupId).pipe(
                finalize(() => {
                    this.groupState.setLoading(false);
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
}
