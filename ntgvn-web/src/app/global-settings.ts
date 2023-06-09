import { environment } from '@environment';

export const GLOBAL_SETTINGS = {
    production: environment.production,
    version: environment.version,
    domain: environment.domain,
    server: environment.server,
    apiVersion: environment.apiVersion,
    socket: environment.socket,
    root: environment.root,
    language: environment.language
}
