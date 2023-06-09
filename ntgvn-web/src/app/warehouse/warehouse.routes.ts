import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/warehouse-list/warehouse-list.routes').then((m) => m.routes),
        data: {
            preload: true
        }
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/warehouse-details/warehouse-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-warehouse/new-warehouse.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
