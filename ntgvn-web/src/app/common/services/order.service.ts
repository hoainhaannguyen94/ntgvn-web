import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountOrder, IOrder, IOrderStatus } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/order`;

    countOrders$(params?: OdataParams) {
        return this.getItem<ICountOrder>(`${this.API_URL}/count`, null, params);
    }

    getOrdersTop10$() {
        return this.getItems<IOrder>(`${this.API_URL}/list`, null, { $top: 10, $orderby: '_id desc' });
    }

    getOrderList$(params?: OdataParams) {
        return this.getItems<IOrder>(`${this.API_URL}/list`, null, params);
    }

    getOrder$(orderId: string, params?: OdataParams) {
        return this.getItem<IOrder>(`${this.API_URL}/${orderId}`, null, params);
    }

    submitOrder$(order: Omit<IOrder, '_id'>) {
        return this.submitItem<Omit<IOrder, '_id'>>(`${this.API_URL}`, order);
    }

    updateOrder$(orderId: string, order: Omit<IOrder, '_id'>) {
        return this.updateItem<Omit<IOrder, '_id'>>(`${this.API_URL}/${orderId}`, order);
    }

    deleteOrder$(orderId: string) {
        return this.deleteItem(`${this.API_URL}/${orderId}`);
    }

    getOrderStatusList$(params?: OdataParams) {
        return this.getItems<IOrderStatus>(`${this.API_URL}/status/list`, null, params);
    }

    getOrderStatus$(orderStatusId: string, params?: OdataParams) {
        return this.getItem<IOrderStatus>(`${this.API_URL}/status/${orderStatusId}`, null, params);
    }
}
