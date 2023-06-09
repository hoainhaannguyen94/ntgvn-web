import { GLOBAL_SETTINGS } from '@global-settings';
import { IUser } from '@common/schemas';

export const AnonymousUser: IUser = {
    _id: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    role: ''
}

export interface IAppState {
    production: boolean;
    version: string;
    domain: string;
    server: string;
    root: string;
    socket: boolean;
    apiVersion: string;
    ready: boolean;
    token: string;
    me: IUser;
    timezone: string;
    language: string;
}

export const INITIAL_STATE = {
    production: GLOBAL_SETTINGS.production,
    version: GLOBAL_SETTINGS.version,
    domain: GLOBAL_SETTINGS.domain,
    server: GLOBAL_SETTINGS.server,
    root: GLOBAL_SETTINGS.root,
    apiVersion: GLOBAL_SETTINGS.apiVersion,
    socket: GLOBAL_SETTINGS.socket,
    language: GLOBAL_SETTINGS.language,
    token: '',
    ready: false,
    me: AnonymousUser,
    timezone: ''
}
