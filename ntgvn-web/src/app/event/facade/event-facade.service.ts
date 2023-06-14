import { Injectable, inject } from '@angular/core';
import { EventApiService } from '../core/event-api.service';
import { EventStateService } from '../core/event-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IEvent } from '@utils/schema';
import { GroupService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class EventFacadeService {
    eventAPI = inject(EventApiService);
    eventState = inject(EventStateService);
    groupService = inject(GroupService);

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
                throw err;
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
                throw err;
            }
        });
    }

    getEventList$() {
        return this.eventState.getEventList$();
    }

    loadEvent(eventId: string, params?: OdataParams) {
        this.eventState.setLoading(true);
        this.eventAPI.getEvent$(eventId, params).pipe(
            finalize(() => {
                this.eventState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.eventState.setEvent(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getEvent$() {
        return this.eventState.getEvent$();
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
                throw err;
            }
        });
    }

    getGroupList$() {
        return this.eventState.getGroupList$();
    }
}
