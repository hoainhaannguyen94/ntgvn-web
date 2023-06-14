import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { ProductService } from '@utils/service';
import { OdataParams } from '@utils/http';
import { IWarehouse } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class ProductApiService extends ProductService {
    readonly WAREHOUSE_API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/warehouse`;

    getWarehouseList$(params?: OdataParams) {
        return this.getItems<IWarehouse>(`${this.WAREHOUSE_API_URL}/list`, null, params);
    }
}
