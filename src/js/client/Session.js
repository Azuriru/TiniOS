import ui from 'dorui';
import { bringToFront, getSessionIndex, getLatestSession, clearDesktopSessions } from './Sessions';

import '../../css/Session.css';

class Session {
    constructor(app, {
        width = 500,
        height = 200,
        minWidth = 300,
        minHeight = 200,
        state = 'windowed',
        customTitlebar = false
    } = {}) {
        this.app = app;
        this.settings = {
            width,
            height,
            minWidth,
            minHeight,
            state,
            customTitlebar
        }
        this.sessionIndex = getSessionIndex(this.app.stringified, this.settings);
        this.instance = new this.app.instance(this);
        this.window = this.buildWindow();
    }

    close() {
        this.window.classList.add('hidden');

        if (!this.app.OS.taskbar.state.previewsShown) {
            if (this.preview) {
                this.preview.remove();
            }

            this.app.closeSession(this);
        } else {
            // last one use previous
            const { previousElementSibling, nextElementSibling } = this.preview;
            const { firstElementChild, lastElementChild } = this.app.OS.taskbar.previewsList;
            const isLast = lastElementChild === this.preview;
            const isFirst = firstElementChild === this.preview;
            const width = this.preview.clientWidth;
            // height is always 36
            let reset;

            this.preview.remove();
            this.app.closeSession(this);

            if (this.app.minimizedPreviews) {
                if (!isFirst && isLast) {
                    previousElementSibling.style.transition = 'none';
                    previousElementSibling.style.paddingBottom = '39px';
                    reset = previousElementSibling;
                } else if (nextElementSibling) {
                    nextElementSibling.style.transition = 'none';
                    nextElementSibling.style.paddingTop = '39px';
                    reset = nextElementSibling;
                }

                if (reset) {
                    reset.scrollHeight;
                    reset.style.transition = '';
                    reset.style.paddingTop = '';
                    reset.style.paddingBottom = '';
                }
            } else {
                this.app.updatePreviews();

                if (!isFirst && isLast) {
                    previousElementSibling.style.transition = 'none';
                    previousElementSibling.style.paddingRight = `${width + 6}px`;
                    reset = previousElementSibling;
                } else if (nextElementSibling) {
                    nextElementSibling.style.transition = 'none';
                    nextElementSibling.style.paddingLeft = `${width + 6}px`;
                    reset = nextElementSibling;
                }

                const { x, right } = this.app.OS.taskbar.previews.getBoundingClientRect();

                if (x < 0) {
                    const { firstElementChild } = this.app.OS.taskbar.previewsList;

                    firstElementChild.style.transition = 'none';
                    firstElementChild.style.marginLeft = `${Math.abs(x) * 2}px`;
                    firstElementChild.scrollHeight;
                    firstElementChild.style.transition = '';
                    firstElementChild.style.marginLeft = '';
                }

                if (right > window.innerWidth) {
                    const { lastElementChild } = this.app.OS.taskbar.previewsList;
                    const offset = right - window.innerWidth;

                    lastElementChild.style.transition = 'none';
                    lastElementChild.style.marginRight = `${Math.abs(offset) * 2}px`;
                    lastElementChild.scrollHeight;
                    lastElementChild.style.transition = '';
                    lastElementChild.style.marginRight = '';
                }

                if (reset) {
                    reset.style.transition = '';
                    reset.style.paddingLeft = '';
                    reset.style.paddingRight = '';
                }
            }
        }

        setTimeout(() => {
            this.window.remove();

            if (this.app.sessions.length === 0) {
                this.app.unlaunch();
            }
        }, 300);
    }

    getPreviewScale(width, height) {
        const ratio = width / height;

        if (ratio > 1.8) {
            return this.previewScale = 180 / width;
        } else {
            return this.previewScale = 100 / height;
        }
    }

