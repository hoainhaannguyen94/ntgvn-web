import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { WarehouseDetailsComponent } from './warehouse-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: WarehouseDetailsComponent,
        title: 'Warehouse',
        canActivate: [authCanActiveGuard]
    }
];
