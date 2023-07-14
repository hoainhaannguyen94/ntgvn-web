import { createAction } from '@ngrx/store';
import { actionFactory } from '../factory/action.factory';
import { IUser } from '../../schema/user.schema';

export const updateUser = createAction('[User] Update', user => actionFactory<IUser>(user));
export const resetUser = createAction('[User] Reset', () => actionFactory<undefined>());
