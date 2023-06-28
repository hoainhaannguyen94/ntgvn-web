import { Injectable } from '@angular/core';
import { ICustomer } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomerStateService {
    loading$ = new Subject<boolean>();
    customerList$ = new Subject<ICustomer[]>();
    countCustomers$ = new Subject<number>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountCustomers(count = 0) {
        return this.countCustomers$.next(count);
    }

    getCountCustomers$() {
        return this.countCustomers$.asObservable();
    }

    getCustomerList$() {
        return this.customerList$.asObservable();
    }

    setCustomerList(customers: ICustomer[]) {
        this.customerList$.next(customers);
    }
}
