import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { NewUserComponent } from './new-user.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewUserComponent,
        title: 'User',
        canActivate: [authCanActiveGuard]
    }
];
