import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountCustomer, ICustomer } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class CustomerService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/customer`;

    countCustomers$(params?: OdataParams) {
        return this.getItem<ICountCustomer>(`${this.API_URL}/count`, null, params);
    }

    getCustomerList$(params?: OdataParams) {
        return this.getItems<ICustomer>(`${this.API_URL}/list`, null, params);
    }

    getCustomer$(customerId: string, params?: OdataParams) {
        return this.getItem<ICustomer>(`${this.API_URL}/${customerId}`, null, params);
    }

    submitCustomer$(customer: Omit<ICustomer, '_id'>) {
        return this.submitItem<Omit<ICustomer, '_id'>>(`${this.API_URL}`, customer);
    }

    updateCustomer$(customerId: string, customer: Omit<ICustomer, '_id'>) {
        return this.updateItem<Omit<ICustomer, '_id'>>(`${this.API_URL}/${customerId}`, customer);
    }

    deleteCustomer$(customerId: string) {
        return this.deleteItem(`${this.API_URL}/${customerId}`);
    }
}
