import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { DeviceDetailsComponent } from './device-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DeviceDetailsComponent,
        title: 'Device',
        canActivate: [authCanActiveGuard]
    }
];
