import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
