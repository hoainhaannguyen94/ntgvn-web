import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/event-list/event-list.routes').then((m) => m.routes)
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/event-details/event-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-event/new-event.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
