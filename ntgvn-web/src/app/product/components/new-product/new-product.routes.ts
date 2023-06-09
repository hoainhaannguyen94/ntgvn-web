import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
