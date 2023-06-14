export interface IGroup {
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
