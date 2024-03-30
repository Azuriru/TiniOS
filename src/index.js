import ui from 'dorui';
import OS from './js/client/OS';
import Sessions, { sessionIndexes } from './js/client/Sessions';

import './index.css';

const route = location.pathname;
const parts = route.split('/').slice(1);

if (parts[0] === 'apps') {
    const app = OS.apps.find(app => app.stringified === parts[1]);
    const session = app.devSession();

    document.body.appendChild(
        ui.div({
            class: 'app',
            child: session.window
        })
    );
} else {
    document.body.appendChild(
        OS.client
    );
}

window.Sessions = Sessions;
window.sessionIndexes = sessionIndexes;