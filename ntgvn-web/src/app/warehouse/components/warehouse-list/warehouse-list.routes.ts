import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
