import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewGroupComponent } from './new-group.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewGroupComponent,
        title: 'Group',
        canActivate: [authCanActiveGuard]
    }
];
