import { HttpHeaders } from '@angular/common/http';

export type OdataParams = {
    [k: string]: any;
    $skip?: number;
    $top?: number;
    $filter?: string;
    $count?: boolean;
    $expand?: boolean;
    $orderby?: string;
    $select?: string;
}

export type OdataResponse<T> = {
    [k: string]: any;
    value: T;
}

export type HttpOptions = {
    [k: string]: any;
    headers?: HttpHeaders;
    params?: OdataParams;
}
