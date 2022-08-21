import { ReactNode, useEffect } from "react";
import { useDispatch } from "../redux";
import { addApps, App } from "../redux/apps";

// Rebound for hot module reloading
import * as _defaultApps from '../apps';

type ReduxLoaderProps = {
    children: ReactNode
};

export default function ReduxLoader({ children }: ReduxLoaderProps) {
    const dispatch = useDispatch();
    const defaultApps = _defaultApps;

    useEffect(() => {
        dispatch(addApps({ apps: Object.values(defaultApps).map(app => app.manifest as App) }));
    }, [defaultApps, dispatch]);

    return children;
}
