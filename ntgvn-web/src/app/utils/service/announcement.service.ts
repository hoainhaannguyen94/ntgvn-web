import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountAnnouncement, IAnnouncement } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/announcement`;

    countAnnouncements$(params?: OdataParams) {
        return this.getItem<ICountAnnouncement>(`${this.API_URL}/count`, null, params);
    }

    getAnnouncementList$(params?: OdataParams) {
        return this.getItems<IAnnouncement>(`${this.API_URL}/list`, null, params);
    }

    getAnnouncement$(announcementId: string, params?: OdataParams) {
        return this.getItem<IAnnouncement>(`${this.API_URL}/${announcementId}`, null, params);
    }

    submitAnnouncement$(announcement: Omit<IAnnouncement, '_id'>) {
        return this.submitItem<Omit<IAnnouncement, '_id'>>(`${this.API_URL}`, announcement);
    }

    updateAnnouncement$(announcementId: string, announcement: Omit<IAnnouncement, '_id'>) {
        return this.updateItem<Omit<IAnnouncement, '_id'>>(`${this.API_URL}/${announcementId}`, announcement);
    }

    deleteAnnouncement$(announcementId: string) {
        return this.deleteItem(`${this.API_URL}/${announcementId}`);
    }
}
