import { Injectable } from '@angular/core';
import { AuditLogService } from '@utils/service';

@Injectable({
    providedIn: 'root'
})
export class AuditLogApiService extends AuditLogService {}
