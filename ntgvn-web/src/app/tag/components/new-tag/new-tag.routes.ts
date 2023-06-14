import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
