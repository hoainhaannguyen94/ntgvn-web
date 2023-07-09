export interface IAuditLog {
    [key: string]: any;
    _id: string;
    _userId: string;
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
    _userId: '',
    event: '',
    action: '',
    details: '',
    date: ''
}
