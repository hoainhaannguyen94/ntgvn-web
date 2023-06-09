import { Injectable } from '@angular/core';
import { ICustomer, IOrder, IOrderStatus, IProduct } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrderStateService {
    loading$ = new Subject<boolean>();
    orderList$ = new Subject<IOrder[]>();
    orderStatusList$ = new Subject<IOrderStatus[]>();
    countOrders$ = new Subject<number>();
    productList$ = new Subject<IProduct[]>();
    customerList$ = new Subject<ICustomer[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountOrders(count = 0) {
        return this.countOrders$.next(count);
    }

    getCountOrders$() {
        return this.countOrders$.asObservable();
    }

    getOrderList$() {
        return this.orderList$.asObservable();
    }

    setOrderList(order: IOrder[]) {
        this.orderList$.next(order);
    }

    getOrderStatusList$() {
        return this.orderStatusList$.asObservable();
    }

    setOrderStatusList(orderStatus: IOrderStatus[]) {
        this.orderStatusList$.next(orderStatus);
    }

    getProductList$() {
        return this.productList$.asObservable();
    }

    setProductList(products: IProduct[]) {
        this.productList$.next(products);
    }

    getCustomerList$() {
        return this.customerList$.asObservable();
    }

    setCustomerList(customers: ICustomer[]) {
        this.customerList$.next(customers);
    }
}
