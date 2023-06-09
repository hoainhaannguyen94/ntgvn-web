import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
