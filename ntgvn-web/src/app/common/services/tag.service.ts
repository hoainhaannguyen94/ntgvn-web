import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountTag, ITag } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class TagService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/tag`;

    countTags$(params?: OdataParams) {
        return this.getItem<ICountTag>(`${this.API_URL}/count`, null, params);
    }

    getTagList$(params?: OdataParams) {
        return this.getItems<ITag>(`${this.API_URL}/list`, null, params);
    }

    getTag$(tagId: string, params?: OdataParams) {
        return this.getItem<ITag>(`${this.API_URL}/${tagId}`, null, params);
    }

    submitTag$(tag: Omit<ITag, '_id'>) {
        return this.submitItem<Omit<ITag, '_id'>>(`${this.API_URL}`, tag);
    }

    updateTag$(tagId: string, tag: Omit<ITag, '_id'>) {
        return this.updateItem<Omit<ITag, '_id'>>(`${this.API_URL}/${tagId}`, tag);
    }

    deleteTag$(tagId: string) {
        return this.deleteItem(`${this.API_URL}/${tagId}`);
    }
}
