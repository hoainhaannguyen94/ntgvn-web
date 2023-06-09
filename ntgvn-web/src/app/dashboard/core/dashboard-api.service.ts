import { Injectable, inject } from '@angular/core';
import { OdataService, OdataParams } from '@utils/http';
import { CustomerService, OrderService, ProductService, UserService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class DashboardApiService extends OdataService {
    userService = inject(UserService);
    customerService = inject(CustomerService);
    productService = inject(ProductService);
    orderService = inject(OrderService);

    countUsers$(params?: OdataParams) {
        return this.userService.countUsers$(params);
    }

    countCustomers$(params?: OdataParams) {
        return this.customerService.countCustomers$(params);
    }

    countProducts$(params?: OdataParams) {
        return this.productService.countProducts$(params);
    }

    countOrders$(params?: OdataParams) {
        return this.orderService.countOrders$(params);
    }

    getOrdersTop10$() {
        return this.orderService.getOrdersTop10$();
    }
}
