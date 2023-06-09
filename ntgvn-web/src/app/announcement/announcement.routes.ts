import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/announcement-list/announcement-list.routes').then((m) => m.routes),
        data: {
            preload: true
        }
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/announcement-details/announcement-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-announcement/new-announcement.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
