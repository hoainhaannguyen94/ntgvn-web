import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OrderService } from '@common/services';
import { OdataParams } from '@utils/http';
import { ICustomer, IProduct } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class OrderApiService extends OrderService {
    readonly PRODUCT_API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/product`;
    readonly CUSTOMER_API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/customer`;

    getProductList$(params?: OdataParams) {
        return this.getItems<IProduct>(`${this.PRODUCT_API_URL}/list`, null, params);
    }

    getCustomerList$(params?: OdataParams) {
        return this.getItems<ICustomer>(`${this.CUSTOMER_API_URL}/list`, null, params);
    }
}
