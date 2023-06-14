import { Injectable, inject } from '@angular/core';
import { AnnouncementApiService } from '../core/announcement-api.service';
import { AnnouncementStateService } from '../core/announcement-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IAnnouncement } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementFacadeService {
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
                throw err;
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
                throw err;
            }
        });
    }

    getAnnouncementList$() {
        return this.announcementState.getAnnouncementList$();
    }

    loadAnnouncement(announcementId: string, params?: OdataParams) {
        this.announcementState.setLoading(true);
        this.announcementAPI.getAnnouncement$(announcementId, params).pipe(
            finalize(() => {
                this.announcementState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.announcementState.setAnnouncement(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getAnnouncement$() {
        return this.announcementState.getAnnouncement$();
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
