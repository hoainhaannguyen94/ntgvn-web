import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewTagComponent } from './new-tag.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewTagComponent,
        title: 'Tag',
        canActivate: [authCanActiveGuard]
    }
];
