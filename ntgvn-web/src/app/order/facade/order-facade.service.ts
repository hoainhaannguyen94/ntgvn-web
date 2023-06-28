import { Injectable, inject } from '@angular/core';
import { OrderApiService } from '../core/order-api.service';
import { OrderStateService } from '../core/order-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IOrder } from '@utils/schema';

@Injectable({
    providedIn: 'root'
})
export class OrderFacadeService {
    orderAPI = inject(OrderApiService);
    orderState = inject(OrderStateService);

    isLoading$() {
        return this.orderState.isLoading$();
    }

    getCountOrders$() {
        return this.orderState.getCountOrders$();
    }

    loadCountOrders(params?: OdataParams) {
        this.orderState.setLoading(true)
        this.orderAPI.countOrders$(params).pipe(
            finalize(() => { this.orderState.setLoading(false) })
        ).subscribe({
            next: res => {
                this.orderState.setCountOrders(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadOrderList(params?: OdataParams) {
        this.orderState.setLoading(true);
        this.orderAPI.getOrderList$(params).pipe(
            finalize(() => {
                this.orderState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.orderState.setOrderList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getOrderStatusList$() {
        return this.orderState.getOrderStatusList$();
    }

    loadOrderStatusList(params?: OdataParams) {
        this.orderState.setLoading(true);
        this.orderAPI.getOrderStatusList$(params).pipe(
            finalize(() => {
                this.orderState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.orderState.setOrderStatusList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getOrderList$() {
        return this.orderState.getOrderList$();
    }

    getOrder$(orderId: string, params?: OdataParams) {
        return this.orderAPI.getOrder$(orderId, params);
    }

    submitOrder$(order: Omit<IOrder, '_id'>) {
        return new Observable((observer) => {
            this.orderState.setLoading(true);
            this.orderAPI.submitOrder$(order).pipe(
                finalize(() => {
                    this.orderState.setLoading(false);
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

    updateOrder$(orderId: string, order: Omit<IOrder, '_id'>) {
        return new Observable((observer) => {
            this.orderState.setLoading(true);
            this.orderAPI.updateOrder$(orderId, order).pipe(
                finalize(() => {
                    this.orderState.setLoading(false);
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

    deleteOrder$(orderId: string) {
        return new Observable((observer) => {
            this.orderState.setLoading(true);
            this.orderAPI.deleteOrder$(orderId).pipe(
                finalize(() => {
                    this.orderState.setLoading(false);
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

    loadProductList(params?: OdataParams) {
        this.orderState.setLoading(true);
        this.orderAPI.getProductList$(params).pipe(
            finalize(() => {
                this.orderState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.orderState.setProductList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getProductList$() {
        return this.orderState.getProductList$();
    }

    getProductById$(productId: string) {
        return this.orderAPI.getProductList$({ $filter: `_id eq '${productId}'` });
    }

    loadCustomerList(params?: OdataParams) {
        this.orderState.setLoading(true);
        this.orderAPI.getCustomerList$(params).pipe(
            finalize(() => {
                this.orderState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.orderState.setCustomerList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getCustomerList$() {
        return this.orderState.getCustomerList$();
    }
}
