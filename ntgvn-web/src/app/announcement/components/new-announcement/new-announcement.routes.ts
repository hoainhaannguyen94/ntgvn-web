import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { NewAnnouncementComponent } from './new-announcement.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewAnnouncementComponent,
        title: 'Announcement',
        canActivate: [authCanActiveGuard]
    }
];
