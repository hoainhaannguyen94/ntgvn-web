import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { GroupListComponent } from './group-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: GroupListComponent,
        title: 'Group',
        canActivate: [authCanActiveGuard]
    }
];
