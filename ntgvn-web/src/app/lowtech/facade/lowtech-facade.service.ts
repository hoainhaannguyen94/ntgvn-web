import { Injectable, inject } from '@angular/core';
import { LowtechApiService } from '../core/lowtech-api.service';
import { LowtechStateService } from '../core/lowtech-state.service';
import { GroupService, LogService, TagService } from '@utils/service';
import { OdataParams } from '@utils/http';
import { Observable, finalize } from 'rxjs';
import { IEvent } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class LowtechFacadeService {
    logService = inject(LogService);
    lowtechAPI = inject(LowtechApiService);
    lowtechState = inject(LowtechStateService);
    groupService = inject(GroupService);
    tagService = inject(TagService);

    isLoading$() {
        return this.lowtechState.isLoading$();
    }

    getCountEvents$() {
        return this.lowtechState.getCountEvents$();
    }

    loadCountEvents(params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.lowtechAPI.countEvents$(params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setCountEvents(res.value.count);
            },
            error: err => {
                this.logService.error('LowtechFacadeService', err);
            }
        });
    }

    loadEventList(params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.lowtechAPI.getEventList$(params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setEventList(res.value);
            },
            error: err => {
                this.logService.error('LowtechFacadeService', err);
            }
        });
    }

    getEventList$() {
        return this.lowtechState.getEventList$();
    }

    submitEvent$(lowtech: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.submitEvent$(lowtech).pipe(
                finalize(() => {
                    this.lowtechState.setLoading(false);
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

    updateEvent$(eventId: string, lowtech: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.updateEvent$(eventId, lowtech).pipe(
                finalize(() => {
                    this.lowtechState.setLoading(false);
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

    deleteEvent$(eventId: string) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.deleteEvent$(eventId).pipe(
                finalize(() => {
                    this.lowtechState.setLoading(false);
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

    completeEvent$(eventId: string) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.completeEvent$(eventId).pipe(
                finalize(() => {
                    this.lowtechState.setLoading(false);
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

    loadEventStatusList(params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.lowtechAPI.getEventStatusList$(params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setEventStatusList(res.value);
            },
            error: err => {
                this.logService.error('LowtechFacadeService', err);
            }
        });
    }

    getEventStatusList$() {
        return this.lowtechState.getEventStatusList$();
    }

    loadGroupList(params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.groupService.getGroupList$(params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setGroupList(res.value);
            },
            error: err => {
                this.logService.error('LowtechFacadeService', err);
            }
        });
    }

    getGroupList$() {
        return this.lowtechState.getGroupList$();
    }

    loadTagList(params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.tagService.getTagList$(params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setTagList(res.value);
            },
            error: err => {
                this.logService.error('LowtechFacadeService', err);
            }
        });
    }

    getTagList$() {
        return this.lowtechState.getTagList$();
    }
}
