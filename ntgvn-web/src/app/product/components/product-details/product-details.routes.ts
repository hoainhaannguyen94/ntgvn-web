import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { ProductDetailsComponent } from './product-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ProductDetailsComponent,
        title: 'Product',
        canActivate: [authCanActiveGuard]
    }
];
