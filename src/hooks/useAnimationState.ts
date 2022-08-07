import { useReducer, useRef, useState } from "react";

export function useAnimationState() {
    const [ state, setState ] = useState('default');
    const ref = useRef<HTMLElement>();

    const start = () => {};
    const end = () => {};

    return {
        ref,
        state,
        start,
        end
    };
}
