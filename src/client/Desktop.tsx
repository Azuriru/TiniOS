import { useDispatch, useSelector, useStore } from '../redux';
import { deleteInstance, focusInstance, selectAllInstances, selectLastWindowState, updateInstanceWindow, WindowState } from '../redux/instances';
import { Instance as ReduxInstance } from '../redux/instances';

import classNames from 'classnames';
import { useContext, useState, useRef, memo, MouseEvent, useMemo, ReactEventHandler, useEffect, SetStateAction, Dispatch } from 'react';
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

const getWindowDimensions = (lastWindowState?: WindowState, { width, height, minWidth, minHeight }: WindowDimensions = defaultDimensions) => {
    const { innerWidth, innerHeight } = window;
    const w = width < minWidth ? minWidth : width;
    const h = height < minHeight ? minHeight : height;

    let paddingX = (lastWindowState?.left ?? 0) + 32;
    let paddingY = (lastWindowState?.top ?? 0) + 32;

    if (paddingX + w > innerWidth) {
        paddingX = 12;
    }

    if (paddingY + h > innerHeight) {
        paddingY = 6;
    }

    return {
        width: w,
        height: h,
        minWidth,
        minHeight,
        paddingX,
        paddingY
    };
};

type HandleProps = {
    dir: string;
    callback: (e: MouseEvent) => void;
    setEnabledTransitions: Dispatch<SetStateAction<boolean>>;
};

const Handle = memo(function Handle({ dir, callback, setEnabledTransitions }: HandleProps) {
    const onMouseDown = (e: MouseEvent) => {
        setEnabledTransitions(false);
        callback(e);
    };
    const onMouseUp = () => {
        setEnabledTransitions(true);
    };

    return (
        <div
            className={`handle ${dir}`}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        />
    );
});

type WindowButtonProps = {
    type: string;
    onClick: ReactEventHandler;
    // onClick: (e: MouseEvent) => void;
};

const WindowButton = memo(function WindowButton({ type, onClick }: WindowButtonProps) {
    return (
        <div
            class={classNames('window-button', type)}
            onClick={onClick}
        >
            <div class="icon"/>
        </div>
    );
});

type WindowProps = {
    instance: ReduxInstance
};

const Window = memo(function Window({ instance }: WindowProps) {
    const apps = useContext(AppsContext);
    const app = apps[instance.appId];

    console.log('rendered window');

    const dispatch = useDispatch();

    const store = useStore();

    const [ dimensions ] = useState(() => getWindowDimensions(selectLastWindowState(store.getState())));
    const { width, height, minWidth, minHeight, paddingX, paddingY } = dimensions;
    const [ enabledTransitions, setEnabledTransitions ] = useState(true);
    const [ minimized, setMinimized ] = useState(false);
    const [ maximized, setMaximized ] = useState(false);

    const win = useRef<HTMLDivElement>(null);
    const {
        size,
        offset,
        useStyles,
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
        minSize: {
            height: minHeight,
            width: minWidth
        },
        initialOffset: {
            top: paddingY,
            left: paddingX
        },
        initialSize: {
            height,
            width
        }
    });
    const restStyles = useMemo(() => {
        return {
            zIndex: instance.zIndex
        };
    }, [instance.zIndex]);
    const styles = useStyles(restStyles);

    useEffect(() => {
        dispatch(updateInstanceWindow({
            id: instance.id,
            state: {
                minHeight,
                minWidth,
                height: size?.height ?? height,
                width: size?.width ?? width,
                top: offset?.top ?? paddingY,
                left: offset?.left ?? paddingX
            }
        }));
    }, [dispatch, instance, size, offset, minHeight, minWidth, height, width, paddingY, paddingX]);

    const onClickMinimize = () => {
        setMinimized(minimized => !minimized);
    };
    const onClickMaximized = () => {
        setMaximized(maximized => !maximized);
    };
    const onClickClose = () => {
        dispatch(deleteInstance(instance.id));
    };

    const onFocus = () => {
        dispatch(focusInstance(instance.id));
    };

    const onMouseDown = (e: MouseEvent): void => {
        setEnabledTransitions(false);
        startTrackingMouseDrag(e);
    };
    const onMouseUp = (): void => {
        setEnabledTransitions(true);
    };

    return (
        <div
            class={classNames('window', minimized && 'minimized', maximized && 'maximized')}
            style={{
                transition: enabledTransitions ? '.3s' : 'none',
                ...styles
            }}
            onMouseDown={onFocus}
            ref={win}
        >
            <div class="titlebar" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
                <div class="title">{instance.appId}</div>
                <div class="window-buttons">
                    <WindowButton type="minimize" onClick={onClickMinimize}/>
                    <WindowButton type="maximize" onClick={onClickMaximized}/>
                    <WindowButton type="close" onClick={onClickClose}/>
                </div>
            </div>
            <div class="app">
                {app?.render(instance)}
            </div>
            <div class="resize-handles">
                <Handle setEnabledTransitions={setEnabledTransitions} dir="n" callback={startTrackingMouseResizeTop} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="ne" callback={startTrackingMouseResizeTopRight} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="e" callback={startTrackingMouseResizeRight} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="se" callback={startTrackingMouseResizeBottomRight} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="s" callback={startTrackingMouseResizeBottom} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="sw" callback={startTrackingMouseResizeBottomLeft} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="w" callback={startTrackingMouseResizeLeft} />
                <Handle setEnabledTransitions={setEnabledTransitions} dir="nw" callback={startTrackingMouseResizeTopLeft} />
            </div>
        </div>
    );
});
