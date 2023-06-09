import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountDevice, IDevice } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class DeviceService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/device`;

    countDevices$(params?: OdataParams) {
        return this.getItem<ICountDevice>(`${this.API_URL}/count`, null, params);
    }

    getDeviceList$(params?: OdataParams) {
        return this.getItems<IDevice>(`${this.API_URL}/list`, null, params);
    }

    getDevice$(deviceId: string, params?: OdataParams) {
        return this.getItem<IDevice>(`${this.API_URL}/${deviceId}`, null, params);
    }

    submitDevice$(device: Omit<IDevice, '_id'>) {
        return this.submitItem<Omit<IDevice, '_id'>>(`${this.API_URL}`, device);
    }

    updateDevice$(deviceId: string, device: Omit<IDevice, '_id'>) {
        return this.updateItem<Omit<IDevice, '_id'>>(`${this.API_URL}/${deviceId}`, device);
    }

    deleteDevice$(deviceId: string) {
        return this.deleteItem(`${this.API_URL}/${deviceId}`);
    }
}
