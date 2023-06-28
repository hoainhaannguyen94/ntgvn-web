import { Injectable } from '@angular/core';
import { IUser, IWarehouse } from '@utils/schema';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WarehouseStateService {
    loading$ = new Subject<boolean>();
    warehouseList$ = new Subject<IWarehouse[]>();
    countWarehouses$ = new Subject<number>();
    managerList$ = new Subject<IUser[]>();

    isLoading$() {
        return this.loading$.asObservable();
    }

    setLoading(value: boolean) {
        this.loading$.next(value);
    }

    setCountWarehouses(count = 0) {
        return this.countWarehouses$.next(count);
    }

    getCountWarehouses$() {
        return this.countWarehouses$.asObservable();
    }

    getWarehouseList$() {
        return this.warehouseList$.asObservable();
    }

    setWarehouseList(warehouses: IWarehouse[]) {
        this.warehouseList$.next(warehouses);
    }

    getManagerList$() {
        return this.managerList$.asObservable();
    }

    setManagerList(users: IUser[]) {
        this.managerList$.next(users);
    }
}
