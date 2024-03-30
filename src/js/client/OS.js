import ui from 'dorui';
import i18n from './i18n';
import Settings from './Settings';
import Apps from './Apps';
import State from './AppState';
import Clock from '../components/Clock';
import Start from './Start';
import Taskbar from './Taskbar';
// import Boot from '../Boot';
// import Icon from '../components/Icon';

import '../../css/OS.css';
import '../../css/Animations.css';
import '../../css/Desktop.css';
import '../../css/Taskbar.css';
import '../../css/Boot.css';
import '../../css/DevMode.css';

class OS {
    constructor() {
        this.i18n = new i18n();
        this.clock = new Clock();
        this.start = new Start(this);
        this.taskbar = new Taskbar(this);
        this.desktop = this.buildDesktop();
        this.client = this.buildClient();
        this.settings = new Settings(this);
        this.state = new State(this);
        this.apps = [];
        window.OS = this;
        window.ui = ui;

        this.boot();
    }

    boot() {
        this.clock.start();

        const { innerHeight, innerWidth } = window;
        const [ previewX, previewY ] = [116, 36];

        this.previewLimit = {
            y: Math.floor((innerHeight - 48) / previewY),
            x: Math.round(innerWidth / previewX)
        }

        window.addEventListener('resize', this.resize = () => {
            const { innerHeight, innerWidth } = window;
            const [ previewX, previewY ] = [116, 36];

            this.previewLimit = {
                y: Math.floor((innerHeight - 48) / previewY),
                x: Math.round(innerWidth / previewX)
            }
        });

        this.loadApps(Apps);
        this.taskbar.loadApps(this.apps, this.state.taskbar);
        this.start.loadApps(this.apps, this.state.start);

        for (const app of this.apps) {
            if (this.state.getStartup(app.stringified)) {
                app.launch();
            }
        }
    }

    shutdown() {
        window.removeEventListener('resize', this.resize);
    }

    resetAll() {
        for (const data of ['global', 'settings', 'apps']) {
            localStorage.removeItem(data);
        }
    }

    reboot() {

    }

    loadApp(App) {
        const app = new App(this);

        this.apps.push(app);
        this.state.add(app);
        this.start.loadApp(app);
    }

    loadApps(Apps) {
        for (const app of Apps) {
            this.loadApp(app);
        }
    }

    buildDesktop() {
        return ui.div({
            class: 'desktop',
            child: this.windows = ui.div({
                class: 'windows'
            })
        });
    }

    buildClient() {
        return ui.div({
            id: 'OS',
            children: [
                // Boot,
                this.desktop,
                this.taskbar.element
            ],
            events: {
                click: e => {
                    if (!e.target.closest('.start')) {
                        this.start.hide();
                    }

                    if (!e.target.closest('.start .context')) {
                        this.start.hideContextMenu();
                    }

                    if (!e.target.closest('.lang-switch')) {
                        this.taskbar.languageSwitch.querySelector('.language-options').classList.remove('shown');
                    }
                }
            }
        });
    }
}

export default new OS();