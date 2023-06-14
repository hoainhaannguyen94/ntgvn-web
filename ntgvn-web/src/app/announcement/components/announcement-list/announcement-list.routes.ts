import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { AnnouncementListComponent } from './announcement-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AnnouncementListComponent,
        title: 'Announcement',
        canActivate: [authCanActiveGuard]
    }
];
