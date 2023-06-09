export class Effect<T> {
    [k: string]: any;
    key: string;
    value: any;
    newState: T;

    constructor(
        key: string,
        value: any,
        newState: T
    ) {
        this.key = key;
        this.value = value;
        this.newState = newState;
    }
}

export type TCommitFunction<T> = (changes: Partial<T>) => void;
export type TEffectFunction<T> = (key: string, value: T, newState: T) => void;
export type TStateGetterFunction<T> = (target: T & any, key: string, receiver: T) => T;
export type TStateSetterFunction<T> = (target: T & any, key: string, receiver: T) => boolean;
