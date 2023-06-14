import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { TagDetailsComponent } from './tag-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TagDetailsComponent,
        title: 'Tag',
        canActivate: [authCanActiveGuard]
    }
];
