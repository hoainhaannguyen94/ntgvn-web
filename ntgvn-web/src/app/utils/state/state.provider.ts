import { StateConfigs, STATE_CONFIGS } from './state.configs';

export const provideStateConfigs = (stateConfigs: StateConfigs) => {
    return {
        provide: STATE_CONFIGS,
        useValue: stateConfigs
    }
}
