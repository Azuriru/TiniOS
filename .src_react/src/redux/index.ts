import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector as useReactSelector, useDispatch as useReactDispatch } from 'react-redux';

import counter from './counter';
import apps from './apps';
import instances from './instances';
import { useStore as useReduxStore } from 'react-redux';

export const store = configureStore({
    reducer: {
        counter,
        apps,
        instances
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useReactSelector;
export const useDispatch: () => StoreDispatch = useReactDispatch;
export const useStore = () => useReduxStore<RootState>();
