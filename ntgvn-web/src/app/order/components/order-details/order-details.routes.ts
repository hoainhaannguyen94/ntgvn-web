import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { OrderDetailsComponent } from './order-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: OrderDetailsComponent,
        title: 'Order',
        canActivate: [authCanActiveGuard]
    }
];
