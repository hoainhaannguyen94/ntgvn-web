export class Clone<T> {
    value?: T;
}

export function merge<T>(origin: T, changes: Partial<T>): T {
    return { ...origin, ...changes }
}

export function cloneDeep<T>(origin: T): T {
    const cloneResult = new Clone<T>();
    cloneResult.value = merge<T>(origin, origin);
    return cloneResult.value;
}
