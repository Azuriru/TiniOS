import ui from 'dorui';
import { sessionIndexes, addSession, removeSession, findLatestSession, getLatestSession, bringToFront, clearDesktopSessions } from './Sessions';
import Icon from '../components/Icon';
import Instance from './Instance';
import Session from './Session';
import { stringify } from '../components/util/normalize';
import { fadeIn, customOptions } from '../components/util/animations';

class App {
    constructor(OS, {
        name,
        icon = Icon('api'),
        info: {
            version = '1.0.0',
            author = 'Tini Defaults',
            date = 1616515920576 // 1563984000000 25/06/2019 i wish ;;
        } = {},
        options: {
            color = '',
            docked = true,
            pinned = false,
            startup = false,
            maxSessions = 1
        } = {},
        windowSettings = {},
        instance = Instance
    }) {
        this.OS = OS;
        this.name = name;
        this.stringified = stringify(name);
        this.icon = icon;
        this.info = {
            version,
            author,
            date
        };
        this.options = {
            color,
            docked,
            pinned,
            startup,
            maxSessions
        };
        this.windowSettings = windowSettings;
        this.instance = instance;
        this.sessions = [];
        this.latestSession;
    }

    get installDate() {
        const d = new Date(this.info.date);
        const date = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();

        const pad = num => num.toString().padStart(2, '0');

        return `${pad(date)}/${pad(month + 1)}/${year}`;
    }

    get size() {
        // LOL todo with node laterrrr
        return '10 KB';
    }

    get customContext() {
        return [];
    }

    get isPinned() {
        return this.OS.state.state[this.stringified].start;
    }

    get isDocked() {
        return this.OS.state.state[this.stringified].taskbar;
    }

    focus() {
        if (this.toolbarIcon.classList.contains('active')) return;

        for (const app of this.OS.taskbar.appTray.children) {
            app.classList.remove('active');
        }
        this.toolbarIcon.classList.add('active');
    }

    unfocus() {
        this.toolbarIcon.classList.remove('active');
    }

    launch() {
        // For you, incase you try to launch an app while it is quitting and give me stupid errors.
        if (this.quitting) return;

        if (!this.toolbarIcon) this.OS.taskbar.appTray.appendChild(this.buildToolbarIcon());

        // Apparently, it only launches the initial window
        // And you need to right click it to open more sessions
        if (this.sessions.length === 0) {
            this.newSession();

            if (this.OS.taskbar.contextMenu.style.display === '' && this.hovered) {
                this.OS.taskbar.showPreviews(() => {
                    this.OS.taskbar.buildPreview(this);
                }, 0);
            }
        } else if (this.sessions.length === 1) {
            if (this.latestSession.isMinimized) {
                this.focus();
                bringToFront(this.latestSession);
                this.latestSession.minimize(false);
            } else {
                this.unfocus();
                this.latestSession.minimize();
            }

            this.OS.taskbar.hidePreviews(0);
        } else {
            if (this.OS.taskbar.state.shownPreviews) {
                this.OS.taskbar.hidePreviews(0);
                this.unfocus();
            } else {
                this.OS.taskbar.showPreviews(null, 0);
                this.focus();
            }
        }

        if (!this.isPinned && !this.recent) {
            this.OS.start.recent.appendChild(
                this.OS.start.buildStartAppItem(this, 'recent')
            );
        }
    }

    unlaunch() {
        if (this.isDocked || this.quitting) return;

        if (this.toolbarIcon) {
            this.toolbarIcon.classList.add('hidden');
            this.quitting = true;

            const next = this.toolbarIcon.nextElementSibling;

            setTimeout(() => {
                if (next) {
                    next.style.transition = 'none';
                    next.style.marginLeft = '59px';
                    next.scrollHeight;
                    next.style.transition = '';
                    next.style.marginLeft = '';
                }

                this.toolbarIcon.remove();
                this.toolbarIcon = null;
                this.quitting = false;
            }, 300);
        }
    }

    pin() {
        if (!this.toolbarIcon) this.OS.taskbar.appTray.appendChild(this.buildToolbarIcon());

        this.OS.state.mount('taskbar', this.stringified);
    }

    unpin() {
        this.OS.state.unmount('taskbar', this.stringified);

        if (this.sessions.length === 0) {
            this.unlaunch();
        }
    }

    devSession() {
        return new Session(this, {
            ...this.windowSettings,
            state: 'maximized'
        });
    }

    get allMinimized() {
        return this.sessions.every(session => session.isMinimized);
    }

    newSession() {
        if (this.sessions.length === this.options.maxSessions) return;

        const session = new Session(this, this.windowSettings);
        addSession(session);
        this.sessions.push(session);

        if (this.sessions.length < 4) {
            const panel = this.buildPanel();
            panel.animate(fadeIn, customOptions(500));
            this.panels.appendChild(panel);
        }

        this.OS.windows.appendChild(session.window);

        this.latestSession = session;
        clearDesktopSessions();

        this.focus();

        return session;
    }

