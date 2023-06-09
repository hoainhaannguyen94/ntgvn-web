import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpOptions } from './http.schema';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    http = inject(HttpClient);

    getItems<T>(url: string, headers?: HttpHeaders, params?: any) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        if (params) {
            requestOptions['params'] = params;
        }
        return this.http.get<any>(url, requestOptions);
    }

    getItem<T>(url: string, headers?: HttpHeaders, params?: any) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        if (params) {
            requestOptions['params'] = params;
        }
        return this.http.get<any>(url, requestOptions);
    }

    submitItem<T>(url: string, body: T, headers?: HttpHeaders) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        return this.http.post<any>(url, body, requestOptions);
    }

    updateItem<T>(url: string, body: T, headers?: HttpHeaders) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        return this.http.patch<any>(url, body, requestOptions);
    }

    deleteItem(url: string, headers?: HttpHeaders) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        return this.http.delete<any>(url, requestOptions);
    }

    replaceSpecialCharacters(value: string) {
        value = value.replace(/'/g, `''`);
        value = value.replace(/%/g, `%25`);
        value = value.replace(/\+/g, `%2B`);
        value = value.replace(/\//g, `%2F`);
        value = value.replace(/\?/g, `%3F`);
        value = value.replace(/#/g, `%23`);
        value = value.replace(/&/g, `%26`);
        return value;
    }
}
