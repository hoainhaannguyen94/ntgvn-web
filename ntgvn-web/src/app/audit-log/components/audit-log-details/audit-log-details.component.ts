import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { BLANK_AUDIT_LOG } from '@utils/schema';
import { take, takeUntil } from 'rxjs'
import { AuditLogFacadeService } from '../../facade/audit-log-facade.service';
import { BaseComponent } from '@utils/base/base.component';
import { UserDetailsPipe, ObjectPropertyPipe } from '@utils/pipe';
import { LogService } from '@utils/service';

@Component({
    selector: 'audit-log-details',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        UserDetailsPipe,
        ObjectPropertyPipe
    ],
    templateUrl: './audit-log-details.component.html',
    styleUrls: ['./audit-log-details.component.scss']
})
export class AuditLogDetailsComponent extends BaseComponent implements OnInit {
    logService = inject(LogService);
    activatedRoute = inject(ActivatedRoute);
    auditLogFacade = inject(AuditLogFacadeService);
    router = inject(Router);

    auditLogId = '';
    auditLog = BLANK_AUDIT_LOG;

    ngOnInit() {
        this.registerCoreLayer();
        this.activatedRoute.params.pipe(take(1)).subscribe(value => {
            if (value['id']) {
                this.auditLogId = value['id']
                this.auditLogFacade.loadAuditLog(this.auditLogId);
            }
        });
    }

    override registerCoreLayer() {
        this.auditLogFacade.isLoading$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.isLoading = value;
            },
            error: err => {
                this.logService.error('AuditLogDetailsComponent', err);
            }
        });

        this.auditLogFacade.getAuditLog$().pipe(takeUntil(this.destroy$)).subscribe({
            next: value => {
                this.auditLog = value;
            },
            error: err => {
                this.logService.error('AuditLogDetailsComponent', err);
            }
        });
    }

    backHandler() {
        this.router.navigate(['/audit-log/list']);
    }
}
