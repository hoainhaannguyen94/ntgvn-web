import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { LowtechListComponent } from './lowtech-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LowtechListComponent,
        title: 'Lowtech',
        canActivate: [authCanActiveGuard]
    }
];