    updatePreview(customScale, update = true) {
        const { outerHTML } = this.window; // lmao I swear I love destructuring too much
        const { transform } = this.previewWindow.firstChild.style;
        const { width, height } = this.window.getBoundingClientRect();
        const scale = customScale || this.getPreviewScale(width, height);

        if (update) {
            this.previewInfo.style.width = `${width * scale}px`;
            this.previewWindow.style.width = `${width * scale}px`;
            this.previewWindow.style.height = `${height * scale}px`;
            this.previewWindow.firstChild.outerHTML = outerHTML;

            const { firstChild } = this.previewWindow;

            if (this.isMaximized) {
                firstChild.style.setProperty('width', `${width}px`, 'important');
                firstChild.style.setProperty('height', `${height}px`, 'important');
                firstChild.style.setProperty('transform', transform, 'important');
                firstChild.scrollHeight;
                firstChild.style.setProperty('transform', `scale(${scale})`, 'important');
            } else {
                firstChild.style.transform = transform;
                firstChild.scrollHeight;
                firstChild.style.transform = `scale(${scale})`;
            }
        }

        return width * scale + 12;
    }

    setState(state) {
        this.window.classList.remove(this.settings.state);
        this.window.classList.add(state);
        this.settings.state = state;
        this.app.windowSettings.state = state;
    }

    minimize(toggle = true, clearList = true) {
        this.isMinimized = toggle;

        if (toggle) {
            // if (peek) {
            //     const { top, left, transform, transformOrigin } = this.peekState;

            //     this.window.style.transition = 'none';
            //     this.window.style.top = top;
            //     this.window.style.left = left;
            //     this.window.style.transform = transform;
            //     this.window.style.transformOrigin = transformOrigin;
            //     this.window.scrollheight;
            //     this.window.style.transition = '';
            //     this.peekState = null;
            //     console.log('peek');
            // } else if (clearList) {
            //     const { x: iconX, y: iconY } = this.app.toolbarIcon.getBoundingClientRect();
            //     const { x, y, width, height } = this.window.getBoundingClientRect();
            //     const top = iconY - height;
            //     const left = iconX + 29 - width / 2;

            //     this.transformState = { x, y, transform: this.window.style.transform };

            //     this.window.style.transition = 'none';
            //     this.window.style.top = `${x}px`;
            //     this.window.style.left = `${y}px`;
            //     this.window.style.transform = '';
            //     this.window.style.transformOrigin = 'center bottom';
            //     this.window.scrollHeight;
            //     this.window.style.transition = '';
            //     this.window.style.transform = 'scale(0)';
            //     this.window.style.top = `${top}px`;
            //     this.window.style.left = `${left}px`;
            //     console.log('clear list');
            // } else {
                this.window.classList.add('minimized');
            //     console.log('minimize');
            // }

            const latestSession = getLatestSession(this);

            if (latestSession) {
                bringToFront(latestSession);

                if (latestSession.app !== this.app) {
                    latestSession.app.focus();
                }
            }
        } else {
            // if (peek) {
            //     const { top, left, transform, transformOrigin } = this.window.style;

            //     this.window.style.transition = 'none';
            //     this.window.style.top = '';
            //     this.window.style.left = '';
            //     this.window.style.transform = this.transformState.transform;
            //     this.window.style.transformOrigin = '';
            //     this.window.scrollHeight;
            //     this.window.style.transition = '';
            //     this.peekState = { top, left, transform, transformOrigin };

            //     console.log('peek false');
            // } else if (clearList) {
            //     const { x, y, transform } = this.transformState;

            //     this.window.style.top = `${y}px`;
            //     this.window.style.left = `${x}px`;
            //     this.window.style.transform = '';

            //     setTimeout(() => {
            //         this.window.style.top = '';
            //         this.window.style.left = '';
            //         this.window.style.transformOrigin = '';
            //         this.window.style.transform = `${transform}`;
            //         this.transformState = null;
            //     }, 300);

            //     console.log('clear list false');
            // } else {
                this.window.classList.remove('minimized');

            //     console.log('minimizefalse');
            // }
        }

        if (clearList) {
            clearDesktopSessions();
        }

        if (this.app.allMinimized) {
            this.app.toolbarIcon.classList.remove('active');
        }
    }

