import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { AboutUsComponent } from './about-us.component';

export const routes: Routes = [
    {
        path: '',
        component: AboutUsComponent,
        title: 'About Us',
        canActivate: [authCanActiveGuard]
    }
];
