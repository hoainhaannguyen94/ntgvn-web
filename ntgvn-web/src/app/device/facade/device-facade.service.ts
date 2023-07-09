import { Injectable, inject } from '@angular/core';
import { DeviceApiService } from '../core/device-api.service';
import { DeviceStateService } from '../core/device-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IDevice } from '@utils/schema';
import { LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class DeviceFacadeService {
    logService = inject(LogService);
    deviceAPI = inject(DeviceApiService);
    deviceState = inject(DeviceStateService);

    isLoading$() {
        return this.deviceState.isLoading$();
    }

    getCountDevices$() {
        return this.deviceState.getCountDevices$();
    }

    loadCountDevices(params?: OdataParams) {
        this.deviceState.setLoading(true);
        this.deviceAPI.countDevices$(params).pipe(
            finalize(() => {
                this.deviceState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.deviceState.setCountDevices(res.value.count);
            },
            error: err => {
                this.logService.error('DeviceFacadeService', err);
            }
        });
    }

    loadDeviceList(params?: OdataParams) {
        this.deviceState.setLoading(true);
        this.deviceAPI.getDeviceList$(params).pipe(
            finalize(() => {
                this.deviceState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.deviceState.setDeviceList(res.value);
            },
            error: err => {
                this.logService.error('DeviceFacadeService', err);
            }
        });
    }

    getDeviceList$() {
        return this.deviceState.getDeviceList$();
    }

    getDevice$(deviceId: string, params?: OdataParams) {
        return this.deviceAPI.getDevice$(deviceId, params);
    }

    submitDevice$(device: Omit<IDevice, '_id'>) {
        return new Observable((observer) => {
            this.deviceState.setLoading(true);
            this.deviceAPI.submitDevice$(device).pipe(
                finalize(() => {
                    this.deviceState.setLoading(false);
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

    updateDevice$(deviceId: string, device: Omit<IDevice, '_id'>) {
        return new Observable((observer) => {
            this.deviceState.setLoading(true);
            this.deviceAPI.updateDevice$(deviceId, device).pipe(
                finalize(() => {
                    this.deviceState.setLoading(false);
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

    deleteDevice$(deviceId: string) {
        return new Observable((observer) => {
            this.deviceState.setLoading(true);
            this.deviceAPI.deleteDevice$(deviceId).pipe(
                finalize(() => {
                    this.deviceState.setLoading(false);
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
}
