// import { createStore, applyMiddleware } from 'redux';
// import { TypedUseSelectorHook, useSelector as baseUseSelector } from 'react-redux';
// import { composeWithDevTools } from 'redux-devtools-extension';

// import reducer from './reducers';

// export type RootState = ReturnType<typeof reducer>

// const store = createStore<RootState, any, unknown, unknown>(
//     reducer,
//     composeWithDevTools(
//         applyMiddleware()
//     )
// );

// // Bound type helpers
// const useSelector: TypedUseSelectorHook<RootState> = baseUseSelector;

// export {
//     store,
//     useSelector
// };

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
