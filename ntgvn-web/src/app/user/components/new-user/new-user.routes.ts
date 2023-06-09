import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
