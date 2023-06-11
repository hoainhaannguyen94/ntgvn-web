import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/group-list/group-list.routes').then((m) => m.routes)
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/group-details/group-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-group/new-group.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
