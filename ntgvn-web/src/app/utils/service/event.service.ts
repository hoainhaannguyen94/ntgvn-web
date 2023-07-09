import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountEvent, IEvent, IEventStatus } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class EventService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/event`;

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

    completeEvent$(eventId: string) {
        return this.updateItem(`${this.API_URL}/${eventId}/status/completed`, null);
    }

    getEventStatusList$(params?: OdataParams) {
        return this.getItems<IEventStatus>(`${this.API_URL}/status/list`, null, params);
    }

    getEventStatus$(eventStatusId: string, params?: OdataParams) {
        return this.getItem<IEventStatus>(`${this.API_URL}/status/${eventStatusId}`, null, params);
    }

    assignEventToGroup$(eventId: string, _groupId: string) {
        return this.updateItem(`${this.API_URL}/${eventId}/assign`, { _groupId });
    }

    exportEventListExcel$() {
        return this.http.get(`${this.API_URL}/export/excel`, { responseType: 'blob' });
    }

    exportEventListPdf$() {
        return this.http.get(`${this.API_URL}/export/pdf`, { responseType: 'blob' });
    }
}
