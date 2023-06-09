import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/order-list/order-list.routes').then((m) => m.routes),
        data: {
            preload: true
        }
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/order-details/order-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-order/new-order.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
