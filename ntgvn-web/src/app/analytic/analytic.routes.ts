import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { AnalyticComponent } from './analytic.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AnalyticComponent,
        title: 'Analytics',
        canActivate: [authCanActiveGuard]
    }
];
