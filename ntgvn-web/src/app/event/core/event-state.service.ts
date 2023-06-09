import { Injectable } from '@angular/core';
import { IEvent } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventStateService {
    loading$ = new Subject<boolean>();
    eventList$ = new Subject<IEvent[]>();
    countEvents$ = new Subject<number>();
    event$ = new Subject<IEvent>();

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
}