    maximize() {
        this.setState('maximized');
    }

    windowed() {
        this.setState('windowed');
    }

    get isMaximized() {
        return this.settings.state === 'maximized';
    }

    set title(title) {
        this.previewTitle.textContent = `${title} - ${this.app.name}`;

        if (!this.settings.customTitlebar) {
            this.windowTitle.textContent = title;
        }
    }

    buildMiniPreview() {
        const { width, height } = this.window.isConnected ? this.window.getBoundingClientRect() : this.settings;
        const { innerWidth, innerHeight } = window;
        const scale = this.isMaximized ? this.getPreviewScale(innerWidth, innerHeight - 44) : this.getPreviewScale(width, height);
        const win = this.window.cloneNode(true);
        const previewWidth = (this.isMaximized ? innerWidth : width) * scale;
        const previewHeight = (this.isMaximized ? innerHeight - 44 : height) * scale;

        if (this.isMaximized) {
            win.style.setProperty('width', `${innerWidth}px`, 'important');
            win.style.setProperty('height', `${innerHeight - 44}px`, 'important');
            win.style.setProperty('transform', `scale(${scale})`, 'important');
        } else {
            win.style.transform = `scale(${scale})`;
        }

        return this.preview = ui.div({
            class: 'mini-preview',
            children: [
                this.previewInfo = ui.div({
                    class: 'app-info',
                    children: [
                        ui.div({
                            class: 'icon',
                            child: this.app.icon.cloneNode(true)
                        }),
                        this.previewTitle = ui.div({
                            class: 'title',
                            text: `${this.instance.currentTitle} - ${this.app.name}`
                        }),
                        ui.div({
                            class: 'close',
                            events: {
                                click:  () => {
                                    this.close();
                                }
                            }
                        }),
                    ],
                    style: {
                        width: `${previewWidth}px`
                    }
                }),
                this.previewWindow = ui.div({
                    class: 'app-preview',
                    child: win,
                    style: {
                        width: `${previewWidth}px`,
                        height: `${previewHeight}px`
                    }
                })
            ],
            events: {
                click: e => {
                    if (e.target.closest('.close')) return;

                    this.showTemp = false;
                    this.minimize(false, true);

                    bringToFront(this);
                    this.app.latestSession = this;
                    this.app.focus();

                    this.app.OS.taskbar.hidePreviews(0);
                },
                auxclick: e => {
                    if (e.button === 1) {
                        this.close();
                    }
                },
                mouseenter: () => {
                    if (this.isMinimized && !this.app.minimizedPreviews) {
                        this.minimize(false, false);
                        this.showTemp = true;
                    }
                },
                mouseleave: () => {
                    if (this.showTemp) {
                        this.minimize(true, false);
                    }
                }
            }
        });
    }

    buildButton({ icon, fn }) {
        return ui.div({
            classes: ['window-button', icon],
            child: ui.div({
                class: 'icon'
            }),
            events: {
                click: fn
            }
        });
    }

    buildWindowTitle() {
        return this.windowTitle = ui.div({
            class: 'title',
            text: this.instance.currentTitle,
            style: this.app.options.color && {
                color: this.app.options.color
            }
        });
    }

    buildWindowButtons() {
        const minimize = this.buildButton({
            icon: 'minimize',
            fn: () => {
                this.minimize();
            }
        })

        const maximize = this.buildButton({
            icon: 'maximize',
            fn: () => {
                if (this.isMaximized) {
                    this.windowed();
                } else {
                    this.maximize();
                }
            }
        })

        const close = this.buildButton({
            icon: 'close',
            fn: () => {
                this.close();
            }
        });

        return ui.div({
            class: 'window-buttons',
            children: [
                minimize,
                maximize,
                close
            ]
        });
    }

