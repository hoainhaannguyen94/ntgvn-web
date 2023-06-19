import { Injectable, inject } from '@angular/core';
import { LowtechApiService } from '../core/lowtech-api.service';
import { LowtechStateService } from '../core/lowtech-state.service';
import { GroupService, TagService } from '@utils/service';
import { OdataParams } from '@utils/http';
import { Observable, finalize } from 'rxjs';
import { IEvent } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class LowtechFacadeService {
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
                throw err;
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
                throw err;
            }
        });
    }

    getEventList$() {
        return this.lowtechState.getEventList$();
    }

    loadEvent(lowtechId: string, params?: OdataParams) {
        this.lowtechState.setLoading(true);
        this.lowtechAPI.getEvent$(lowtechId, params).pipe(
            finalize(() => {
                this.lowtechState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.lowtechState.setEvent(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getEvent$() {
        return this.lowtechState.getEvent$();
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

    updateEvent$(lowtechId: string, lowtech: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.updateEvent$(lowtechId, lowtech).pipe(
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

    deleteEvent$(lowtechId: string) {
        return new Observable((observer) => {
            this.lowtechState.setLoading(true);
            this.lowtechAPI.deleteEvent$(lowtechId).pipe(
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
                throw err;
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
                throw err;
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
                throw err;
            }
        });
    }

    getTagList$() {
        return this.lowtechState.getTagList$();
    }
}
