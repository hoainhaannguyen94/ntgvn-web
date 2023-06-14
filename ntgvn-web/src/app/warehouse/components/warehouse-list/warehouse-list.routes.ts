import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { WarehouseListComponent } from './warehouse-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: WarehouseListComponent,
        title: 'Warehouse',
        canActivate: [authCanActiveGuard]
    }
];
