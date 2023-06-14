export interface IRoom {
    _id: string;
    name: string;
    description: string;
    _managerId: string;
    address: string;
    lat: number;
    lng: number;
}

export interface ICountRoom {
    count: number;
}

export const BLANK_ROOM: IRoom = {
    _id: '',
    name: '',
    description: '',
    _managerId: '',
    address: '',
    lat: 0,
    lng: 0
}
