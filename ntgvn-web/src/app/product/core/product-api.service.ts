import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { ProductService } from '@common/services';
import { OdataParams } from '@utils/http';
import { IWarehouse } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class ProductApiService extends ProductService {
    readonly WAREHOUSE_API_URL = `${GLOBAL_SETTINGS.server}/${GLOBAL_SETTINGS.apiVersion}/api/warehouse`;

    getWarehouseList$(params?: OdataParams) {
        return this.getItems<IWarehouse>(`${this.WAREHOUSE_API_URL}/list`, null, params);
    }
}
