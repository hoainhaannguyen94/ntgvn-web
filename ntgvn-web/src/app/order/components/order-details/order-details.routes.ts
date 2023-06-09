import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
