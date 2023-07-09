import { Injectable, inject } from '@angular/core';
import { WarehouseApiService } from '../core/warehouse-api.service';
import { WarehouseStateService } from '../core/warehouse-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IWarehouse } from '@utils/schema';
import { LogService, UserService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class WarehouseFacadeService {
    logService = inject(LogService);
    warehouseAPI = inject(WarehouseApiService);
    warehouseState = inject(WarehouseStateService);
    userService = inject(UserService);

    isLoading$() {
        return this.warehouseState.isLoading$();
    }

    getCountWarehouses$() {
        return this.warehouseState.getCountWarehouses$();
    }

    loadCountWarehouses(params?: OdataParams) {
        this.warehouseState.setLoading(true);
        this.warehouseAPI.countWarehouses$(params).pipe(
            finalize(() => {
                this.warehouseState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.warehouseState.setCountWarehouses(res.value.count);
            },
            error: err => {
                this.logService.error('WarehouseFacadeService', err);
            }
        });
    }

    loadWarehouseList(params?: OdataParams) {
        this.warehouseState.setLoading(true);
        this.warehouseAPI.getWarehouseList$(params).pipe(
            finalize(() => {
                this.warehouseState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.warehouseState.setWarehouseList(res.value);
            },
            error: err => {
                this.logService.error('WarehouseFacadeService', err);
            }
        });
    }

    getWarehouseList$() {
        return this.warehouseState.getWarehouseList$();
    }

    getWarehouse$(warehouseId: string, params?: OdataParams) {
        return this.warehouseAPI.getWarehouse$(warehouseId, params);
    }

    submitWarehouse$(warehouse: Omit<IWarehouse, '_id'>) {
        return new Observable((observer) => {
            this.warehouseState.setLoading(true);
            this.warehouseAPI.submitWarehouse$(warehouse).pipe(
                finalize(() => {
                    this.warehouseState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    updateWarehouse$(warehouseId: string, warehouse: Omit<IWarehouse, '_id'>) {
        return new Observable((observer) => {
            this.warehouseState.setLoading(true);
            this.warehouseAPI.updateWarehouse$(warehouseId, warehouse).pipe(
                finalize(() => {
                    this.warehouseState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    deleteWarehouse$(warehouseId: string) {
        return new Observable((observer) => {
            this.warehouseState.setLoading(true);
            this.warehouseAPI.deleteWarehouse$(warehouseId).pipe(
                finalize(() => {
                    this.warehouseState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    loadManagerList(params?: OdataParams) {
        this.warehouseState.setLoading(true);
        this.userService.getUserList$(params).pipe(
            finalize(() => {
                this.warehouseState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.warehouseState.setManagerList(res.value);
            },
            error: err => {
                this.logService.error('WarehouseFacadeService', err);
            }
        });
    }

    getManagerList$() {
        return this.warehouseState.getManagerList$();
    }
}
