import { GLOBAL_SETTINGS } from '@global-settings';
import { IUser } from '@utils/schema';

export const AnonymousUser: IUser = {
    _id: '',
    name: '',
    address: '',
    email: '',
    phoneNumber: '',
    role: '',
    group: ''
}

export interface IAppState {
    production: boolean;
    version: string;
    domain: string;
    restURL: string;
    websocketURL: string;
    root: string;
    enableWebsocket: boolean;
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
    restURL: GLOBAL_SETTINGS.restURL,
    websocketURL: GLOBAL_SETTINGS.websocketURL,
    root: GLOBAL_SETTINGS.root,
    apiVersion: GLOBAL_SETTINGS.apiVersion,
    enableWebsocket: GLOBAL_SETTINGS.enableWebsocket,
    language: GLOBAL_SETTINGS.language,
    token: '',
    ready: false,
    me: AnonymousUser,
    timezone: ''
}
