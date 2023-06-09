import { IUser } from '@common/schemas';

export interface IAuthVerifyToken {
    valid: boolean;
    payload: {
        domain: string;
        exp: number;
        iat: number;
        phoneNumber: string;
    }
    user: IUser;
}
