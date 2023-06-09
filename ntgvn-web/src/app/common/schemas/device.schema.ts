export interface IDevice {
    _id: string;
    type: string;
    name: string;
    lat: number;
    lng: number;
}

export interface ICountDevice {
    count: number;
}

export const BLANK_DEVICE: IDevice = {
    _id: '',
    type: '',
    name: '',
    lat: 0,
    lng: 0
}
