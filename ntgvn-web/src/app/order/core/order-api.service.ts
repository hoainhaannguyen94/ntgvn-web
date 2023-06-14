import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OrderService } from '@utils/service';
import { OdataParams } from '@utils/http';
import { ICustomer, IProduct } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class OrderApiService extends OrderService {
    readonly PRODUCT_API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/product`;
    readonly CUSTOMER_API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/customer`;

    getProductList$(params?: OdataParams) {
        return this.getItems<IProduct>(`${this.PRODUCT_API_URL}/list`, null, params);
    }

    getCustomerList$(params?: OdataParams) {
        return this.getItems<ICustomer>(`${this.CUSTOMER_API_URL}/list`, null, params);
    }
}
