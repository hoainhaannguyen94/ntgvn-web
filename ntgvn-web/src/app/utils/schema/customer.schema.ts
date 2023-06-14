export interface ICustomer {
    _id: string;
    name: string;
    phoneNumber: string;
    address: string;
}

export interface ICountCustomer {
    count: number;
}

export const BLANK_CUSTOMER: ICustomer = {
    _id: '',
    name: '',
    phoneNumber: '',
    address: ''
}
