import { Injectable, inject } from '@angular/core';
import { CustomerApiService } from '../core/customer-api.service';
import { CustomerStateService } from '../core/customer-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { ICustomer } from '@utils/schema';
import { LogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class CustomerFacadeService {
    logService = inject(LogService);
    customerAPI = inject(CustomerApiService);
    customerState = inject(CustomerStateService);

    isLoading$() {
        return this.customerState.isLoading$();
    }

    getCountCustomers$() {
        return this.customerState.getCountCustomers$();
    }

    loadCountCustomers(params?: OdataParams) {
        this.customerState.setLoading(true);
        this.customerAPI.countCustomers$(params).pipe(
            finalize(() => {
                this.customerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.customerState.setCountCustomers(res.value.count);
            },
            error: err => {
                this.logService.error('CustomerFacadeService', err);
            }
        });
    }

    loadCustomerList(params?: OdataParams) {
        this.customerState.setLoading(true);
        this.customerAPI.getCustomerList$(params).pipe(
            finalize(() => {
                this.customerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.customerState.setCustomerList(res.value);
            },
            error: err => {
                this.logService.error('CustomerFacadeService', err);
            }
        });
    }

    getCustomerList$() {
        return this.customerState.getCustomerList$();
    }

    getCustomer$(customerId: string, params?: OdataParams) {
        return this.customerAPI.getCustomer$(customerId, params);
    }

    submitCustomer$(customer: Omit<ICustomer, '_id'>) {
        return new Observable((observer) => {
            this.customerState.setLoading(true);
            this.customerAPI.submitCustomer$(customer).pipe(
                finalize(() => {
                    this.customerState.setLoading(false);
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

    updateCustomer$(customerId: string, customer: Omit<ICustomer, '_id'>) {
        return new Observable((observer) => {
            this.customerState.setLoading(true);
            this.customerAPI.updateCustomer$(customerId, customer).pipe(
                finalize(() => {
                    this.customerState.setLoading(false);
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

    deleteCustomer$(customerId: string) {
        return new Observable((observer) => {
            this.customerState.setLoading(true);
            this.customerAPI.deleteCustomer$(customerId).pipe(
                finalize(() => {
                    this.customerState.setLoading(false);
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
}
