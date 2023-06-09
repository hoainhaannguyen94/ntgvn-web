import { InjectionToken } from '@angular/core';

export class StateConfigs {
    initialState: any;
}

export const STATE_CONFIGS = new InjectionToken<StateConfigs>('STATE_CONFIGS');
