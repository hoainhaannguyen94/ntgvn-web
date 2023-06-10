import { Injectable, inject } from '@angular/core';
import { SchedulerApiService } from '../core/scheduler-api.service';
import { SchedulerStateService } from '../core/scheduler-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IEvent } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class SchedulerFacadeService {
    schedulerAPI = inject(SchedulerApiService);
    schedulerState = inject(SchedulerStateService);

    isLoading$() {
        return this.schedulerState.isLoading$();
    }

    getCountEvents$() {
        return this.schedulerState.getCountEvents$();
    }

    loadCountEvents(params?: OdataParams) {
        this.schedulerState.setLoading(true);
        this.schedulerAPI.countEvents$(params).pipe(
            finalize(() => {
                this.schedulerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.schedulerState.setCountEvents(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadEventList(params?: OdataParams) {
        this.schedulerState.setLoading(true);
        this.schedulerAPI.getEventList$(params).pipe(
            finalize(() => {
                this.schedulerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.schedulerState.setEventList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getEventList$() {
        return this.schedulerState.getEventList$();
    }

    loadEvent(eventId: string, params?: OdataParams) {
        this.schedulerState.setLoading(true);
        this.schedulerAPI.getEvent$(eventId, params).pipe(
            finalize(() => {
                this.schedulerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.schedulerState.setEvent(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getEvent$() {
        return this.schedulerState.getEvent$();
    }

    submitEvent$(event: Omit<IEvent, '_id'>) {
        return new Observable((observer) => {
            this.schedulerState.setLoading(true);
            this.schedulerAPI.submitEvent$(event).pipe(
                finalize(() => {
                    this.schedulerState.setLoading(false);
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
            this.schedulerState.setLoading(true);
            this.schedulerAPI.updateEvent$(eventId, event).pipe(
                finalize(() => {
                    this.schedulerState.setLoading(false);
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
            this.schedulerState.setLoading(true);
            this.schedulerAPI.deleteEvent$(eventId).pipe(
                finalize(() => {
                    this.schedulerState.setLoading(false);
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