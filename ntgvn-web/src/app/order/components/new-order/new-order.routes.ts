import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { NewOrderComponent } from './new-order.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewOrderComponent,
        title: 'Order',
        canActivate: [authCanActiveGuard]
    }
];
