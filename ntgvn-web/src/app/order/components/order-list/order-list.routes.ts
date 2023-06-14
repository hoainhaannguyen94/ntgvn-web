import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { OrderListComponent } from './order-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: OrderListComponent,
        title: 'Order',
        canActivate: [authCanActiveGuard]
    }
];
