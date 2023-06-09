import { Component, OnInit, inject } from '@angular/core';
import { BaseComponent } from '@utils/base/base.component';
import { takeUntil } from 'rxjs';
import { IMatGridConfig } from '@common/schemas';
import { DashboardFacadeService } from './facade/dashboard-facade.service';
import { KpiComponent, IKPIConfig } from '@widgets/kpi';
import { GridComponent } from '@widgets/grid';

@Component({
    selector: 'dashboard',
    standalone: true,
    imports: [
        KpiComponent,
        GridComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {
    userKPIConfig: IKPIConfig;
    customerKPIConfig: IKPIConfig;
    productKPIConfig: IKPIConfig;
    orderKPIConfig: IKPIConfig;
    orderGridConfig: IMatGridConfig;

    dashboardFacade = inject(DashboardFacadeService);

    ngOnInit() {
        this.registerCoreLayer();
    }

    override registerCoreLayer() {
        this.dashboardFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.getCountUsers$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.userKPIConfig = {
                    target: 'user',
                    title: 'Users',
                    icon: 'supervised_user_circle',
                    total: value,
                    navigationUrl: '/user'
                }
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.getCountCustomers$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.customerKPIConfig = {
                    target: 'customer',
                    title: 'Customers',
                    icon: 'groups',
                    total: value,
                    navigationUrl: '/customer'
                }
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.getCountProducts$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.productKPIConfig = {
                    target: 'product',
                    title: 'Products',
                    icon: 'category',
                    total: value,
                    navigationUrl: '/product'

                }
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.getCountOrders$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.orderKPIConfig = {
                    target: 'order',
                    title: 'Orders',
                    icon: 'receipt',
                    total: value,
                    navigationUrl: '/order'
                }
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.getOrdersTop10$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.orderGridConfig = {
                    target: 'order',
                    title: 'Recent Orders',
                    headers: {
                        _createdBy: 'Create By',
                        _customerId: 'Customer',
                        createdAt: 'Created At',
                        deliveryAt: 'Delivery At',
                        total: 'Total',
                        status: 'Status',
                        notes: 'Notes'
                    },
                    columns: ['_createdBy', '_customerId', 'createdAt', 'deliveryAt', 'total', 'status', 'notes'],
                    data: value.value
                }
            },
            error: err => {
                throw err;
            }
        });
        this.dashboardFacade.loadCountUsers();
        this.dashboardFacade.loadCountCustomers();
        this.dashboardFacade.loadCountProducts();
        this.dashboardFacade.loadCountOrders();
        this.dashboardFacade.loadOrdersTop10();
    }
}
