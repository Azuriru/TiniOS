import { useState, useCallback, useRef, RefObject } from 'react';

import useMouseTracker from './useMouseTracker';

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

        setSize({
            width: startSize.current.width - deltaX,
            height: newHeight
        });
        setOffset({
            top: newTop,
            left: startOffset.current.left
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

        setSize({
            width: newWidth,
            height: newHeight
        });
        setOffset({
            top: startOffset.current.top,
            left: newLeft
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

        setSize({
            width: newWidth,
            height: startSize.current.height
        });
        setOffset({
            top: startOffset.current.top,
            left: newLeft
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

        setSize({
            width: newWidth,
            height: newHeight
        });
        setOffset({
            top: newTop,
            left: newLeft
        });
    });

    const startTrackingMouseResizeBabyn = (e: MouseEvent) => {
        if (e.button !== 0) return;

        const { width, height } = this.window.getBoundingClientRect();
        const offsetX = e.clientX;
        const offsetY = e.clientY;
        let mousemove;

        this.window.style.transition = 'none';

        window.addEventListener('mousemove', mousemove = e => {
            e.preventDefault();

            const { x, y, right, bottom } = this.window.getBoundingClientRect();
            const { minWidth, minHeight } = this.window.style;

            const direction = d => 'left'.includes(d);

            if (direction('nw')) {
                if (e.clientX > right - parseInt(minWidth) || e.clientY > bottom - parseInt(minHeight)) return;
                this.window.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
                this.window.style.height = `${height - e.clientY + offsetY}px`;
                this.window.style.width = `${width - e.clientX + offsetX}px`;
                return;
            }

            if (direction('n')) {
                if (e.clientY > bottom - parseInt(minHeight)) return;
                this.window.style.height = `${height - e.clientY + offsetY}px`;
                this.window.style.transform = `translate(${x}px, ${e.clientY}px)`;
            }

            if (direction('e')) {
                this.window.style.width = `${e.clientX - x}px`;
            }

            if (direction('s')) {
                this.window.style.height = `${e.clientY - y}px`;
            }

            if (direction('w')) {
                if (e.clientX > right - parseInt(minWidth)) return;
                this.window.style.width = `${width - e.clientX + offsetX}px`;
                this.window.style.transform = `translate(${e.clientX}px, ${y}px)`;
            }
        });
    }

    const startTrackingMouseResizeAll = (dir: string) => {
        return useMouseTracker(storeStartOffsets, ({ deltaX, deltaY }) => {
            const direction = (d: string) => dir.includes(d);

            // newHeight
            // top/tl/tr: startSize.current.height + deltaY;
            // br/bl: startSize.current.height - deltaY;

            // newWidth
            // left/tl/bl: startSize.current.width + deltaX;

            // newTop
            // top/tl/tr: startOffset.current.top - deltaY;

            // newLeft
            // left/tl/bl: startOffset.current.left - deltaX;

            // Top, TR, BL, L, TL
            if (minSizes !== undefined) {
                // Top/TL/TR
                // const clampedHeight = Math.max(minSizes.height, newHeight);
                // newTop -= clampedHeight - newHeight;
                // newHeight = clampedHeight;

                // BL
                // const clampedHeight = Math.max(minSizes.height, newHeight);
                // newHeight = clampedHeight;

                // Left/TL/BL
                // const clampedWidth = Math.max(minSizes.width, newWidth);
                // newLeft -= clampedWidth - newWidth;
                // newWidth = clampedWidth;
            }

            // setSize
            // Width:
            //   top: startSize.current.width
            //   right/br: startSize.current.width - deltaX
            //   tr: startSize.current.width - deltaX
            //   bottom: startSize.current.width
            //   left/bl/tl: newWidth
            // Height:
            //   top/tr/bl/tl: newHeight
            //   right: startSize.current.height
            //   bottom/br: startSize.current.height - deltaY
            //   left: startSize.current.height

            // setOffset
            // Top:
            //   top/tr/tl: newTop
            //   left/bl: startOffset.current.top
            // Left:
            //   top/tr: startOffset.current.left
            //   left/bl/tl: newLeft
        });
    }

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