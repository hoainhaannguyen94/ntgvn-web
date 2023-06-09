import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountWarehouse, IWarehouse } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class WarehouseService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/warehouse`;

    countWarehouses$(params?: OdataParams) {
        return this.getItem<ICountWarehouse>(`${this.API_URL}/count`, null, params);
    }

    getWarehouseList$(params?: OdataParams) {
        return this.getItems<IWarehouse>(`${this.API_URL}/list`, null, params);
    }

    getWarehouse$(warehouseId: string, params?: OdataParams) {
        return this.getItem<IWarehouse>(`${this.API_URL}/${warehouseId}`, null, params);
    }

    submitWarehouse$(warehouse: Omit<IWarehouse, '_id'>) {
        return this.submitItem<Omit<IWarehouse, '_id'>>(`${this.API_URL}`, warehouse);
    }

    updateWarehouse$(warehouseId: string, warehouse: Omit<IWarehouse, '_id'>) {
        return this.updateItem<Omit<IWarehouse, '_id'>>(`${this.API_URL}/${warehouseId}`, warehouse);
    }

    deleteWarehouse$(warehouseId: string) {
        return this.deleteItem(`${this.API_URL}/${warehouseId}`);
    }
}
