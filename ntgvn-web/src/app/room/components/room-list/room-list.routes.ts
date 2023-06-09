import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { RoomListComponent } from './room-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RoomListComponent,
        title: 'Room',
        canActivate: [authCanActiveGuard]
    }
];
