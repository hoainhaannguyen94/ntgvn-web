export interface ITag {
    [key: string]: any;
    _id: string;
    name: string;
    description: string;
}

export interface ICountTag {
    count: number;
}

export const BLANK_TAG: ITag = {
    _id: '',
    name: '',
    description: ''
}
