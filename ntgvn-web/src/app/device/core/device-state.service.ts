import { Injectable } from '@angular/core';
import { IDevice } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {
    loading$ = new Subject<boolean>();
    deviceList$ = new Subject<IDevice[]>();
    countdevices$ = new Subject<number>();
    device$ = new Subject<IDevice>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountDevices(count = 0) {
        return this.countdevices$.next(count);
    }

    getCountDevices$() {
        return this.countdevices$.asObservable();
    }

    getDeviceList$() {
        return this.deviceList$.asObservable();
    }

    setDeviceList(devices: IDevice[]) {
        this.deviceList$.next(devices);
    }

    getDevice$() {
        return this.device$.asObservable();
    }

    setDevice(device: IDevice) {
        this.device$.next(device);
    }
}
