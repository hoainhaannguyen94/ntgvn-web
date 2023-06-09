import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { OdataParams, OdataResponse, HttpOptions } from './http.schema';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class OdataService extends HttpService {
    override getItems<T>(url: string, headers?: HttpHeaders, params?: OdataParams) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        if (params) {
            const requestParams: OdataParams = {}
            if (params.$count) {
                requestParams['$count'] = params.$count;
            }
            if (params.$expand) {
                requestParams['$expand'] = params.$expand;
            }
            if (params.$filter) {
                requestParams['$filter'] = params.$filter;
            }
            if (params.$orderby) {
                requestParams['$orderby'] = params.$orderby;
            }
            if (params.$select) {
                requestParams['$select'] = params.$select;
            }
            if (typeof (params.$skip) === 'number' && params.$skip >= 0) {
                requestParams['$skip'] = params.$skip;
            }
            if (typeof (params.$top) === 'number' && params.$top >= 0) {
                requestParams['$top'] = params.$top;
            }
            requestOptions['params'] = requestParams;
        }
        return this.http.get<OdataResponse<T[]>>(url, requestOptions);
    }

    override getItem<T>(url: string, headers?: HttpHeaders, params?: Omit<OdataParams, '$skip' | '$top' | '$filter' | '$count' | '$orderby'>) {
        const requestOptions: HttpOptions = {}
        if (headers) {
            requestOptions['headers'] = headers;
        }
        if (params) {
            requestOptions['params'] = params;
        }
        return this.http.get<OdataResponse<T>>(url, requestOptions);
    }
}
