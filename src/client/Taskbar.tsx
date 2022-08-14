/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import Icon from '../components/Icon';
import Clock from '../components/Clock';
import { removeByIndex, updateByIndex, appender } from '../util/array';
import { Start } from './Start';

import classNames from 'classnames';
import { addInstance } from '../redux/instances';
import { useDispatch } from '../redux';

import './Taskbar.css';

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
    const dispatch = useDispatch();

    const onMouseEnter = () => {
        setHovered(true);
    };

    const onMouseLeave = () => {
        setHovered(false);
    };

    const onClick = () => {
        dispatch(
            addInstance({
                appId: name
            })
        );
    };

    return (
        <div
            class={classNames('app', hovered && 'hover')}
            data-name={name}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            <div className="icon">
                <div className={name}>
                    <Icon>api</Icon>
                </div>
            </div>
            <div className="panels">
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
