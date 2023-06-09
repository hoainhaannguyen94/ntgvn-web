import { Injectable, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { DashboardApiService } from '../core/dashboard-api.service';
import { DashboardStateService } from '../core/dashboard-state.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardFacadeService {
    dashboardAPI = inject(DashboardApiService);
    dashboardState = inject(DashboardStateService);

    isLoading$() {
        return this.dashboardState.isLoading$();
    }

    getCountUsers$() {
        return this.dashboardState.getCountUsers$();
    }

    loadCountUsers() {
        this.dashboardState.setLoading(true);
        this.dashboardAPI.countUsers$().pipe(
            finalize(() => {
                this.dashboardState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.dashboardState.setCountUsers(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    getCountCustomers$() {
        return this.dashboardState.getCountCustomers$();
    }

    loadCountCustomers() {
        this.dashboardState.setLoading(true);
        this.dashboardAPI.countCustomers$().pipe(
            finalize(() => {
                this.dashboardState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.dashboardState.setCountCustomers(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    getCountProducts$() {
        return this.dashboardState.getCountProducts$();
    }

    loadCountProducts() {
        this.dashboardState.setLoading(true);
        this.dashboardAPI.countProducts$().pipe(
            finalize(() => {
                this.dashboardState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.dashboardState.setCountProducts(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    getCountOrders$() {
        return this.dashboardState.getCountOrders$();
    }

    loadCountOrders() {
        this.dashboardState.setLoading(true);
        this.dashboardAPI.countOrders$().pipe(
            finalize(() => {
                this.dashboardState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.dashboardState.setCountOrders(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    getOrdersTop10$() {
        return this.dashboardAPI.getOrdersTop10$();
    }

    loadOrdersTop10() {
        this.dashboardState.setLoading(true);
        this.dashboardAPI.getOrdersTop10$().pipe(
            finalize(() => {
                this.dashboardState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.dashboardState.setOrdersTop10(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }
}
