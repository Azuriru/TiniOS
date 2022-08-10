import classNames from 'classnames';
import { useSelector } from '../redux';
import { selectAllInstances } from '../redux/instances';
import { Instance as ReduxInstance } from '../redux/instances';

import { useContext, useState, useRef, ReactEventHandler, MouseEventHandler } from 'react';
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
const Dimensions = {
    width: 400,
    height: 400,
    minWidth: 200,
    minHeight: 200
};

let lastIndex = -1;

const getWindowDimensions = (multiplier: number, { width, height, minWidth, minHeight }: WindowDimensions = Dimensions) => {
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
        width,
        height,
        minWidth,
        minHeight,
        paddingX: lastIndex * 24 + 12,
        paddingY: lastIndex * 28 + 6
    }
}

type WindowProps = {
    instance: ReduxInstance
};


function Window({ instance }: WindowProps) {
    const apps = useContext(AppsContext);
    const app = apps[instance.appId];
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
        height,
        width
    }, {
        top: paddingX,
        left: paddingY
    });

    type HandleProps = {
        dir: string;
        callback: Function;
    };

    const Handle = ({ dir, callback }: HandleProps) => {
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
        }

        return (
            <div
                className={classNames('handle', dir)}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
            />
        );
    }

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

    return (
        <div
        class={'window'}
        style={{
            transform: `translate(${offset.left}px, ${offset.top}px)`,
            minWidth: `${minWidth}px`,
            minHeight: `${minHeight}px`,
            ...size
        }}
        ref={win}
        >
            <div class="titlebar" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                <div class="title">{instance.appId}</div>
            </div>
            <div class="app">
                {app?.render(instance)}
            </div>
            <div class="resize-handles">
                <Handle dir="n" callback={startTrackingMouseResizeTop} />
                <Handle dir="ne" callback={startTrackingMouseResizeTopRight} />
                <Handle dir="e" callback={startTrackingMouseResizeRight} />
                <Handle dir="se" callback={startTrackingMouseResizeBottomRight} />
                <Handle dir="s" callback={startTrackingMouseResizeBottom} />
                <Handle dir="sw" callback={startTrackingMouseResizeBottomLeft} />
                <Handle dir="w" callback={startTrackingMouseResizeLeft} />
                <Handle dir="nw" callback={startTrackingMouseResizeTopLeft} />
            </div>
        </div>
    )
}
