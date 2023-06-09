import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
