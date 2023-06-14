import { Routes } from '@angular/router';
import { authCanActiveGuard } from '@utils/guard';
import { AuditLogListComponent } from './audit-log-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: AuditLogListComponent,
        title: 'Audit Log',
        canActivate: [authCanActiveGuard]
    }
];
