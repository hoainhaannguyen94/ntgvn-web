export interface IProductInOrder {
    [key: string]: any;
    _productId: string;
    quantity: number;
    price: number;
}

export interface IOrder {
    _id: string;
    products: IProductInOrder[];
    _createdBy: string;
    createdAt: string;
    status: string;
    _customerId: string;
    deliveryBy: string;
    deliveryFee: number;
    deliveryAt: string;
    discount: number;
    total: number;
    notes: string;
}

export interface ICountOrder {
    count: number;
}

export interface IOrderStatus {
    _id: string;
    name: string;
    displayName: string;
    backgroundColor: string;
    textColor: string;
}

export const BLANK_ORDER: IOrder = {
    _id: '',
    products: [],
    _createdBy: '',
    createdAt: '',
    status: '',
    _customerId: '',
    deliveryBy: '',
    deliveryFee: 0,
    deliveryAt: '',
    discount: 0,
    total: 0,
    notes: ''
}

export const BLANK_PRODUT_IN_ORDER: IProductInOrder = {
    _productId: '',
    quantity: 0,
    price: 0
}
