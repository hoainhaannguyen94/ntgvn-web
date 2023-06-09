import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AppShellComponent,
        title: 'Loading...'
    }
];
