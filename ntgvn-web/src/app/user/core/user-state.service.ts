import { Injectable } from '@angular/core';
import { IGroup, IUser, IUserRole } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    loading$ = new Subject<boolean>();
    userList$ = new Subject<IUser[]>();
    countUsers$ = new Subject<number>();
    user$ = new Subject<IUser>();
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

    getUser$() {
        return this.user$.asObservable();
    }

    setUser(user: IUser) {
        this.user$.next(user);
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
