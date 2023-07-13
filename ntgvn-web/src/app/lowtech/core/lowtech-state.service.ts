import { Injectable } from '@angular/core';
import { IEvent, IEventStatus, IGroup, ITag } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LowtechStateService {
    loading$ = new Subject<boolean>();
    eventList$ = new Subject<IEvent[]>();
    countEvents$ = new Subject<number>();
    eventStatusList$ = new Subject<IEventStatus[]>();
    groupList$ = new Subject<IGroup[]>();
    tagList$ = new Subject<ITag[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountEvents(count = 0) {
        return this.countEvents$.next(count);
    }

    getCountEvents$() {
        return this.countEvents$.asObservable();
    }

    getEventList$() {
        return this.eventList$.asObservable();
    }

    setEventList(events: IEvent[]) {
        this.eventList$.next(events);
    }

    getEventStatusList$() {
        return this.eventStatusList$.asObservable();
    }

    setEventStatusList(eventStatus: IEventStatus[]) {
        this.eventStatusList$.next(eventStatus);
    }

    getGroupList$() {
        return this.groupList$.asObservable();
    }

    setGroupList(users: IGroup[]) {
        this.groupList$.next(users);
    }

    getTagList$() {
        return this.tagList$.asObservable();
    }

    setTagList(users: ITag[]) {
        this.tagList$.next(users);
    }
}
