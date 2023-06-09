import { Routes } from '@angular/router';
import { TestComponent } from './test.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TestComponent,
        title: 'Test'
    }
];
