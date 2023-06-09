import { inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { STATE_CONFIGS } from './state.configs';
import { Effect, TCommitFunction, TEffectFunction, TStateGetterFunction, TStateSetterFunction } from './state.schema';
import { cloneDeep, merge } from './state.utility';

@Injectable({
    providedIn: 'root'
})
export class StateService<T> implements OnDestroy {
    state: T & any;

    dataSource: Subject<Effect<T> | T> = new Subject<Effect<T> | T>();
    stateChanges$: Observable<Effect<T> | T> = this.dataSource.asObservable();

    get currentState() {
        return cloneDeep(this.state);
    }

    stateConfigs = inject(STATE_CONFIGS);

    constructor() {
        this.state = new Proxy(this.stateConfigs.initialState, {
            get: this.stateGetter,
            set: this.stateSetter
        });
    }

    useEffect: TEffectFunction<T> = (key, value, newState) => {
        this.dataSource.next(new Effect<T>(key, value, newState));
    }

    stateGetter: TStateGetterFunction<T> = (target, key, receiver) => {
        return Reflect.get(target, key, receiver);
    }

    stateSetter: TStateSetterFunction<T> = (target, key, receiver) => {
        if (key in target && target[key] !== receiver) {
            Reflect.set(target, key, receiver);
            this.useEffect(key, receiver, this.currentState);
        }
        return true;
    }

    commit: TCommitFunction<T> = (changes: Partial<T>) => {
        let commitState = cloneDeep(this.state);
        commitState = merge<T>(commitState, changes);
        Object.keys(commitState).forEach(key => {
            (this.state)[key] = (commitState)[key];
        });
    }

    ngOnDestroy() {
        this.dataSource.complete();
    }
}
