import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountRoom, IRoom } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class RoomService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/room`;

    countRooms$(params?: OdataParams) {
        return this.getItem<ICountRoom>(`${this.API_URL}/count`, null, params);
    }

    getRoomList$(params?: OdataParams) {
        return this.getItems<IRoom>(`${this.API_URL}/list`, null, params);
    }

    getRoom$(roomId: string, params?: OdataParams) {
        return this.getItem<IRoom>(`${this.API_URL}/${roomId}`, null, params);
    }

    submitRoom$(room: Omit<IRoom, '_id'>) {
        return this.submitItem<Omit<IRoom, '_id'>>(`${this.API_URL}`, room);
    }

    updateRoom$(roomId: string, room: Omit<IRoom, '_id'>) {
        return this.updateItem<Omit<IRoom, '_id'>>(`${this.API_URL}/${roomId}`, room);
    }

    deleteRoom$(roomId: string) {
        return this.deleteItem(`${this.API_URL}/${roomId}`);
    }
}
