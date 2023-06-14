import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
