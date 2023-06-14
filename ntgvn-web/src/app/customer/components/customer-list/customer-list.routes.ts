import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { CustomerListComponent } from './customer-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CustomerListComponent,
        title: 'Customer',
        canActivate: [authCanActiveGuard]
    }
];
