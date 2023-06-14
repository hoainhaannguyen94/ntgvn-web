export type EventDisplay = 'auto' | 'block' | 'list-item' | 'background' | 'inverse-background' | 'none';

/**
 * @see https://fullcalendar.io/docs/event-object
 */
export interface IEvent {
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

export const BLANK_EVENT: IEvent = {
    _id: '',
    title: '',
    start: '',
    end: '',
    backgroundColor: '#3788d8',
    textColor: '#ffffff'
}
