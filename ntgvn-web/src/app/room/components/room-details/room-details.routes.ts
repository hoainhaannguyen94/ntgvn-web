import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { RoomDetailsComponent } from './room-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RoomDetailsComponent,
        title: 'Warehouse',
        canActivate: [authCanActiveGuard]
    }
];
