import { useDispatch, useSelector } from '../redux';
import { actions, selectInstanceById, selectInstanceIds } from '../redux/instances';

import classNames from 'classnames';
import { useContext, useState, useRef, memo, MouseEvent, useMemo, ReactEventHandler, useEffect, SetStateAction, Dispatch } from 'react';
import { AppsContext } from '../components/AppsContext';
import useMouseTransform from '../hooks/useMouseTransform';
import { useEvent } from '../hooks/useEvent';

import { multiref } from '../util/react';

import './Desktop.css';
import { EntityId } from '@reduxjs/toolkit';
import { useAnimationState } from '../hooks/useAnimationState';

export function Desktop() {
    // FIXME: This component renders twice when an instance is added
    const instanceIds = useSelector(selectInstanceIds);

    return (
        <div className="desktop">
            <div class="windows">
                {instanceIds.map(id => <Window key={id} instanceId={id} />)}
            </div>
        </div>
    );
}

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
    instanceId: EntityId;
};

const Window = memo(function Window({ instanceId }: WindowProps) {
    const instance = useSelector(state => selectInstanceById(state, instanceId)!);

    const apps = useContext(AppsContext);
    const app = apps[instance.appId];

    const dispatch = useDispatch();

    const { width, height, minWidth, minHeight, left, top, visibleState } = instance.window;
    const [ enabledTransitions, setEnabledTransitions ] = useState(true);
    const { ref, shouldAnimate, shouldRemove, endTransition } = useAnimationState(visibleState, visibleState === 'minimized');

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
            top,
            left
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
        dispatch(actions.updateInstanceWindow({
            id: instance.id,
            state: {
                minHeight,
                minWidth,
                height: size?.height ?? height,
                width: size?.width ?? width,
                top: offset?.top ?? top,
                left: offset?.left ?? left,
                visibleState: visibleState
            }
        }));
    }, [dispatch, instance.id, size, offset, minHeight, minWidth, height, width, top, left, visibleState]);

    const onClickMinimize = useEvent(() => {
        dispatch(actions.minimize(instance.id));
    });
    const onClickMaximized = useEvent(() => {
        dispatch(actions.maximize(instance.id));
    });
    const onClickClose = useEvent(() => {
        dispatch(actions.deleteInstance(instance.id));
    });

    const onFocus = useEvent(() => {
        dispatch(actions.focusInstance(instance.id));
    });

    const onMouseDown = useEvent((e: MouseEvent): void => {
        setEnabledTransitions(false);
        startTrackingMouseDrag(e);
    });
    const onMouseUp = useEvent((): void => {
        setEnabledTransitions(true);
    });

    if (shouldRemove) {
        console.log('hiding window', visibleState);
        return null;
    }

    return (
        <div
            class={classNames('window', shouldAnimate && visibleState, !shouldAnimate && 'appearing')}
            style={{
                transition: enabledTransitions ? '.3s' : 'none',
                ...styles
            }}
            onTransitionEnd={endTransition}
            onMouseDown={onFocus}
            ref={multiref(win, ref)}
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
