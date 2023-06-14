import { Injectable } from '@angular/core';
import { IAnnouncement } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementStateService {
    loading$ = new Subject<boolean>();
    announcementList$ = new Subject<IAnnouncement[]>();
    countAnnouncements$ = new Subject<number>();
    announcement$ = new Subject<IAnnouncement>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountAnnouncements(count = 0) {
        return this.countAnnouncements$.next(count);
    }

    getCountAnnouncements$() {
        return this.countAnnouncements$.asObservable();
    }

    getAnnouncementList$() {
        return this.announcementList$.asObservable();
    }

    setAnnouncementList(announcements: IAnnouncement[]) {
        this.announcementList$.next(announcements);
    }

    getAnnouncement$() {
        return this.announcement$.asObservable();
    }

    setAnnouncement(announcement: IAnnouncement) {
        this.announcement$.next(announcement);
    }
}
