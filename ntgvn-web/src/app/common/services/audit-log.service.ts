import { Injectable } from '@angular/core';
import { GLOBAL_SETTINGS } from '@global-settings';
import { OdataService, OdataParams } from '@utils/http';
import { ICountAuditLog, IAuditLog } from '@common/schemas';

@Injectable({
    providedIn: 'root'
})
export class AuditLogService extends OdataService {
    readonly API_URL = `${GLOBAL_SETTINGS.restURL}/rest/api/${GLOBAL_SETTINGS.apiVersion}/audit-log`;

    countAuditLogs$(params?: OdataParams) {
        return this.getItem<ICountAuditLog>(`${this.API_URL}/count`, null, params);
    }

    getAuditLogList$(params?: OdataParams) {
        return this.getItems<IAuditLog>(`${this.API_URL}/list`, null, params);
    }

    getAuditLog$(auditLogId: string, params?: OdataParams) {
        return this.getItem<IAuditLog>(`${this.API_URL}/${auditLogId}`, null, params);
    }

    submitAuditLog$(customer: Omit<IAuditLog, '_id'>) {
        return this.submitItem<Omit<IAuditLog, '_id'>>(`${this.API_URL}`, customer);
    }

    updateAuditLog$(customerId: string, customer: Omit<IAuditLog, '_id'>) {
        return this.updateItem<Omit<IAuditLog, '_id'>>(`${this.API_URL}/${customerId}`, customer);
    }

    deleteAuditLog$(customerId: string) {
        return this.deleteItem(`${this.API_URL}/${customerId}`);
    }
}