    closeSession(session) {
        removeSession(session);
        const i = this.sessions.indexOf(session);
        this.sessions.splice(i, 1);

        if (this.sessions.length < 3) {
            this.panels.lastElementChild.classList.add('hidden');
            setTimeout(() => {
                this.panels.lastElementChild.remove();
            }, 300);
        }

        if (this.sessions.length === 0) {
            sessionIndexes[this.stringified] = undefined;
            this.latestSession = null;
            const latestSession = getLatestSession();

            if (latestSession) {
                latestSession.app.focus();
                bringToFront(latestSession);
            } else {
                this.unfocus()
            }
        } else {
            bringToFront(this.latestSession = findLatestSession(this));
        }

        clearDesktopSessions();
    }

    updatePreviews() {
        this.OS.taskbar.previews.classList.add('freeze');

        const maxWidth = window.innerWidth;
        let width = 0;
        let outputWidth = 0;

        for (const session of this.sessions) {
            width += session.updatePreview(null, false);
        }

        if (width > maxWidth) {
            const padding = this.sessions.length * 12;
            const excess = maxWidth - padding; // Remember that scale only changes the scale of
            const sessions = width - padding; // the preview inside. It doesn't factor in the padding
            const scale = excess / sessions; // at all, so I'm only calcing the remaining space

            this.OS.taskbar.previews.classList.remove('freeze');
            this.OS.taskbar.previews.scrollHeight;

            for (const session of this.sessions) {
                outputWidth += session.updatePreview(session.previewScale * scale);
            }
        } else {
            this.OS.taskbar.previews.classList.remove('freeze');
            this.OS.taskbar.previews.scrollHeight;

            for (const session of this.sessions) {
                outputWidth += session.updatePreview();
            }
        }

        const left = this.toolbarIcon.offsetLeft + 87; // Should be the same as getBoundingClientRect();
        const output = outputWidth / 2;
        const offsetLeft = left - output;
        const offsetRight = left + output;

        if (Math.round(outputWidth) === maxWidth || offsetLeft < 0) {
            this.OS.taskbar.previews.style.left = '0';
            this.OS.taskbar.previews.style.right = '';
        } else if (offsetRight > maxWidth) {
            this.OS.taskbar.previews.style.left = '';
            this.OS.taskbar.previews.style.right = '0';
        } else {
            this.OS.taskbar.previews.style.left = `${offsetLeft}px`;
            this.OS.taskbar.previews.style.right = '';
        }
    }

    mousemove(e) {
        e.preventDefault();

        const { from, startX } = this.OS.state.reordering;
        const { y } = this.OS.taskbar.appTray.getBoundingClientRect();
        const { x, width } = from.getBoundingClientRect();
        const safeZone = Math.round(width * .15);
        const app = document.elementsFromPoint(e.clientX, y)
            .find(e => e.classList.contains('app') && e !== from);

        // Special context menu behavior
        if (e.clientY < y && Math.abs(e.clientX - startX) < safeZone && !this.OS.state.reordering.dragging) {
            window.removeEventListener('mousemove', this.OS.state.reordering.mousemove);

            for (const app of this.OS.taskbar.appTray.children) {
                app.lastElementChild.style.display = '';
            }

            this.toolbarIcon.classList.add('hover');

            this.OS.taskbar.showContextMenu(this);
            this.OS.taskbar.hidePreviews(0, false);

            return;
        }

        if (this.OS.state.reordering.dragging || Math.abs(e.clientX - startX) > safeZone) {
            if (!this.OS.state.reordering.dragging) {
                this.OS.state.reordering.dragging = true;
                this.OS.state.reordering.offsetX = e.clientX - x + 58;

                this.OS.taskbar.hidePreviews(0, false);
            }

            from.style.left = `${e.clientX - this.OS.state.reordering.offsetX}px`;

            // Idk man 1px margin-right
            if (!app || app.dataset.moved === 'true') return;

            if (this.OS.state.reordering.to) {
                // This is to make sure that when state.to gets updated it'll still run
                const { to } = this.OS.state.reordering;
                to.style.marginLeft = '';
                to.dataset.moved = true;
                setTimeout(() => {
                    to.dataset.moved = false;
                }, 300);
            }

            if (app === this.OS.state.reordering.to) {
                app.style.marginLeft = '';
                app.dataset.moved = true;
                setTimeout(() => {
                    app.dataset.moved = false;;
                }, 300);

                let next = app.nextElementSibling;
                if (!next) {
                    this.OS.state.reordering.to = null;
                    return;
                }

                if (next === from) {
                    this.OS.state.reordering.to = null;
                    next = next.nextElementSibling;
                    if (!next) return;
                };

                this.OS.state.reordering.to = next;
                next.style.marginLeft = '59px';
                next.dataset.moved = true;
                setTimeout(() => {
                    next.dataset.moved = false;
                }, 300);
                return;
            }

            this.OS.state.reordering.to = app;
            app.style.marginLeft = '59px';
            app.dataset.moved = true;
            setTimeout(() => {
                app.dataset.moved = false;
            }, 300);
        }
    }

