import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountEvent, IEvent } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class EventService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/event`;

    countEvents$(params?: OdataParams) {
        return this.getItem<ICountEvent>(`${this.API_URL}/count`, null, params);
    }

    getEventList$(params?: OdataParams) {
        return this.getItems<IEvent>(`${this.API_URL}/list`, null, params);
    }

    getEvent$(eventId: string, params?: OdataParams) {
        return this.getItem<IEvent>(`${this.API_URL}/${eventId}`, null, params);
    }

    submitEvent$(event: Omit<IEvent, '_id'>) {
        return this.submitItem<Omit<IEvent, '_id'>>(`${this.API_URL}`, event);
    }

    updateEvent$(eventId: string, event: Omit<IEvent, '_id'>) {
        return this.updateItem<Omit<IEvent, '_id'>>(`${this.API_URL}/${eventId}`, event);
    }

    deleteEvent$(eventId: string) {
        return this.deleteItem(`${this.API_URL}/${eventId}`);
    }
}
