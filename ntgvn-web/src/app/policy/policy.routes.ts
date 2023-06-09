import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { PolicyComponent } from './policy.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: PolicyComponent,
        title: 'Policy',
        canActivate: [authCanActiveGuard]
    }
];
