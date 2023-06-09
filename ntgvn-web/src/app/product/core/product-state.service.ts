import { Injectable } from '@angular/core';
import { IProduct, IProductCategory, IWarehouse } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductStateService {
    loading$ = new Subject<boolean>();
    productList$ = new Subject<IProduct[]>();
    countProducts$ = new Subject<number>();
    productCategoryList$ = new Subject<IProductCategory[]>();
    warehouseList$ = new Subject<IWarehouse[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountProducts(count = 0) {
        return this.countProducts$.next(count);
    }

    getCountProducts$() {
        return this.countProducts$.asObservable();
    }

    getProductList$() {
        return this.productList$.asObservable();
    }

    setProductList(products: IProduct[]) {
        this.productList$.next(products);
    }

    getProductCategoryList$() {
        return this.productCategoryList$.asObservable();
    }

    setProductCategoryList(categories: IProductCategory[]) {
        this.productCategoryList$.next(categories);
    }

    getWarehouseList$() {
        return this.warehouseList$.asObservable();
    }

    setWarehouseList(warehouses: IWarehouse[]) {
        this.warehouseList$.next(warehouses);
    }
}
