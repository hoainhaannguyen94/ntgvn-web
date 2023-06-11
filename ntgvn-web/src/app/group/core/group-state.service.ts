import { Injectable } from '@angular/core';
import { IGroup } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupStateService {
    loading$ = new Subject<boolean>();
    groupList$ = new Subject<IGroup[]>();
    countgroups$ = new Subject<number>();
    group$ = new Subject<IGroup>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountGroups(count = 0) {
        return this.countgroups$.next(count);
    }

    getCountGroups$() {
        return this.countgroups$.asObservable();
    }

    getGroupList$() {
        return this.groupList$.asObservable();
    }

    setGroupList(groups: IGroup[]) {
        this.groupList$.next(groups);
    }

    getGroup$() {
        return this.group$.asObservable();
    }

    setGroup(group: IGroup) {
        this.group$.next(group);
    }
}
