import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountGroup, IGroup } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class GroupService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/group`;

    countGroups$(params?: OdataParams) {
        return this.getItem<ICountGroup>(`${this.API_URL}/count`, null, params);
    }

    getGroupList$(params?: OdataParams) {
        return this.getItems<IGroup>(`${this.API_URL}/list`, null, params);
    }

    getGroup$(groupId: string, params?: OdataParams) {
        return this.getItem<IGroup>(`${this.API_URL}/${groupId}`, null, params);
    }

    submitGroup$(group: Omit<IGroup, '_id'>) {
        return this.submitItem<Omit<IGroup, '_id'>>(`${this.API_URL}`, group);
    }

    updateGroup$(groupId: string, group: Omit<IGroup, '_id'>) {
        return this.updateItem<Omit<IGroup, '_id'>>(`${this.API_URL}/${groupId}`, group);
    }

    deleteGroup$(groupId: string) {
        return this.deleteItem(`${this.API_URL}/${groupId}`);
    }
}
