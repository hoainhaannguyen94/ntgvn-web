export interface IAuditLog {
    _id: string;
    user: string;
    event: string;
    action: string;
    details: string;
    date: string;
}

export interface ICountAuditLog {
    count: number;
}

export const BLANK_AUDIT_LOG: IAuditLog = {
    _id: '',
    user: '',
    event: '',
    action: '',
    details: '',
    date: ''
}
