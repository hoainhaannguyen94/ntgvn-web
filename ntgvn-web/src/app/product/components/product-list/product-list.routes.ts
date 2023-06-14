import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { ProductListComponent } from './product-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ProductListComponent,
        title: 'Product',
        canActivate: [authCanActiveGuard]
    }
];
