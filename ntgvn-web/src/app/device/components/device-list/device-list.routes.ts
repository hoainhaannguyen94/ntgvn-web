import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { DeviceListComponent } from './device-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DeviceListComponent,
        title: 'Device',
        canActivate: [authCanActiveGuard]
    }
];
