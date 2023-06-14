import { Injectable, inject } from '@angular/core';
import { RoomApiService } from '../core/room-api.service';
import { RoomStateService } from '../core/room-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IRoom } from '@utils/schema';
import { UserService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class RoomFacadeService {
    roomAPI = inject(RoomApiService);
    roomState = inject(RoomStateService);
    userService = inject(UserService);

    isLoading$() {
        return this.roomState.isLoading$();
    }

    getCountRooms$() {
        return this.roomState.getCountRooms$();
    }

    loadCountRooms(params?: OdataParams) {
        this.roomState.setLoading(true);
        this.roomAPI.countRooms$(params).pipe(
            finalize(() => {
                this.roomState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.roomState.setCountRooms(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadRoomList(params?: OdataParams) {
        this.roomState.setLoading(true);
        this.roomAPI.getRoomList$(params).pipe(
            finalize(() => {
                this.roomState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.roomState.setRoomList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getRoomList$() {
        return this.roomState.getRoomList$();
    }

    loadRoom(roomId: string, params?: OdataParams) {
        this.roomState.setLoading(true);
        this.roomAPI.getRoom$(roomId, params).pipe(
            finalize(() => {
                this.roomState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.roomState.setRoom(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getRoom$() {
        return this.roomState.getRoom$();
    }

    submitRoom$(room: Omit<IRoom, '_id'>) {
        return new Observable((observer) => {
            this.roomState.setLoading(true);
            this.roomAPI.submitRoom$(room).pipe(
                finalize(() => {
                    this.roomState.setLoading(false);
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

    updateRoom$(roomId: string, room: Omit<IRoom, '_id'>) {
        return new Observable((observer) => {
            this.roomState.setLoading(true);
            this.roomAPI.updateRoom$(roomId, room).pipe(
                finalize(() => {
                    this.roomState.setLoading(false);
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

    deleteRoom$(roomId: string) {
        return new Observable((observer) => {
            this.roomState.setLoading(true);
            this.roomAPI.deleteRoom$(roomId).pipe(
                finalize(() => {
                    this.roomState.setLoading(false);
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

    loadManagerList(params?: OdataParams) {
        this.roomState.setLoading(true);
        this.userService.getUserList$(params).pipe(
            finalize(() => {
                this.roomState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.roomState.setManagerList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getManagerList$() {
        return this.roomState.getManagerList$();
    }
}
