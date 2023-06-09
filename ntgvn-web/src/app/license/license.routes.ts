import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { LicenseComponent } from './license.component';

export const routes: Routes = [
    {
        path: '',
        component: LicenseComponent,
        title: 'License',
        canActivate: [authCanActiveGuard]
    }
];
