import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../action/user.actions';
import { IUser } from '@utils/schema';

export const initialState: IUser = {
    _id: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    role: '',
    _groupId: ''
}

export const userReducer = createReducer(
    initialState,
    on(UserActions.updateUser, (_, payload) => payload.user),
    on(UserActions.resetUser, () => initialState)
);
