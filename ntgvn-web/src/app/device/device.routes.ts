import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/device-list/device-list.routes').then((m) => m.routes)
    },
    {
        path: ':id/details',
        loadChildren: () => import('./components/device-details/device-details.routes').then((m) => m.routes)
    },
    {
        path: 'new',
        loadChildren: () => import('./components/new-device/new-device.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
