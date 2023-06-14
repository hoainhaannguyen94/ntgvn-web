import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { SchedulerComponent } from './scheduler.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SchedulerComponent,
        title: 'Scheduler',
        canActivate: [authCanActiveGuard]
    }
];
