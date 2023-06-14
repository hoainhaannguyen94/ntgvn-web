import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OdataResponse } from '@utils/http';
import { GLOBAL_SETTINGS } from '@global-settings';
import { IAuthVerifyToken } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    readonly URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/auth`;

    http = inject(HttpClient);

    getToken$(phoneNumber: string, password: string) {
        const url = `${this.URL}/token`;
        return this.http.post<OdataResponse<any>>(url, { phoneNumber: phoneNumber, password: password });
    }

    verifyAccessToken$() {
        const url = `${this.URL}/me`;
        return this.http.get<OdataResponse<IAuthVerifyToken>>(url);
    }
}
