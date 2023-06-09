import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@common/guards';
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
