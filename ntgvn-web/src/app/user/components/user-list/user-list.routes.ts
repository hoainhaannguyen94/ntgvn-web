import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
