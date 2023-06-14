export interface IWarehouse {
    _id: string;
    name: string;
    address: string;
    _managerId: string;
}

export interface ICountWarehouse {
    count: number;
}

export const BLANK_WAREHOUSE: IWarehouse = {
    _id: '',
    name: '',
    address: '',
    _managerId: ''
}
