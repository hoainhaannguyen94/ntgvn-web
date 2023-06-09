import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/room-list/room-list.routes').then((m) => m.routes),
        data: {
            preload: true
        }
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/room-details/room-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-room/new-room.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
