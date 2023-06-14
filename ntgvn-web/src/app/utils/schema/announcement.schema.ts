export interface IAnnouncement {
    _id: string;
    title: string;
    body: string;
    createdBy: string;
    createdAt: string;
    lastUpdatedAt: string;
}

export interface ICountAnnouncement {
    count: number;
}

export const BLANK_ANNOUNCEMENT: IAnnouncement = {
    _id: '',
    title: '',
    body: '',
    createdBy: '',
    createdAt: '',
    lastUpdatedAt: ''
}
