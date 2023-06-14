import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { SettingComponent } from './setting.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SettingComponent,
        title: 'Setting',
        canActivate: [authCanActiveGuard]
    }
];
