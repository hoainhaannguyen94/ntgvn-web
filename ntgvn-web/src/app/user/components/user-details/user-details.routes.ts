import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { UserDetailsComponent } from './user-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: UserDetailsComponent,
        title: 'User',
        canActivate: [authCanActiveGuard]
    }
];
