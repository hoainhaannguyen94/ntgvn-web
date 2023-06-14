import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { CustomerDetailsComponent } from './customer-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: CustomerDetailsComponent,
        title: 'Customer',
        canActivate: [authCanActiveGuard]
    }
];
