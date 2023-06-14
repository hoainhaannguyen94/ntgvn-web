import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { TagListComponent } from './tag-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TagListComponent,
        title: 'Tag',
        canActivate: [authCanActiveGuard]
    }
];
