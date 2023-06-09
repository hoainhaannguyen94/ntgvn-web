import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: LoginComponent,
        title: 'Login'
    }
];
