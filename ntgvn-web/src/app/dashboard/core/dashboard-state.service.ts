import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IOrder } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class DashboardStateService {
    loading$ = new Subject<boolean>();
    countUsers$ = new Subject<number>();
    countCustomers$ = new Subject<number>();
    countProducts$ = new Subject<number>();
    countOrders$ = new Subject<number>();
    ordersTop10$ = new Subject<IOrder[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountUsers(count = 0) {
        return this.countUsers$.next(count);
    }

    getCountUsers$() {
        return this.countUsers$.asObservable();
    }

    setCountCustomers(count = 0) {
        return this.countCustomers$.next(count);
    }

    getCountCustomers$() {
        return this.countCustomers$.asObservable();
    }

    setCountProducts(count = 0) {
        return this.countProducts$.next(count);
    }

    getCountProducts$() {
        return this.countProducts$.asObservable();
    }

    setCountOrders(count = 0) {
        return this.countOrders$.next(count);
    }

    getCountOrders$() {
        return this.countOrders$.asObservable();
    }

    setOrdersTop10(orders: IOrder[]) {
        return this.ordersTop10$.next(orders);
    }

    getOrdersTop10$() {
        return this.ordersTop10$.asObservable();
    }
}
