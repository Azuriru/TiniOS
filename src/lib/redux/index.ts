import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { browser } from '$app/environment';

import counter from './counter';
import apps from './apps';
import instances from './instances';

const reducers = combineReducers({
    counter,
    apps,
    instances
});
const persistConfig = {
    key: 'root',
    version: 1,
    storage
};

const reducer = persistReducer(persistConfig, reducers);

export const baseStore = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export type RootState = ReturnType<typeof baseStore.getState>;
export type StoreDispatch = typeof baseStore.dispatch;

export const persistor = browser ? persistStore(baseStore) : null;

export const store = {
    dispatch: baseStore.dispatch,
    subscribe: (listener: (state: RootState) => void) => {
        listener(baseStore.getState());

        return baseStore.subscribe(() => {
            listener(baseStore.getState());
        });
    }
};