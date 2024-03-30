class AppState {
    constructor(OS) {
        this.OS = OS;
        this.state = this.OS.settings.database.get('app-state') || {};
        this.taskbar = this.OS.settings.database.get('app-state-taskbar') || [];
        this.start = this.OS.settings.database.get('app-state-start') || [];
        this.reordering = {};
    }

    add(app) {
        const { stringified: name } = app;

        if (this.state[name]) return;

        const {
            options: {
                docked: taskbar,
                pinned: start,
                startup
            }
        } = app;

        this.state[name] = {
            taskbar,
            start,
            startup
        };

        if (taskbar) {
            this.taskbar.push(name);
        }

        if (start) {
            this.start.push(name);
        }

        this.OS.settings.database.set('app-state', this.state);
        this.OS.settings.database.set('app-state-taskbar', this.taskbar);
        this.OS.settings.database.set('app-state-start', this.start);
    }

    getStartup(app) {
        return this.state[app].startup;
    }

    toggleStartup(app) {
        this.state[app].startup = !this.state[app].startup;
        this.OS.settings.database.set('app-state', this.state);
    }

    filterFrom(type) {
        if (type === 'taskbar') {
            return [...this.OS.taskbar.appTray.children].filter(app => this.state[app.dataset.name].taskbar);
        } else {
            return [...this.OS.start.pinned.children].filter(app => this.state[app.dataset.name].start);
        }
    }

    reIndex(type) {
        this[type] = [];

        for (const app of this.filterFrom(type)) {
            this[type].push(app.dataset.name);
        }

        this.OS.settings.database.set(`app-state-${type}`, this[type]);
    }

    mount(type, app) {
        this.state[app][type] = true;
        this.reIndex(type);
    }

    unmount(type, app) {
        this.state[app][type] = false;
        this.reIndex(type);
    }
}

export default AppState;