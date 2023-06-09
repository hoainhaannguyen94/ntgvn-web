import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
