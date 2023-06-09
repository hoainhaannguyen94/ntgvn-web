import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'audit-log',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
    ],
    templateUrl: './audit-log.component.html',
    styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent { }
