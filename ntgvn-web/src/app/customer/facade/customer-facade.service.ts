import { Injectable, inject } from '@angular/core';
import { CustomerApiService } from '../core/customer-api.service';
import { CustomerStateService } from '../core/customer-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { ICustomer } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class CustomerFacadeService {
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
                throw err;
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
                throw err;
            }
        });
    }

    getCustomerList$() {
        return this.customerState.getCustomerList$();
    }

    loadCustomer(customerId: string, params?: OdataParams) {
        this.customerState.setLoading(true);
        this.customerAPI.getCustomer$(customerId, params).pipe(
            finalize(() => {
                this.customerState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.customerState.setCustomer(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getCustomer$() {
        return this.customerState.getCustomer$();
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
