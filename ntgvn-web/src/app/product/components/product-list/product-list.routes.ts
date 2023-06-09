import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
