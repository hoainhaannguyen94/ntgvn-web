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
    index: number;
    name: string;
    displayName: string;
    backgroundColor: string;
    textColor: string;
    priority: number;
}

export interface IEventFilter {
    start: any;
    end: any;
    _statusIds: string[];
    _groupIds: string[];
    priorities: string;
    _tagIds: string[];
}

export const BLANK_EVENT: IEvent = {
    _id: '',
    title: '',
    start: '',
    end: '',
    backgroundColor: '#9c27b0',
    borderColor: '#9c27b0',
    textColor: '#ffffff',
    extendedProps: {
        _groupId: '',
        priority: 0,
        description: '',
        _tagIds: [],
        completedAt: '',
        _statusId: ''
    }
}

export const BLANK_EVENT_FILTER = {
    start: null,
    end: null,
    _statusIds: [],
    _groupIds: [],
    priorities: null,
    _tagIds: []
}
