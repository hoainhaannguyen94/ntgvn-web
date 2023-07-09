import { Injectable, inject } from '@angular/core';
import { AnnouncementApiService } from '../core/announcement-api.service';
import { AnnouncementStateService } from '../core/announcement-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IAnnouncement } from '@utils/schema';
import { LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementFacadeService {
    logService = inject(LogService);
    announcementAPI = inject(AnnouncementApiService);
    announcementState = inject(AnnouncementStateService);

    isLoading$() {
        return this.announcementState.isLoading$();
    }

    getCountAnnouncements$() {
        return this.announcementState.getCountAnnouncements$();
    }

    loadCountAnnouncements(params?: OdataParams) {
        this.announcementState.setLoading(true);
        this.announcementAPI.countAnnouncements$(params).pipe(
            finalize(() => {
                this.announcementState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.announcementState.setCountAnnouncements(res.value.count);
            },
            error: err => {
                this.logService.error('AnnouncementFacadeService', err);
            }
        });
    }

    loadAnnouncementList(params?: OdataParams) {
        this.announcementState.setLoading(true);
        this.announcementAPI.getAnnouncementList$(params).pipe(
            finalize(() => {
                this.announcementState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.announcementState.setAnnouncementList(res.value);
            },
            error: err => {
                this.logService.error('AnnouncementFacadeService', err);
            }
        });
    }

    getAnnouncementList$() {
        return this.announcementState.getAnnouncementList$();
    }

    getAnnouncement$(announcementId: string, params?: OdataParams) {
        return this.announcementAPI.getAnnouncement$(announcementId, params);
    }

    submitAnnouncement$(announcement: Omit<IAnnouncement, '_id'>) {
        return new Observable((observer) => {
            this.announcementState.setLoading(true);
            this.announcementAPI.submitAnnouncement$(announcement).pipe(
                finalize(() => {
                    this.announcementState.setLoading(false);
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

    updateAnnouncement$(announcementId: string, announcement: Omit<IAnnouncement, '_id'>) {
        return new Observable((observer) => {
            this.announcementState.setLoading(true);
            this.announcementAPI.updateAnnouncement$(announcementId, announcement).pipe(
                finalize(() => {
                    this.announcementState.setLoading(false);
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

    deleteAnnouncement$(announcementId: string) {
        return new Observable((observer) => {
            this.announcementState.setLoading(true);
            this.announcementAPI.deleteAnnouncement$(announcementId).pipe(
                finalize(() => {
                    this.announcementState.setLoading(false);
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
