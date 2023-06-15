import { Injectable } from '@angular/core';
import { IEvent, IGroup, ITag } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventStateService {
    loading$ = new Subject<boolean>();
    eventList$ = new Subject<IEvent[]>();
    countEvents$ = new Subject<number>();
    event$ = new Subject<IEvent>();
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

    getEvent$() {
        return this.event$.asObservable();
    }

    setEvent(event: IEvent) {
        this.event$.next(event);
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
