export interface IUser {
    _id: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    role: string;
    group: string;
}

export interface ICountUser {
    count: number;
}

export interface IUserRole {
    _id: string;
    name: string;
    displayName: string;
}

export const BLANK_USER: IUser = {
    _id: '',
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    role: '',
    group: ''
}
