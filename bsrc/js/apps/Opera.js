import ui from 'dorui';
import App from '../client/App';
import Instance from '../client/Instance';

import '../../css/apps/Opera.css';

class OperaInstance extends Instance {
    constructor(session, index) {
        super(session, index);
    }
}

class Opera extends App {
    constructor(OS) {
        super(OS, {
            name: 'Opera',
            icon: ui.div({
                class: 'opera'
            }),
            info: {
                author: 'Opera Software AS'
            },
            options: {
                docked: true,
                pinned: true,
                maxSessions: Infinity
            },
            instance: OperaInstance
        });
        this.ui = this.buildUI();
    }

    get customContext() {
        return [
            {
                className: 'new-tab',
                icon: this.icon.cloneNode(true),
                text: 'New Tab',
                click: () => {
                    this.newSession();
                }
            },
            {
                className: 'new-window',
                icon: this.icon.cloneNode(true),
                text: 'New Window',
                click: () => {
                    this.newSession();
                }
            },
            {
                className: 'new-incog',
                icon: this.icon.cloneNode(true),
                text: 'New Private Window',
                click: () => {
                    this.newSession();
                }
            }
        ];
    }

    buildUI() {
        return ui.div({
            class: 'opera-app'
        });
    }
}

export default Opera;