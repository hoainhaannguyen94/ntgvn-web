import { Injectable, inject } from '@angular/core';
import { SchedulerApiService } from '../core/scheduler-api.service';
import { SchedulerStateService } from '../core/scheduler-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IEvent } from '@utils/schema';
import { EventService, LogService, TagService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class SchedulerFacadeService {
    logService = inject(LogService);
    schedulerAPI = inject(SchedulerApiService);
    schedulerState = inject(SchedulerStateService);
    eventService = inject(EventService);
    tagService = inject(TagService);

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
                this.logService.error('SchedulerFacadeService', err);
            }
        });
    }

    getEventList$() {
        return this.schedulerState.getEventList$();
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
                this.logService.error('SchedulerFacadeService', err);
            }
        });
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

    getEventStatusList$() {
        return this.schedulerState.getEventStatusList$();
    }

    loadEventStatusList(params?: OdataParams) {
        this.schedulerState.setLoading(true);
        this.schedulerAPI.getEventStatusList$(params).pipe(
            finalize(() => {
                this.schedulerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.schedulerState.setEventStatusList(res.value);
            },
            error: err => {
                this.logService.error('SchedulerFacadeService', err);
            }
        });
    }

    getEventStatus$(eventStatusId: string) {
        return this.eventService.getEventStatus$(eventStatusId);
    }

    getTagList$(params: OdataParams) {
        return this.tagService.getTagList$(params);
    }
}
