import classNames from 'classnames';
import { useSelector } from '../redux';
import { selectAllInstances } from '../redux/instances';
import { Instance as ReduxInstance } from '../redux/instances';

import { useContext } from 'react';
import { AppsContext } from '../components/AppsContext';

import './Desktop.css';
import './Instance.css';

export function Desktop() {
    const instances = useSelector(selectAllInstances);

    return (
        <div className="desktop">
            <div class="windows">
                {instances.map(inst => <Instance key={inst.id} instance={inst} />)}
            </div>
        </div>
    );
}

type InstanceProps = {
    instance: ReduxInstance
};
function Instance({ instance }: InstanceProps) {
    const apps = useContext(AppsContext);
    const app = apps[instance.appId];

    return (
        <div
            class={classNames("window")}
            style={{
                transform: `translate(${instance.id * 120}px)`
            }}
        >
            <div class="titlebar">
                <div class="title">{instance.appId}</div>
            </div>
            <div class="app">
                {app?.render(instance)}
            </div>
        </div>
    )
}
