import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'list',
        loadChildren: () => import('./components/lowtech-list/lowtech-list.routes').then((m) => m.routes)
    },
    {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
    }
];
