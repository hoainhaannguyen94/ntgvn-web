import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewRoomComponent } from './new-room.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewRoomComponent,
        title: 'Room',
        canActivate: [authCanActiveGuard]
    }
];
