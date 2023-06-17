export interface IGroup {
    [key: string]: any;
    _id: string;
    name: string;
    description: string;
}

export interface ICountGroup {
    count: number;
}

export const BLANK_GROUP: IGroup = {
    _id: '',
    name: '',
    description: ''
}
