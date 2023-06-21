export interface IUser {
    [k: string]: any;
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    role: string;
    _groupId: string;
}

export interface ICountUser {
    count: number;
}

export interface IUserRole {
    _id: string;
    name: string;
    displayName: string;
    backgroundColor: string;
    textColor: string;
}

export const BLANK_USER: IUser = {
    _id: '',
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    role: '',
    _groupId: ''
}
