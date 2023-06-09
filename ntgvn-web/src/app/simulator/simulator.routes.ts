import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
import { SimulatorComponent } from './simulator.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: SimulatorComponent,
        title: 'Simulator',
        canActivate: [authCanActiveGuard]
    }
];
