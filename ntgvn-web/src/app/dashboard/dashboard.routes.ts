import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { DashboardComponent } from './dashboard.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DashboardComponent,
        title: 'Dashboard',
        canActivate: [authCanActiveGuard]
    }
];
