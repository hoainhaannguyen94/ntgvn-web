import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { MapComponent } from './map.component';

export const routes: Routes = [
    {
        path: '',
        component: MapComponent,
        title: 'Map',
        canActivate: [authCanActiveGuard]
    }
];
