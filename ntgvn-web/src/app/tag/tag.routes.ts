import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/tag-list/tag-list.routes').then((m) => m.routes)
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/tag-details/tag-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-tag/new-tag.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
