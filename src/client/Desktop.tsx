import classNames from 'classnames';
import { useDispatch, useSelector } from '../redux';
import { deleteInstance, selectAllInstances } from '../redux/instances';
import { Instance as ReduxInstance } from '../redux/instances';

import { useContext, useState, useRef, ReactEventHandler, MouseEventHandler, RefObject, memo } from 'react';
import { AppsContext } from '../components/AppsContext';
import useMouseTransform from '../hooks/useMouseTransform';

import './Desktop.css';

export function Desktop() {
    const instances = useSelector(selectAllInstances);

    return (
        <div className="desktop">
            <div class="windows">
                {instances.map(inst => <Window key={inst.id} instance={inst} />)}
            </div>
        </div>
    );
}

// An excellent name of our accumulated genius,
// Dimensions by boo and Window by yours truly. WinDim
type WindowDimensions = {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
};

// Defaults
const defaultDimensions = {
    width: 200,
    height: 120,
    minWidth: 100,
    minHeight: 60
};

let lastIndex = -1;

const getWindowDimensions = (multiplier: number, { width, height, minWidth, minHeight }: WindowDimensions = defaultDimensions) => {
    const { innerWidth, innerHeight } = window;
    const w = width < minWidth ? minWidth : width;
    const h = height < minHeight ? minHeight : height;
    const paddingX = lastIndex * 24 + 12;
    const paddingY = lastIndex * 28 + 6;

    if (innerWidth - w - paddingX < 0 || innerHeight - 44 - h - paddingY < 0) {
        lastIndex = -1;
    }

    lastIndex++;

    return {
        width: w,
        height: h,
        minWidth,
        minHeight,
        paddingX: lastIndex * 24 + 12,
        paddingY: lastIndex * 28 + 6
    }
}

type HandleProps = {
    dir: string;
    callback: Function;
    win: RefObject<HTMLDivElement>
};

const Handle = memo(({ dir, callback, win }: HandleProps) => {
    const onMouseDown = (e) => {
        const window = win.current;
        if (!window) return;

        window.style.transition = 'none';
        callback(e);
    };
    const onMouseUp = () => {
        const window = win.current;
        if (!window) return;

        window.style.transition = '';
    };

    return (
        <div
            className={classNames('handle', dir)}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        />
    );
});

type WindowProps = {
    instance: ReduxInstance
};

function Window({ instance }: WindowProps) {
    const apps = useContext(AppsContext);
    const app = apps[instance.appId];

    const dispatch = useDispatch();

    const [ dimensions ] = useState(getWindowDimensions(instance.id, instance.window));
    const { width, height, minWidth, minHeight, paddingX, paddingY } = dimensions;

    const win = useRef<HTMLDivElement>(null);
    const {
        size,
        offset,
        startTrackingMouseDrag,
        startTrackingMouseResizeTop,
        startTrackingMouseResizeTopRight,
        startTrackingMouseResizeRight,
        startTrackingMouseResizeBottomRight,
        startTrackingMouseResizeBottom,
        startTrackingMouseResizeBottomLeft,
        startTrackingMouseResizeLeft,
        startTrackingMouseResizeTopLeft,
    } = useMouseTransform(win, {
        height: minHeight,
        width: minWidth
    }, {
        top: paddingX,
        left: paddingY
    });

    const onMouseDown = (e) => {
        const window = win.current;
        if (!window) return;

        window.style.transition = 'none';
        startTrackingMouseDrag(e);
    };
    const onMouseUp = () => {
        const window = win.current;
        if (!window) return;

        window.style.transition = '';
    }

    const onClickClose = () => {
        dispatch(deleteInstance(instance.id));
    };

    return (
        <div
            class={'window'}
            style={{
                transform: `translate(${offset.left}px, ${offset.top}px)`,
                minWidth: minWidth,
                minHeight: minHeight,
                width: size?.width ?? width,
                height: size?.height ?? height
            }}
            ref={win}
        >
            <div class="titlebar" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                <div class="title">{instance.appId}</div>
                <div class="window-buttons">
                    <div class="close window-button" onClick={onClickClose}><div class="icon"/></div>
                </div>
            </div>
            <div class="app">
                {app?.render(instance)}
            </div>
            <div class="resize-handles">
                <Handle win={win} dir="n" callback={startTrackingMouseResizeTop} />
                <Handle win={win} dir="ne" callback={startTrackingMouseResizeTopRight} />
                <Handle win={win} dir="e" callback={startTrackingMouseResizeRight} />
                <Handle win={win} dir="se" callback={startTrackingMouseResizeBottomRight} />
                <Handle win={win} dir="s" callback={startTrackingMouseResizeBottom} />
                <Handle win={win} dir="sw" callback={startTrackingMouseResizeBottomLeft} />
                <Handle win={win} dir="w" callback={startTrackingMouseResizeLeft} />
                <Handle win={win} dir="nw" callback={startTrackingMouseResizeTopLeft} />
            </div>
        </div>
    )
}
