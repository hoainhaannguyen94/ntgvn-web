import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
