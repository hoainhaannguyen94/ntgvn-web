import { Injectable } from '@angular/core';
import { IGroup, IUser, IUserRole } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    loading$ = new Subject<boolean>();
    userList$ = new Subject<IUser[]>();
    countUsers$ = new Subject<number>();
    userRoleList$ = new Subject<IUserRole[]>();
    groupList$ = new Subject<IGroup[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountUsers(count = 0) {
        return this.countUsers$.next(count);
    }

    getCountUsers$() {
        return this.countUsers$.asObservable();
    }

    getUserList$() {
        return this.userList$.asObservable();
    }

    setUserList(users: IUser[]) {
        this.userList$.next(users);
    }

    getUserRoleList$() {
        return this.userRoleList$.asObservable();
    }

    setUserRoleList(roles: IUserRole[]) {
        this.userRoleList$.next(roles);
    }

    getGroupList$() {
        return this.groupList$.asObservable();
    }

    setGroupList(groups: IGroup[]) {
        this.groupList$.next(groups);
    }
}
