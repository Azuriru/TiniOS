import { useState, useCallback, useRef, MutableRefObject } from 'react';

import useMouseTracker from './useMouseTracker';

type SizeState = { width: number; height: number; } | null;

type MinSizes = {
    width: number;
    height: number
};

// TODO: DRY this file

export default function useMouseTransform(
    elementRef: MutableRefObject<HTMLElement>,
    minSizes?: MinSizes
) {
    const [size, setSize] = useState<SizeState>(null);
    const [offset, setOffset] = useState({
        top: 0,
        left: 0
    });

    // These are instance variables
    // They're used to keep track of the initial positions of `draggable`
    // and the mouse when the user starts dragging
    // They're not state because they're used in the mouse move callbacks
    // and they must always get the latest value, and their identity
    // must be stable
    const startSize = useRef({
        width: 0,
        height: 0
    });
    const startOffset = useRef({
        top: 0,
        left: 0
    });

    const storeStartOffsets = useCallback((e) => {
        e.preventDefault();

        const bounds = elementRef.current.getBoundingClientRect();

        startSize.current.width = bounds.width;
        startSize.current.height = bounds.height;

        startOffset.current.top = offset.top;
        startOffset.current.left = offset.left;
    }, [offset, elementRef]);

    const startTrackingMouseDrag = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        setOffset({
            top: startOffset.current.top - deltaY,
            left: startOffset.current.left - deltaX
        });
    });

    const startTrackingMouseResizeTop = useMouseTracker(storeStartOffsets, ({ deltaY }) => {
        let newHeight = startSize.current.height + deltaY;
        let newTop = startOffset.current.top - deltaY;

        if (minSizes !== undefined) {
            const clampedHeight = Math.max(minSizes.height, newHeight);
            newTop -= clampedHeight - newHeight;
            newHeight = clampedHeight;
        }

        setSize({
            width: startSize.current.width,
            height: newHeight
        });
        setOffset({
            top: newTop,
            left: startOffset.current.left
        });
    });

    const startTrackingMouseResizeTopRight = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        let newHeight = startSize.current.height + deltaY;
        let newTop = startOffset.current.top - deltaY;

        if (minSizes !== undefined) {
            const clampedHeight = Math.max(minSizes.height, newHeight);
            newTop -= clampedHeight - newHeight;
            newHeight = clampedHeight;
        }

        setOffset({
            top: newTop,
            left: startOffset.current.left
        });
        setSize({
            width: startSize.current.width - deltaX,
            height: newHeight
        });
    });

    const startTrackingMouseResizeRight = useMouseTracker(storeStartOffsets, ({ deltaX }) => {
        setSize({
            width: startSize.current.width - deltaX,
            height: startSize.current.height
        });
    });

    const startTrackingMouseResizeBottomRight = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        setSize({
            width: startSize.current.width - deltaX,
            height: startSize.current.height - deltaY
        });
    });

    const startTrackingMouseResizeBottom = useMouseTracker(storeStartOffsets, ({ deltaY }) => {
        setSize({
            width: startSize.current.width,
            height: startSize.current.height - deltaY
        });
    });

    const startTrackingMouseResizeBottomLeft = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        let newHeight = startSize.current.height - deltaY;
        let newWidth = startSize.current.width + deltaX;
        let newLeft = startOffset.current.left - deltaX;

        if (minSizes !== undefined) {
            const clampedHeight = Math.max(minSizes.height, newHeight);
            newHeight = clampedHeight;

            const clampedWidth = Math.max(minSizes.width, newWidth);
            newLeft -= clampedWidth - newWidth;
            newWidth = clampedWidth;
        }

        setOffset({
            top: startOffset.current.top,
            left: newLeft
        });
        setSize({
            width: newWidth,
            height: newHeight
        });
    });

    const startTrackingMouseResizeLeft = useMouseTracker(storeStartOffsets, ({ deltaX }) => {
        let newWidth = startSize.current.width + deltaX;
        let newLeft = startOffset.current.left - deltaX;

        if (minSizes !== undefined) {
            const clampedWidth = Math.max(minSizes.width, newWidth);
            newLeft -= clampedWidth - newWidth;
            newWidth = clampedWidth;
        }

        setOffset({
            top: startOffset.current.top,
            left: newLeft
        });
        setSize({
            width: newWidth,
            height: startSize.current.height
        });
    });

    const startTrackingMouseResizeTopLeft = useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
        let newHeight = startSize.current.height + deltaY;
        let newWidth = startSize.current.width + deltaX;
        let newTop = startOffset.current.top - deltaY;
        let newLeft = startOffset.current.left - deltaX;

        if (minSizes !== undefined) {
            const clampedHeight = Math.max(minSizes.height, newHeight);
            newTop -= clampedHeight - newHeight;
            newHeight = clampedHeight;

            const clampedWidth = Math.max(minSizes.width, newWidth);
            newLeft -= clampedWidth - newWidth;
            newWidth = clampedWidth;
        }

        setOffset({
            top: newTop,
            left: newLeft
        });
        setSize({
            width: newWidth,
            height: newHeight
        });
    });

    return {
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
        startTrackingMouseResizeTopLeft
    };
}
