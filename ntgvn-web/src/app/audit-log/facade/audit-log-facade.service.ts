import { Injectable, inject } from '@angular/core';
import { AuditLogApiService } from '../core/audit-log-api.service';
import { AuditLogStateService } from '../core/audit-log-state.service';
import { OdataParams } from '@utils/http';
import { finalize, Observable } from 'rxjs';
import { IAuditLog } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class AuditLogFacadeService {
    auditLogAPI = inject(AuditLogApiService);
    auditLogState = inject(AuditLogStateService);

    isLoading$() {
        return this.auditLogState.isLoading$();
    }

    getCountAuditLogs$() {
        return this.auditLogState.getCountAuditLogs$();
    }

    loadCountAuditLogs(params?: OdataParams) {
        this.auditLogState.setLoading(true);
        this.auditLogAPI.countAuditLogs$(params).pipe(
            finalize(() => {
                this.auditLogState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.auditLogState.setCountAuditLogs(res.value.count);
            },
            error: err => {
                throw err;
            }
        });
    }

    loadAuditLogList(params?: OdataParams) {
        this.auditLogState.setLoading(true);
        this.auditLogAPI.getAuditLogList$(params).pipe(
            finalize(() => {
                this.auditLogState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.auditLogState.setAuditLogList(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getAuditLogList$() {
        return this.auditLogState.getAuditLogList$();
    }

    loadAuditLog(auditLogId: string, params?: OdataParams) {
        this.auditLogState.setLoading(true);
        this.auditLogAPI.getAuditLog$(auditLogId, params).pipe(
            finalize(() => {
                this.auditLogState.setLoading(false);
            })
        ).subscribe({
            next: res => {
                this.auditLogState.setAuditLog(res.value);
            },
            error: err => {
                throw err;
            }
        });
    }

    getAuditLog$() {
        return this.auditLogState.getAuditLog$();
    }

    submitAuditLog$(auditLog: Omit<IAuditLog, '_id'>) {
        return new Observable((observer) => {
            this.auditLogState.setLoading(true);
            this.auditLogAPI.submitAuditLog$(auditLog).pipe(
                finalize(() => {
                    this.auditLogState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    updateAuditLog$(auditLogId: string, auditLog: Omit<IAuditLog, '_id'>) {
        return new Observable((observer) => {
            this.auditLogState.setLoading(true);
            this.auditLogAPI.updateAuditLog$(auditLogId, auditLog).pipe(
                finalize(() => {
                    this.auditLogState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }

    deleteAuditLog$(auditLogId: string) {
        return new Observable((observer) => {
            this.auditLogState.setLoading(true);
            this.auditLogAPI.deleteAuditLog$(auditLogId).pipe(
                finalize(() => {
                    this.auditLogState.setLoading(false);
                })
            ).subscribe({
                next: res => {
                    observer.next(res);
                    observer.complete();
                },
                error: err => {
                    observer.error(err);
                }
            });
        });
    }
}
