import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { GroupDetailsComponent } from './group-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: GroupDetailsComponent,
        title: 'Group',
        canActivate: [authCanActiveGuard]
    }
];
