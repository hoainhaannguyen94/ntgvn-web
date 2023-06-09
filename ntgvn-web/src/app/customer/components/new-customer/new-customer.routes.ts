import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewCustomerComponent } from './new-customer.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewCustomerComponent,
        title: 'Customer',
        canActivate: [authCanActiveGuard]
    }
];
