import { Component, FC, ReactNode } from "react";

export function nested(...components: (FC | typeof Component | Record<string, any>)[]): JSX.Element {
    if (components.length === 0) {
        return <></>;
    }

    let child: ReactNode = null;
    let props: any = null;

    let i = components.length;
    while (i--) {
        const Component = components[i];

        if (typeof Component === 'object') {
            props = Component;
        } else {
            child = <Component {...props}>{child}</Component>;
            props = null;
        }
    }

    return <>{child}</>;
}
