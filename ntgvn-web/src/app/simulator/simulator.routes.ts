import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
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
