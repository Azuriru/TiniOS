import classNames from 'classnames';
import { useSelector } from '../redux';
import { selectAllInstances } from '../redux/instances';
import { Instance as ReduxInstance } from '../redux/instances';

import { useContext } from 'react';
import { AppsContext } from '../components/AppsContext';

import './Desktop.css';

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

let lastIndex = 0;
// An excellent name of our accumulated genius,
// Dimensions by boo and Window by yours truly. WinDim
type WindowDimensions = {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
};

const style = (multiplier: number, { width = 400, height = 300, minWidth = 200, minHeight = 200 }: WindowDimensions = {}) => {
    const { innerWidth, innerHeight } = window;
    const w = width < minWidth ? minWidth : width;
    const h = height < minHeight ? minHeight : height;
    const paddingX = lastIndex * 24 + multiplier * 48 + 12;
    const paddingY = lastIndex * 28 + 6;

    if (innerWidth - w - paddingX < 0 || innerHeight - 44 - h - paddingY < 0) {
        lastIndex = 0;
        lastIndex++;
    }

    return {
        transform: `translate(${lastIndex * 24 + multiplier * 48 + 12}px, ${lastIndex * 28 + 6}px)`,
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`
    }
}

type InstanceProps = {
    instance: ReduxInstance
};
function Instance({ instance }: InstanceProps) {
    const apps = useContext(AppsContext);
    const app = apps[instance.appId];
    const { window } = instance;

    return (
        <div
            class={classNames("window")}
            style={style(instance.id, window)}
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
