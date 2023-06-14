import { Injectable } from '@angular/core';
import { IUser, IRoom } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RoomStateService {
    loading$ = new Subject<boolean>();
    roomList$ = new Subject<IRoom[]>();
    countRooms$ = new Subject<number>();
    room$ = new Subject<IRoom>();
    managerList$ = new Subject<IUser[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountRooms(count = 0) {
        return this.countRooms$.next(count);
    }

    getCountRooms$() {
        return this.countRooms$.asObservable();
    }

    getRoomList$() {
        return this.roomList$.asObservable();
    }

    setRoomList(rooms: IRoom[]) {
        this.roomList$.next(rooms);
    }

    getRoom$() {
        return this.room$.asObservable();
    }

    setRoom(room: IRoom) {
        this.room$.next(room);
    }

    getManagerList$() {
        return this.managerList$.asObservable();
    }

    setManagerList(users: IUser[]) {
        this.managerList$.next(users);
    }
}
