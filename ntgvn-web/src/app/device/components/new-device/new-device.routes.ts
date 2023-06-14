import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { NewDeviceComponent } from './new-device.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewDeviceComponent,
        title: 'Device',
        canActivate: [authCanActiveGuard]
    }
];
