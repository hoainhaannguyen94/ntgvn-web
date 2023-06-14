import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { AuditLogDetailsComponent } from './audit-log-details.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AuditLogDetailsComponent,
        title: 'Audit Log',
        canActivate: [authCanActiveGuard]
    }
];
