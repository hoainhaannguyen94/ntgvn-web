import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataParams, OdataService } from '@utils/http';

@Injectable({
    providedIn: 'root'
})
export class OpenWeartherService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/open-weather`;

    getCurrentWeather$(params?: OdataParams) {
        return this.getItem<any>(`${this.API_URL}/current-weather`, null, params);
    }

    get5DaysWeather$(params?: OdataParams) {
        return this.getItem<any>(`${this.API_URL}/5-days-weather`, null, params);
    }

    directGeocoding$(params?: OdataParams) {
        return this.getItem<any>(`${this.API_URL}/direct-geocoding`, null, params);
    }

    geocodingByZip$(params?: OdataParams) {
        return this.getItem<any>(`${this.API_URL}/geocoding-by-zip`, null, params);
    }
}
