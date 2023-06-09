export interface IProduct {
    _id: string;
    name: string;
    _categoryId: string;
    type: string;
    _warehouseId: string;
    unit: string;
    quantity: number;
    retailPrice: number;
    wholesalePrice: number;
    collaboratorPrice: number;
    createdAt: string;
    expireAt: string;
}

export interface ICountProduct {
    count: number;
}

export interface IProductCategory {
    _id: string;
    name: string;
    displayName: string;
}

export const BLANK_PRODUCT: IProduct = {
    _id: '',
    name: '',
    _categoryId: '',
    type: '',
    _warehouseId: '',
    unit: '',
    quantity: 0,
    retailPrice: 0,
    wholesalePrice: 0,
    collaboratorPrice: 0,
    createdAt: '',
    expireAt: ''
}
