import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { EventDetailsComponent } from './event-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: EventDetailsComponent,
        title: 'Event',
        canActivate: [authCanActiveGuard]
    }
];
