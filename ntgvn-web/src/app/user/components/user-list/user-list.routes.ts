import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { UserListComponent } from './user-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserListComponent,
        title: 'User',
        canActivate: [authCanActiveGuard]
    }
];
