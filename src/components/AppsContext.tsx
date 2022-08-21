import { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllAppIds } from "../redux/apps";

import * as _defaultApps from '../apps';
import { Instance } from "../redux/instances";

class DefaultAppClass {
    constructor(public app: GlobalApp) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(instance: Instance): ReactNode {
        return null;
    }
}

const defaultApps: Record<string, { class: typeof DefaultAppClass }> = _defaultApps;

const appInstancesSingleton: Record<string, DefaultAppClass> = {};

export const AppsContext = createContext(appInstancesSingleton);

type AppsContextComponentProps = {
    children: ReactNode;
};

export class GlobalApp {}

const globalApp = new GlobalApp();

export default function AppsContextComponent({ children }: AppsContextComponentProps) {
    const appIds = useSelector(selectAllAppIds);
    const [appInstances, setAppInstances] = useState(appInstancesSingleton);

    useEffect(() => {
        setAppInstances(instances => {
            const copy = {...instances};

            for (const appId of appIds) {
                const App = defaultApps[appId].class;

                if (!(appId in copy) || copy[appId].constructor !== App) {
                    copy[appId] = new App(globalApp);
                }
            }

            return copy;
        });
    }, [appIds]);

    return (
        <AppsContext.Provider value={appInstances}>
            { children }
        </AppsContext.Provider>
    );
}