    buildTitlebar() {
        return this.titlebar = ui.div({
            classes: {
                'titlebar': true,
                'custom': this.settings.customTitlebar
            },
            children: [
                this.settings.customTitlebar
                    ? this.instance.buildCustomTitlebar()
                    : this.buildWindowTitle(),
                this.buildWindowButtons()
            ],
            events: {
                mousedown: e => {
                    if (e.target.closest('.window-button')) return;
                    if (e.button !== 0) return;

                    const { clientX, clientY } = e;

                    window.addEventListener('mousemove', this.mousemove = e => {
                        e.preventDefault();

                        if (e.clientX !== clientX || e.clientY !== clientY) {
                            window.removeEventListener('mousemove', this.mousemove);
                            this.mousemove = null;

                            this.window.style.transition = 'none';

                            let { x, y } = this.window.getBoundingClientRect();
                            let offsetX = e.clientX - x;
                            let offsetY = e.clientY - y;
                            let mousemove;

                            if (this.isMaximized) {
                                this.window.style.transform = 'translate(0px, 0px)';
                                this.windowed();
                                const { width, x, y } = this.window.getBoundingClientRect();
                                const { innerWidth } = window;
                                const min = width / 2;

                                if (e.clientX < min) {
                                    offsetX = e.clientX - x;
                                } else if (innerWidth - e.clientX < min) {
                                    this.window.style.transform = `translate(${innerWidth - width}px, 0px)`;
                                    offsetX = e.clientX - this.window.getBoundingClientRect().x;
                                } else {
                                    offsetX = width / 2;
                                }

                                offsetY = e.clientY - y;

                                this.window.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
                            }

                            window.addEventListener('mousemove', mousemove = e => {
                                e.preventDefault();

                                this.window.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
                            });

                            window.addEventListener('mouseup', () => {
                                window.removeEventListener('mousemove', mousemove);

                                this.window.style.transition = '';
                            }, { once: true });
                        }
                    });
                },
                mouseup: () => {
                    if (this.mousemove) {
                        window.removeEventListener('mousemove', this.mousemove);
                        this.mousemove = null;
                    }
                },
                auxclick: e => {
                    if (e.button === 1) {
                        this.close();
                    }
                },
                dblclick: () => {
                    if (this.isMaximized) {
                        this.windowed();
                    } else {
                        this.maximize();
                    }
                }
            }
        });
    }

    buildResizeHandles() {
        const handle = dir => ui.div({
            classes: ['handle', dir],
            events: {
                mousedown: e => {
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

                        const direction = d => dir.includes(d);

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

                    window.addEventListener('mouseup', () => {
                        window.removeEventListener('mousemove', mousemove);

                        this.window.style.transition = '';
                        this.app.windowSettings.width = parseInt(this.window.style.width);
                        this.app.windowSettings.height = parseInt(this.window.style.height);
                    }, { once: true });
                }
            }
        });

        return this.resizeHandles = ui.div({
            class: 'resize-handles',
            children: [
                handle('n'),
                handle('ne'),
                handle('e'),
                handle('se'),
                handle('s'),
                handle('sw'),
                handle('w'),
                handle('nw')
            ]
        });
    }

    buildWindow() {
        const { width: w, height: h, minWidth, minHeight, state } = this.settings;
        const { innerWidth: maxWidth, innerHeight: maxHeight } = window;
        const width = w > maxWidth ? maxWidth : w;
        const height = h > maxHeight ? maxHeight - 44 : h;
        const [ index, multiplier ] = this.sessionIndex;

        return ui.div({
            classes: ['window', state, `window-${this.app.stringified}`],
            children: [
                this.buildTitlebar(),
                ui.div({
                    class: 'app',
                    child: this.instance.buildUI()
                }),
                this.buildResizeHandles()
            ],
            style: {
                transform: `translate(${index * 24 + multiplier * 48 + 12}px, ${index * 28 + 6}px)`,
                width: `${width}px`,
                height: `${height}px`,
                minWidth: `${minWidth}px`,
                minHeight: `${minHeight}px`
            },
            events: {
                ...this.instance.windowEvents,
                mousedown: () => {
                    bringToFront(this);
                    this.app.latestSession = this;
                    this.app.focus();
                }
            }
        });
    }
}

export default Session;