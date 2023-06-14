import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { MapComponent } from './map.component';

export const routes: Routes = [
    {
        path: '',
        component: MapComponent,
        title: 'Map',
        canActivate: [authCanActiveGuard]
    }
];
