import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
