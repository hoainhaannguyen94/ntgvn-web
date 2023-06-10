import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountProduct, IProduct, IProductCategory } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/product`;

    countProducts$(params?: OdataParams) {
        return this.getItem<ICountProduct>(`${this.API_URL}/count`, null, params);
    }

    getProductList$(params?: OdataParams) {
        return this.getItems<IProduct>(`${this.API_URL}/list`, null, params);
    }

    getProduct$(productId: string, params?: OdataParams) {
        return this.getItem<IProduct>(`${this.API_URL}/${productId}`, null, params);
    }

    submitProduct$(product: Omit<IProduct, '_id'>) {
        return this.submitItem<Omit<IProduct, '_id'>>(`${this.API_URL}`, product);
    }

    updateProduct$(productId: string, product: Omit<IProduct, '_id'>) {
        return this.updateItem<Omit<IProduct, '_id'>>(`${this.API_URL}/${productId}`, product);
    }

    deleteProduct$(productId: string) {
        return this.deleteItem(`${this.API_URL}/${productId}`);
    }

    getProductCategoryList$(params?: OdataParams) {
        return this.getItems<IProductCategory>(`${this.API_URL}/category/list`, null, params);
    }

    getProductCategory$(productCategoryId: string, params?: OdataParams) {
        return this.getItem<IProductCategory>(`${this.API_URL}/category/${productCategoryId}`, null, params);
    }
}
