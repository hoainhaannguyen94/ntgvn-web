import { Injectable, inject } from '@angular/core';
import { EventApiService } from '../core/event-api.service';
import { EventStateService } from '../core/event-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IEvent } from '@utils/schema';
import { GroupService, LogService, TagService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class EventFacadeService {
    logService = inject(LogService);
    eventAPI = inject(EventApiService);
    eventState = inject(EventStateService);
    groupService = inject(GroupService);
    tagService = inject(TagService);

    isLoading$() {
        return this.eventState.isLoading$();
    }

    getCountEvents$() {
        return this.eventState.getCountEvents$();
    }

    loadCountEvents(params?: OdataParams) {
        this.eventState.setLoading(true);
        this.eventAPI.countEvents$(params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setCountEvents(res.value.count);
            },
            error: err => {
                this.logService.error('EventFacadeService', err);
            }
        });
    }

    loadEventList(params?: OdataParams) {
        this.eventState.setLoading(true);
        this.eventAPI.getEventList$(params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setEventList(res.value);
            },
            error: err => {
                this.logService.error('EventFacadeService', err);
            }
        });
    }

    getEventList$() {
        return this.eventState.getEventList$();
    }

    getEvent$(eventId: string, params?: OdataParams) {
        return this.eventAPI.getEvent$(eventId, params);
    }

    submitEvent$(event: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.eventState.setLoading(true);
            this.eventAPI.submitEvent$(event).pipe(
                finalize(() => {
                    this.eventState.setLoading(false);
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

    updateEvent$(eventId: string, event: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.eventState.setLoading(true);
            this.eventAPI.updateEvent$(eventId, event).pipe(
                finalize(() => {
                    this.eventState.setLoading(false);
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
            this.eventState.setLoading(true);
            this.eventAPI.deleteEvent$(eventId).pipe(
                finalize(() => {
                    this.eventState.setLoading(false);
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
        this.eventState.setLoading(true);
        this.eventAPI.getEventStatusList$(params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setEventStatusList(res.value);
            },
            error: err => {
                this.logService.error('EventFacadeService', err);
            }
        });
    }

    getEventStatusList$() {
        return this.eventState.getEventStatusList$();
    }

    getEventStatus$(eventStatusId: string, params?: OdataParams) {
        return this.eventAPI.getEventStatus$(eventStatusId, params);
    }

    loadGroupList(params?: OdataParams) {
        this.eventState.setLoading(true);
        this.groupService.getGroupList$(params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setGroupList(res.value);
            },
            error: err => {
                this.logService.error('EventFacadeService', err);
            }
        });
    }

    getGroupList$() {
        return this.eventState.getGroupList$();
    }

    loadTagList(params?: OdataParams) {
        this.eventState.setLoading(true);
        this.tagService.getTagList$(params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setTagList(res.value);
            },
            error: err => {
                this.logService.error('EventFacadeService', err);
            }
        });
    }

    getTagList$() {
        return this.eventState.getTagList$();
    }

    assignEventToGroup$(eventId: string, _groupId: string) {
        return this.eventAPI.assignEventToGroup$(eventId, _groupId);
    }

    exportEventListExcel$() {
        return this.eventAPI.exportEventListExcel$();
    }
}
