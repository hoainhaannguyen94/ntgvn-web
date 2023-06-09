import { Injectable } from '@angular/core';
import { AuditLogService } from '@common/services';

@Injectable({
    providedIn: 'root'
})
export class AuditLogApiService extends AuditLogService {}