    mouseup() {
        const { from, to, dragging } = this.OS.state.reordering;

        if (!from) return;

        window.removeEventListener('mousemove', this.OS.state.reordering.mousemove);

        if (!dragging) {
            this.launch(); // cause i really can't be fucked to context menu while i test
        } else {
            if (to) {
                this.OS.taskbar.appTray.insertBefore(from, to);
                this.OS.state.reIndex('taskbar');

                const prev = from.previousElementSibling;
                const { x } = from.getBoundingClientRect();
                const { left } = prev
                    ? prev.getBoundingClientRect()
                    : this.OS.taskbar.appTray.getBoundingClientRect();

                from.style.transform = `translateX(${x - (prev ? left + 59 : left)}px)`;
                from.scrollHeight;
                from.style.transition = '.3s transform';
                from.style.transform = '';
                setTimeout(() => {
                    from.style.transition = '';
                }, 300);
            } else {
                const { x } = from.getBoundingClientRect();
                const { right } = this.OS.taskbar.appTray.getBoundingClientRect();

                this.OS.taskbar.appTray.appendChild(from);
                this.OS.state.reIndex('taskbar');

                from.style.marginLeft = `${x - right}px`;
                from.scrollHeight;
                from.style.marginLeft = '';

                this.OS.taskbar.right.style.position = 'absolute';
                this.OS.taskbar.right.style.right = '0';
                setTimeout(() => {
                    this.OS.taskbar.right.style.position = '';
                    this.OS.taskbar.right.style.right = '';
                }, 300);
            }
        }

        from.style.position = '';
        from.style.left = '';

        if (to) {
            to.style.transition = 'none';
            to.style.marginLeft = '';
            to.scrollHeight; // Force reflow
            to.style.transition = '';
        }

        this.OS.state.reordering = {};
    }

    buildPanel() {
        return ui.div({
            class: 'panel',
            child: ui.div({
                class: 'indicator'
            })
        });
    }

    buildToolbarIcon() {
        return this.toolbarIcon = ui.div({
            class: 'app',
            children: [
                ui.div({
                    class: 'icon',
                    child: this.icon,
                }),
                this.panels = ui.div({
                    class: 'panels'
                })
            ],
            data: {
                name: this.stringified
            },
            events: {
                mouseenter: () => {
                    this.hovered = true;

                    for (const app of this.OS.taskbar.appTray.children) {
                        app.classList.remove('hover');
                    }
                    this.toolbarIcon.classList.add('hover');

                    if (this.OS.state.reordering.dragging) return;
                    if (this.sessions.length === 0) return;

                    this.OS.taskbar.contextMenu.style.display = '';
                    this.OS.taskbar.showPreviews(() => {
                        this.OS.taskbar.buildPreview(this);
                    });
                },
                mouseleave: () => {
                    this.hovered = false;
                    this.OS.taskbar.hidePreviews();
                },
                mousedown: e => {
                    if (e.button === 2) return;
                    if (!e.target.closest('.panels') && !e.target.closest('.icon')) return;

                    const from = e.currentTarget;
                    const to = from.nextElementSibling;
                    const { x } = from.getBoundingClientRect();
                    const startX = e.clientX;
                    const offsetX = startX - x;

                    from.style.position = 'absolute';
                    from.style.left = `${startX - offsetX - 58}px`;

                    if (to) {
                        to.style.transition = 'none';
                        to.style.marginLeft = '59px';
                        to.scrollHeight;
                        to.style.transition = '';
                    }

                    this.OS.state.reordering = { from, to, startX };

                    window.addEventListener('mousemove', this.OS.state.reordering.mousemove = this.mousemove.bind(this));

                    window.addEventListener('mouseup', this.mouseup.bind(this), { once: true })
                },
                contextmenu: e => {
                    e.preventDefault();

                    this.OS.taskbar.hidePreviews(0, false);

                    for (const app of this.OS.taskbar.appTray.children) {
                        app.classList.remove('hover');
                    }

                    this.OS.taskbar.showContextMenu(this);
                    this.toolbarIcon.classList.add('hover');

                    if (this.OS.taskbar.previews.style.display === 'flex') {
                        this.OS.taskbar.previews.style.display = '';
                    }
                }
            }
        })
    }
}

export default App;