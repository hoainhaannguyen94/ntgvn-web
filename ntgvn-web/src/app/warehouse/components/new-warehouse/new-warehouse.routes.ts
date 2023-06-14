import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { NewWarehouseComponent } from './new-warehouse.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewWarehouseComponent,
        title: 'Warehouse',
        canActivate: [authCanActiveGuard]
    }
];
