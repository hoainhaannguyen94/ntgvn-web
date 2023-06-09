import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService implements OnDestroy {
    subject$ = new Subject<any>();
    sharedData$ = this.subject$.asObservable();

    sharedData(data: any) {
        this.subject$.next(data);
    }

    ngOnDestroy() {
        this.subject$.complete();
    }
}
