/* eslint-disable @typescript-eslint/no-unused-vars */
import { MouseEvent, useState } from 'react';
import Icon from '../components/Icon';
import Clock from '../components/Clock';
import { removeByIndex, updateByIndex, appender } from '../util/array';
import { Start } from './Start';

import classNames from 'classnames';
import { actions, selectAllInstances, selectByAppId, selectInstancesByAppId } from '../redux/instances';
import { useDispatch, useSelector, useStore } from '../redux';

import './Taskbar.css';
import { useEvent } from '../hooks/useEvent';

type AppPreview = {
    name: string;
    hiding: boolean;
};

export function Taskbar() {
    const apps = [
        'opera',
        'settings',
        'dfyd',
        'para-el',
        'vsc'
    ];

    const [previewingApps, setPreviewingApps] = useState<AppPreview[]>([]);

    const onPreview = (appName: string) => {
        setPreviewingApps(appender({ name: appName, hiding: false }));

        // setPreviewingApps(apps => [...apps, { name: appName, hiding: false }]);
    };
    const onHide = (appName: string) => {
        setPreviewingApps(apps => {
            return updateByIndex(apps, app => app.name === appName, app => ({ ...app, hiding: true }));
        });
    };
    const onRemove = (appName: string) => {
        setPreviewingApps(apps => {
            return removeByIndex(apps, app => app.name === appName);
        });
    };

    return (
        <div className="taskbar">
            <div className="start">
                <Start />
            </div>
            <div className="container">
                <div className="left">
                    <div className="search">
                        <Icon>search</Icon>
                    </div>
                    <div className="app-tray">
                        {apps.map(app => <App key={app} name={app} />)}
                    </div>
                </div>
                <div className="right">
                    <div className="secondary-controls"></div>
                    <div className="lang-switch"></div>
                    <Clock />
                    <div className="show-desktop"></div>
                </div>
            </div>
            <div className="context" />
            <div className="previews">
                <div className="previews-control previews-up disabled"></div>
                <div className="previews-list"></div>
                <div className="previews-control previews-down"></div>
            </div>
            <div class="preview">
            </div>
        </div>
    );
}

type AppProps = {
    name: string;
};

export function App({ name }: AppProps) {
    const [ hovered, setHovered ] = useState(false);
    const store = useStore();
    const instanceCount = useSelector(state => selectInstancesByAppId(state, name).length);

    const dispatch = useDispatch();

    const onMouseEnter = () => {
        setHovered(true);
    };

    const onMouseLeave = () => {
        setHovered(false);
    };

    const onClick = (e: MouseEvent) => {
        dispatch(
            actions.addInstance({
                appId: name
            })
        );

        if (!e.ctrlKey) return;

        let count = e.shiftKey ? 100 : 10;
        const cb = () => {
            count--;
            if (count === 0) return;

            dispatch(
                actions.addInstance({
                    appId: name
                })
            );

            requestAnimationFrame(cb);
        };
        requestAnimationFrame(cb);
    };

    const onAuxClick = useEvent((e: MouseEvent) => {
        if (e.button === 1) {
            dispatch(actions.minimizeByAppId(name));
        }
    });

    const onContextMenu = useEvent((e: MouseEvent) => {
        e.preventDefault();
        dispatch(actions.openByAppId(name));
    });

    return (
        <div
            class={classNames('app', hovered && 'hover')}
            data-name={name}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onAuxClick={onAuxClick}
            onContextMenu={onContextMenu}
        >
            <div className="icon">
                <div className={name}>
                    <Icon>api</Icon>
                </div>
            </div>
            <div class="panels">
                {instanceCount > 0 && <Panel/>}
                {instanceCount > 1 && <Panel/>}
                {instanceCount > 2 && <Panel/>}
            </div>
        </div>
    );
}

function Panel() {
    return (
        <div class="panel">
            <div class="indicator" />
        </div>
    );
}
