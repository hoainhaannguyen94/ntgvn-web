import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { EventListComponent } from './event-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: EventListComponent,
        title: 'Event',
        canActivate: [authCanActiveGuard]
    }
];
