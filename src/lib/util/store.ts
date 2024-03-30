import { writable, type Subscriber, type Unsubscriber, type Updater, type Writable, type StartStopNotifier } from 'svelte/store';
import { browser } from '$app/environment';

type TransitioningTypes = ((res: void) => void) | null;
export const transitioning = writable<TransitioningTypes>(null);

type OnKeydownType = ((event: KeyboardEvent) => void);
export const onKeydown = writable<OnKeydownType>(() => {});

export type StoreContract<T> = {
    subscribe(this: void, run: Subscriber<T>): Unsubscriber;
    set(this: void, value: T): void;
    update(this: void, updater: Updater<T>): void;

    init: StartStopNotifier<T>;
};

export function proxyStore<T>(initialValue: T, init: (source: Writable<T>) => StoreContract<T>) {
    const source = writable<T>(initialValue, (set, update) => {
        return methods.init(set, update);
    });
    const methods = init(source);

    return {
        ...source,
        ...methods
    };
}

export const localStorageBacked = function<T>(key: string, initial: T) {
    return proxyStore(initial, (source) => {
        return {
            set(newValue) {
                if (browser) localStorage.setItem(key, JSON.stringify(newValue));

                return source.set(newValue);
            },
            update(updater) {
                if (browser) localStorage.setItem(key, JSON.stringify(source));

                return source.update(updater);
            },
            subscribe: (callback) => source.subscribe(callback),
            init: (set) => {
                if (!browser) return;

                const stored = localStorage.getItem(key);

                if (stored === null) {
                    set(initial);
                } else {
                    set(JSON.parse(stored));
                }
            }
        };
    });
};

let data: Record<string, any> | null = null;
export const centralizedKey = 'azuretools-persistibles';
export type JSONValue = null | boolean | number | string | JSONValue[] | { [k: string]: JSONValue };
export const persistible = function<T extends JSONValue>(localKey: string, initial: T): StoreContract<T> {
    if (browser && data === null) {
        const stored = localStorage.getItem(centralizedKey);

        if (stored !== null) {
            data = (JSON.parse(stored) as null as never) ?? {};
        } else {
            data = {};
        }
    }

    if (data && !data[localKey]) {
        data[localKey] = initial;
    }

    const proxy = proxyStore(initial, (source) => {
        return {
            set(newValue) {
                return source.set(newValue);
            },
            update(updater) {
                return source.update(updater);
            },
            subscribe: (callback) => source.subscribe(callback),
            init: (set) => {
                if (data) set(data[localKey]);
            }
        };
    });

    const _unsub = proxy.subscribe((val) => {
        if (data) data[localKey] = val;

        if (browser) localStorage.setItem(centralizedKey, JSON.stringify(data));
    });

    return proxy;
};