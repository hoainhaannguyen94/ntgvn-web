import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { AnnouncementDetailsComponent } from './announcement-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AnnouncementDetailsComponent,
        title: 'Announcement',
        canActivate: [authCanActiveGuard]
    }
];
