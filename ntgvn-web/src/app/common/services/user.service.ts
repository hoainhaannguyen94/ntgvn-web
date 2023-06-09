import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountUser, IUser, IUserRole } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class UserService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/user`;

    countUsers$(params?: OdataParams) {
        return this.getItem<ICountUser>(`${this.API_URL}/count`, null, params);
    }

    getUserList$(params?: OdataParams) {
        return this.getItems<IUser>(`${this.API_URL}/list`, null, params);
    }

    getUser$(userId: string, params?: OdataParams) {
        return this.getItem<IUser>(`${this.API_URL}/${userId}`, null, params);
    }

    submitUser$(user: Omit<IUser, '_id'>) {
        return this.submitItem<Omit<IUser, '_id'>>(`${this.API_URL}`, user);
    }

    updateUser$(userId: string, user: Omit<IUser, '_id'>) {
        return this.updateItem<Omit<IUser, '_id'>>(`${this.API_URL}/${userId}`, user);
    }

    deleteUser$(userId: string) {
        return this.deleteItem(`${this.API_URL}/${userId}`);
    }

    getUserRoleList$(params?: OdataParams) {
        return this.getItems<IUserRole>(`${this.API_URL}/role/list`, null, params);
    }

    getUserRole$(orderStatusId: string, params?: OdataParams) {
        return this.getItem<IUserRole>(`${this.API_URL}/role/${orderStatusId}`, null, params);
    }
}
