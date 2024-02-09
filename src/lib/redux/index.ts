import { configureStore } from '@reduxjs/toolkit';

import counter from './counter';
// import apps from './apps';
// import instances from './instances';

export const baseStore = configureStore({
    reducer: {
        counter,
        // apps,
        // instances
    }
});

export type RootState = ReturnType<typeof baseStore.getState>;
export type StoreDispatch = typeof baseStore.dispatch;

export const store = baseStore as unknown as {
    subscribe: (listener: (state: RootState) => any) => any
};