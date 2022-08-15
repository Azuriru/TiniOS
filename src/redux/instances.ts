import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { Size } from '../hooks/useMouseTransform';

type WindowState = {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
};

type NewInstance = {
    appId: string;
    title?: string;
    window?: WindowState,
    size?: Size
};

export type Instance = NewInstance & {
    id: number;
    zIndex: number;
};

const instancesAdapter = createEntityAdapter<Instance>({
    selectId: (instance) => instance.id
});

const instances = createSlice({
    name: 'instances',
    initialState: instancesAdapter.getInitialState({
        lastId: 0,
        lastZIndex: 0
    }),
    reducers: {
        // getlastInstanceIndex(state, action: PayloadAction<>) {

        // },
        addInstance(state, action: PayloadAction<NewInstance>) {
            instancesAdapter.addOne(state, {
                ...action.payload,
                id: ++state.lastId,
                zIndex: ++state.lastZIndex
            });
        },
        addInstances(state, action: PayloadAction<{ instances: Instance[] }>) {
            instancesAdapter.setAll(state, action.payload.instances);
        },
        deleteInstance(state, action: PayloadAction<number>) {
            instancesAdapter.removeOne(state, action.payload);
        },
        focusInstance(state, action: PayloadAction<number>) {
            const entity = state.entities[action.payload];

            if (entity && entity.zIndex !== state.lastZIndex) {
                entity.zIndex = ++state.lastZIndex;
            }
        },
        updateInstanceWindow(state, action: PayloadAction<{ id: number, state: WindowState }>) {
            const entity = state.entities[action.payload.id];

            if (entity) {
                for (const key in action.payload.state) {
                    const _key = key as keyof WindowState;

                    entity.window = entity.window ?? {} as WindowState;
                    entity.window[_key] = action.payload.state[_key];
                }
            }
        }
    }
});

export const { addInstance, addInstances, deleteInstance, focusInstance, updateInstanceWindow } = instances.actions;

export const { selectAll: selectAllInstances } = instancesAdapter.getSelectors<RootState>(
    state => state.instances
);

export const selectLastFocused = createSelector(
    (state: RootState) => state.instances,
    state => state.entities[state.lastZIndex]
);

export const selectByAppId = (appId: string) => createSelector(
    (state: RootState) => state.instances,
    state => Object.values(state.entities).filter(instance => instance?.appId === appId)
);

export const selectInstancesByAppId = createSelector(
    [
        (state: RootState) => state.instances,
        (state, appId: string) => appId
    ],
    (instances, appId) => Object.values(instances.entities).filter(instance => instance?.appId === appId)
);

export default instances.reducer;
