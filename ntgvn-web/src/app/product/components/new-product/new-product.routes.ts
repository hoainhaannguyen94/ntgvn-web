import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { NewProductComponent } from './new-product.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NewProductComponent,
        title: 'Product',
        canActivate: [authCanActiveGuard]
    }
];
