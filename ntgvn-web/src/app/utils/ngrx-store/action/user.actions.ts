import { createAction } from '@ngrx/store';

export const updateUser = createAction('[User] Update', user => ({ user, timestamp: Date.now() }));
export const resetUser = createAction('[User] Reset', () => ({ timestamp: Date.now() }));
