import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/product-list/product-list.routes').then((m) => m.routes)
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/product-details/product-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-product/new-product.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
