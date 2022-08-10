import { ReactNode, useRef } from 'react';
import useMouseTransform from '../hooks/useMouseTransform';

import './Dragsizable.css';

type DragsizableProps = {
    children?: ReactNode;
};

export default function Dragsizable({ children }: DragsizableProps) {
    const dragsizable = useRef(null);
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
    } = useMouseTransform(dragsizable, {
        height: 60,
        width: 100
    });

    return (
        <div
            className="dragsizable"
            style={{
                transform: `translate(${offset.left}px, ${offset.top}px)`,
                ...size
            }}
            ref={dragsizable}
        >
            <div
                    className="drag-handle"
                    onMouseDown={startTrackingMouseDrag}
                >
                Move me around!
            </div>
            {children}
            <div
                className="move-handle handle-top"
                onMouseDown={startTrackingMouseResizeTop}
            />
            <div
                className="move-handle corner-handle handle-top-right"
                onMouseDown={startTrackingMouseResizeTopRight}
            />
            <div
                className="move-handle handle-right"
                onMouseDown={startTrackingMouseResizeRight}
            />
            <div
                className="move-handle corner-handle handle-bottom-right"
                onMouseDown={startTrackingMouseResizeBottomRight}
            />
            <div
                className="move-handle handle-bottom"
                onMouseDown={startTrackingMouseResizeBottom}
            />
            <div
                className="move-handle corner-handle handle-bottom-left"
                onMouseDown={startTrackingMouseResizeBottomLeft}
            />
            <div
                className="move-handle handle-left"
                onMouseDown={startTrackingMouseResizeLeft}
            />
            <div
                className="move-handle corner-handle handle-top-left"
                onMouseDown={startTrackingMouseResizeTopLeft}
            />
        </div>
    );
}