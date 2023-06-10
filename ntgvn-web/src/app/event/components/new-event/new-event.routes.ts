import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewEventComponent } from './new-event.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewEventComponent,
        title: 'Event',
        canActivate: [authCanActiveGuard]
    }
];