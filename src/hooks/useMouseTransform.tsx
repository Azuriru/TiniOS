import { useState, useCallback, useRef, RefObject } from 'react';
import useMouseTracker from './useMouseTracker';
import { startsWith } from '../util/string';

type SizeState = { width: number; height: number; } | null;

type MinSizes = {
    width: number;
    height: number
};

type MinOffset = {
    top: number;
    left: number
};

// TODO: DRY this file

export default function useMouseTransform(
    elementRef: RefObject<HTMLElement>,
    minSizes?: MinSizes,
    minOffset: MinOffset = {
        top: 0,
        left: 0
    }
) {
    const [size, setSize] = useState<SizeState>(null);
    const [offset, setOffset] = useState(minOffset);

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

        if (!elementRef.current) return;

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

    const startTrackingMouseResizeAll = (direction: string) => {
        return useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
            const { width, height } = startSize.current;
            const { top, left } = startOffset.current;

            let [ newHeight, newWidth ] = [ width, height];
            let [ newTop, newLeft ] = [ top, left ];

            const dir = (d: string) => startsWith(d, '!')
                ? direction === d.slice(1)
                : direction.includes(d);

            if (dir('n')) {
                newHeight + deltaY;
                newTop - deltaY;
            }
            if (dir('s') && dir('!s'))
                newHeight - deltaY;
            if (dir('w'))
                newWidth + deltaX;
            if (dir('e'))
                newLeft - deltaX;

            if (minSizes !== undefined && (dir('n') || dir('w'))) {
                if (dir('n')) {
                    const clampedHeight = Math.max(minSizes.height, newHeight);
                    newTop -= clampedHeight - newHeight;
                    newHeight = clampedHeight;
                }

                if (dir('!sw')) {
                    const clampedHeight = Math.max(minSizes.height, newHeight);
                    newHeight = clampedHeight;
                }

                if (dir('w')) {
                    const clampedWidth = Math.max(minSizes.width, newWidth);
                    newLeft -= clampedWidth - newWidth;
                    newWidth = clampedWidth;
                }
            }

            setSize({
                width: newWidth,
                height: newHeight
            });
            setOffset({
                top: newTop,
                left: newLeft
            });
        });
    }

    const direction = startTrackingMouseResizeAll;

    return {
        size,
        offset,
        startTrackingMouseDrag,
        startTrackingMouseResizeTop: direction('n'),
        startTrackingMouseResizeTopRight: direction('ne'),
        startTrackingMouseResizeRight: direction('e'),
        startTrackingMouseResizeBottomRight: direction('sw'),
        startTrackingMouseResizeBottom: direction('s'),
        startTrackingMouseResizeBottomLeft: direction('se'),
        startTrackingMouseResizeLeft: direction('e'),
        startTrackingMouseResizeTopLeft: direction('ne')
    };
}