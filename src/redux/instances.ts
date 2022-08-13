import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

type NewInstance = {
    appId: string;
    title?: string;
    window?: {
        width: number;
        height: number;
        minWidth: number;
        minHeight: number;
        state: string;
    }
};

export type Instance = NewInstance & {
    id: number;
};

const instancesAdapter = createEntityAdapter<Instance>({
    selectId: (instance) => instance.id
});

const instances = createSlice({
    name: 'instances',
    initialState: instancesAdapter.getInitialState({
        lastId: 1
    }),
    reducers: {
        // getlastInstanceIndex(state, action: PayloadAction<>) {

        // },
        addInstance(state, action: PayloadAction<NewInstance>) {
            instancesAdapter.addOne(state, {
                ...action.payload,
                id: state.lastId
            });
            state.lastId++;
        },
        addInstances(state, action: PayloadAction<{ instances: Instance[] }>) {
            instancesAdapter.setAll(state, action.payload.instances);
        },
        deleteInstance(state, action: PayloadAction<number>) {
            instancesAdapter.removeOne(state, action.payload);
        }
    }
});

export const { addInstance, addInstances, deleteInstance } = instances.actions;

export const { selectAll: selectAllInstances } = instancesAdapter.getSelectors<RootState>(
    state => state.instances
);

export default instances.reducer;