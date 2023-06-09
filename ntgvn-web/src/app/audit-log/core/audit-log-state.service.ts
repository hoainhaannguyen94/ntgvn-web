import { Injectable } from '@angular/core';
import { IAuditLog } from '@common/schemas';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuditLogStateService {
    updating$ = new Subject<boolean>();
    auditLogList$ = new Subject<IAuditLog[]>();
    countAuditLogs$ = new Subject<number>();
    auditLog$ = new Subject<IAuditLog>();

    isLoading$() {
        return this.updating$.asObservable();
    }

    setLoading(value: boolean) {
        this.updating$.next(value);
    }

    setCountAuditLogs(count = 0) {
        return this.countAuditLogs$.next(count);
    }

    getCountAuditLogs$() {
        return this.countAuditLogs$.asObservable();
    }

    getAuditLogList$() {
        return this.auditLogList$.asObservable();
    }

    setAuditLogList(auditLogs: IAuditLog[]) {
        this.auditLogList$.next(auditLogs);
    }

    getAuditLog$() {
        return this.auditLog$.asObservable();
    }

    setAuditLog(auditLog: IAuditLog) {
        this.auditLog$.next(auditLog);
    }
}
