import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
