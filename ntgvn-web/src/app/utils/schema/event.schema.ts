export type EventDisplay = 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';

/**
 * @see https://fullcalendar.io/docs/event-object
 */
export interface IEvent {
    [key: string]: any;
    _id: string;
    id?: string;
    groupId?: string;
    allDay?: boolean;
    start?: string;
    end?: string;
    startStr?: string;
    endStr?: string;
    title?: string;
    url?: string;
    classNames?: string[];
    editable?: boolean;
    startEditable?: boolean;
    durationEditable?: boolean;
    resourceEditable?: boolean;
    display?: EventDisplay;
    overlap?: boolean;
    constraint?: any;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: any;
    source?: any;
    description?: string;
}

export interface ICountEvent {
    count: number;
}

export interface IEventStatus {
    _id: string;
    name: string;
    displayName: string;
    color: string;
}

export const BLANK_EVENT: IEvent = {
    _id: '',
    title: '',
    start: '',
    end: '',
    backgroundColor: '#3788d8',
    borderColor: '#3788d8',
    textColor: '#ffffff',
    extendedProps: {
        _groupId: '',
        priority: 0,
        description: '',
        _tagIds: [],
        completedAt: '',
        status: ''
    }
}
