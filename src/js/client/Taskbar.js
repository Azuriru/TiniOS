import ui from 'dorui';
import Icon from '../components/Icon';
import { desktopSessions, saveDesktopSessions, restoreDesktopSessions } from './Sessions';
import { fadeInBottom, fadeOutBottom, options } from '../components/util/animations';
import languages from '../../data/i18n/index.json';

class Taskbar {
    constructor(OS) {
        this.OS = OS;
        this.state = {
            scrollInterval: null,
            scrollTimeout: null,
            enterTimeout: null,
            leaveTimeout: null,
            mouseenter: null,
            mouseleave: null,
            previewsShown: false,
            previewsAnimation: null,
            contextMenuAnimation: null,
            contextMenuApp: null
        }
        this.OS.i18n.import(null, languages);
        this.contextMenu = this.buildContextMenu();
        this.previews = this.buildPreviews();
        this.element = this.buildTaskbar();
    }

    loadApps(apps, state) {
        for (const name of state) {
            const app = apps.find(app => app.stringified === name);

            if (!app) return;

            this.appTray.appendChild(app.buildToolbarIcon());
        }
    }

    showContextMenu(app, animate = true) {
        this.state.contextMenuApp = app;
        this.contextMenu.replaceWith(this.buildContextMenu(app));
        this.contextMenu.style.display = 'flex';

        if (animate) {
            this.contextMenu.animate(fadeInBottom, options);
        }
    }

    async hideContextMenu(animate) {
        if (animate) {
            const animation = this.contextMenu.animate(fadeOutBottom, options);

            await animation.finished;
        }

        this.state.contextMenuApp = null;
        this.contextMenu.style.display = '';
    }

    showPreviews(callback, delay = 500) {
        if (this.state.leaveTimeout) {
            clearTimeout(this.state.leaveTimeout);
            this.state.leaveTimeout = null;
        }

        if (this.state.previewsShown) {
            delay = 100;
        }

        if (this.state.previewsAnimation) {
            this.state.previewsAnimation.pause();
            delay = 0;
        }

        this.state.enterTimeout = setTimeout(async () => {
            if (callback) {
                callback();
            }

            this.previewsList.scrollTop = 0;
            this.previews.style.display = 'flex';

            if (!this.state.previewsShown) {
                const animation = this.state.previewsAnimation = this.previews.animate(fadeInBottom, options);

                await animation.finished;
                this.state.previewsAnimation = null;
                this.state.previewsShown = true;
            }

            this.state.previewsAnimation = null;
        }, delay);
    }

    hidePreviews(delay = 300, animate = true) {
        if (this.state.leaveTimeout) return;

        if (this.state.enterTimeout) {
            clearTimeout(this.state.enterTimeout);
            this.state.enterTimeout = null;
        }

        if (this.state.previewsAnimation) {
            this.state.previewsAnimation.pause();
        }

        this.state.leaveTimeout = setTimeout(async () => {
            this.state.previewsShown = false;

            if (animate) {
                const animation = this.state.previewsAnimation = this.previews.animate(fadeOutBottom, options);

                await animation.finished;
                this.state.previewsAnimation = null;
            }

            this.previews.style.display = '';
        }, delay);
    }

    buildPreviewsScrollUp() {
        return ui.div({
            classes: ['previews-control', 'previews-up', 'disabled'], // Starts at the top
            events: {
                mousedown: e => {
                    e.preventDefault();

                    if (e.currentTarget.classList.contains('disabled')) return;

                    if (this.state.scrollInterval) {
                        clearInterval(this.state.scrollInterval);
                        this.state.scrollInterval = null;
                    }

                    if (this.state.scrollTimeout) {
                        clearTimeout(this.state.scrollTimeout);
                        this.state.scrollTimeout = null;
                    }

                    this.previewsScrollDown.classList.remove('disabled');
                    this.previewsList.scrollTop -= 36;

                    this.state.scrollTimeout = setTimeout(() => {
                        this.state.scrollInterval = setInterval(() => {
                            this.previewsList.scrollTop -= 36;

                            if (!this.previewsList.scrollTop) {
                                this.previewsScrollUp.classList.add('disabled');
                                clearInterval(this.state.scrollInterval);
                                this.state.scrollInterval = null;
                            };
                        }, 250);
                    }, 250);

                    if (!this.previewsList.scrollTop) {
                        this.previewsScrollUp.classList.add('disabled');
                        clearInterval(this.state.scrollInterval);
                        clearTimeout(this.state.scrollTimeout);
                        this.state.scrollInterval = null;
                        this.state.scrollTimeout = null;
                    };
                },
                mouseenter: e => {
                    if (e.currentTarget.classList.contains('disabled')) return;

                    this.state.scrollInterval = setInterval(() => {
                        this.previewsScrollDown.classList.remove('disabled');
                        this.previewsList.scrollTop -= 36;

                        if (!this.previewsList.scrollTop) {
                            this.previewsScrollUp.classList.add('disabled');
                            clearInterval(this.state.scrollInterval);
                            this.state.scrollInterval = null;
                        };
                    }, 250);
                },
                mouseleave: () => {
                    if (this.state.scrollInterval) {
                        clearInterval(this.state.scrollInterval);
                        this.state.scrollInterval = null;
                    }
                }
            }
        });
    }

    buildPreviewsScrollDown() {
        return ui.div({
            classes: ['previews-control', 'previews-down'],
            events: {
                mousedown: e => {
                    e.preventDefault();

                    if (e.currentTarget.classList.contains('disabled')) return;

                    if (this.state.scrollInterval) {
                        clearInterval(this.state.scrollInterval);
                        this.state.scrollInterval = null;
                    }

                    if (this.state.scrollTimeout) {
                        clearTimeout(this.state.scrollTimeout);
                        this.state.scrollTimeout = null;
                    }

                    const { scrollHeight, clientHeight } = this.previewsList;

                    this.state.scrollTimeout = setTimeout(() => {
                        this.state.scrollInterval = setInterval(() => {
                            this.previewsList.scrollTop += 36;

                            const { scrollTop } = this.previewsList;
                            const scrollBottom = scrollHeight - (scrollTop + clientHeight);

                            if (!scrollBottom) {
                                this.previewsScrollDown.classList.add('disabled');
                                clearInterval(this.state.scrollInterval);
                                this.state.scrollInterval = null;
                            };
                        }, 250);
                    }, 250);

                    this.previewsScrollUp.classList.remove('disabled');
                    this.previewsList.scrollTop += 36;

                    const { scrollTop } = this.previewsList;
                    const scrollBottom = scrollHeight - (scrollTop + clientHeight);

                    if (!scrollBottom) {
                        this.previewsScrollDown.classList.add('disabled');
                        clearInterval(this.state.scrollInterval);
                        clearTimeout(this.state.scrollTimeout);
                        this.state.scrollInterval = null;
                        this.state.scrollTimeout = null;
                    };
                },
                mouseenter: e => {
                    if (e.currentTarget.classList.contains('disabled')) return;

                    const { scrollHeight, clientHeight } = this.previewsList;

                    this.state.scrollInterval = setInterval(() => {
                        this.previewsScrollUp.classList.remove('disabled');
                        this.previewsList.scrollTop += 36;

                        const { scrollTop } = this.previewsList;
                        const scrollBottom = scrollHeight - (scrollTop + clientHeight);

                        if (!scrollBottom) {
                            this.previewsScrollDown.classList.add('disabled');
                            clearInterval(this.state.scrollInterval);
                            this.state.scrollInterval = null;
                        };
                    }, 250);
                },
                mouseleave: () => {
                    if (this.state.scrollInterval) {
                        clearInterval(this.state.scrollInterval);
                        this.state.scrollInterval = null;
                    }
                }
            }
        });
    }

    buildPreviewsList() {
        return ui.div({
            class: 'previews-list',
        });
    }

    buildPreviews() {
        return ui.div({
            class: 'previews',
            children: [
                this.previewsScrollUp = this.buildPreviewsScrollUp(),
                this.previewsList = this.buildPreviewsList(),
                this.previewsScrollDown = this.buildPreviewsScrollDown()
            ]
        });
    }

    buildPreview(app) {
        this.previewsList.innerHTML = '';

        const length = app.sessions.length;
        const { x = 6, y = 18 } = this.OS.previewLimit;

        if (length > y) {
            this.previews.classList.add('minimized');
            this.previews.classList.add('scroll');

            const { innerHeight } = window;
            const limitY = Math.floor((innerHeight - 104) / 36);
            const freeSpace = innerHeight - 104 - 36 * limitY;

            this.previewsList.style.height = `${(freeSpace > 14 ? limitY : limitY - 1) * 36}px`;
            this.previewsScrollUp.classList.add('disabled');
            this.previewsScrollDown.classList.remove('disabled');
            app.minimizedPreviews = true;
        } else if (length > x) {
            this.previews.classList.add('minimized');
            this.previews.classList.remove('scroll');
            this.previewsList.style.height = '';
            app.minimizedPreviews = true;
        } else {
            this.previews.classList.remove('minimized');
            this.previews.classList.remove('scroll');
            this.previewsList.style.height = '';
            app.minimizedPreviews = false;
        }

        for (const session of app.sessions) {
            this.previewsList.appendChild(session.buildMiniPreview());
        }

        if (app.minimizedPreviews) {
            this.previews.style.left = `${app.toolbarIcon.offsetLeft - 9}px`; // 58 + 29 - 96 = -9
        } else {
            app.updatePreviews();
        }

        if (this.state.mouseenter) {
            this.previews.removeEventListener('mouseenter', this.state.mouseenter);
        }

        if (this.state.mouseleave) {
            this.previews.removeEventListener('mouseleave', this.state.mouseleave);
        }

        this.previews.addEventListener('mouseenter', this.state.mouseenter = () => {
            clearTimeout(this.state.leaveTimeout);
            this.state.leaveTimeout = null;
        });

        this.previews.addEventListener('mouseleave', this.state.mouseleave = () => {
            this.hidePreviews();
        });
    }

    buildContextMenuItem({ className, icon, text, click, hide }) {
        return ui.div({
            classes: ['context-item', className],
            children: [
                ui.div({
                    class: 'icon',
                    child: icon
                }),
                ui.span({
                    text
                })
            ],
            events: {
                click: () => {
                    if (click) {
                        click();
                    }

                    if (hide) {
                        this.hideContextMenu();
                    } else {
                        this.showContextMenu(this.state.contextMenuApp, false);
                    }
                }
            }
        });
    }

    buildContextMenu(app) {
        if (!app) {
            return ui.div({
                class: 'context'
            });
        }

        const { x, width } = app.toolbarIcon.getBoundingClientRect();

        return this.contextMenu = ui.div({
            class: 'context',
            style: {
                left: `${x - (100 - (width / 2))}px`
            },
            children: [
                ui.div({
                    class: 'tasks',
                    children: [
                        app.customContext.length > 1 && ui.div({
                            class: 'context-header',
                            text: 'Tasks'
                        }),
                        ...app.customContext.map(this.buildContextMenuItem.bind(this))
                    ]
                }),
                ui.div({
                    class: 'default',
                    children: [
                        this.buildContextMenuItem({
                            className: 'app-name',
                            icon: app.icon.cloneNode(true),
                            text: app.name,
                            click: () => {
                                app.newSession();
                            }
                        }),
                        this.buildContextMenuItem({
                            className: 'unpin',
                            icon: Icon('push_pin'),
                            text: app.isDocked ? 'Unpin from taskbar' : 'Pin to taskbar',
                            hide: app.sessions.length === 0,
                            click: () => {
                                if (app.isDocked) {
                                    app.unpin();
                                } else {
                                    app.pin();
                                }
                            },
                        }),
                        app.sessions.length > 0 && this.buildContextMenuItem({
                            className: 'close-window',
                            icon: Icon('close'),
                            text: app.sessions.length > 1 ? 'Close all windows' : 'Close window',
                            hide: !app.isDocked,
                            click: () => {
                                while (app.sessions.length > 0) {
                                    app.sessions[0].close();
                                }
                            }
                        })
                    ]
                })
            ],
            events: {
                mouseleave: async e => {
                    const me = e.currentTarget;
                    const anim = me.animate(fadeOutBottom, options);

                    for (const app of this.appTray.children) {
                        app.classList.remove('hover');
                    }

                    await anim.finished;

                    me.style.display = '';
                }
            }
        });
    }

    buildSearch() {
        return ui.div({
            class: 'search',
            child: Icon('search')
        });
    }

    buildAppTray() {
        return ui.div({
            class: 'app-tray'
        });
    }

    buildSecondaryControls() {
        return ui.div({
            class: 'secondary-controls'
        });
    }

    buildLanguageSwitch(shown) {
        const buildLanguageOption = language => {
            const isCurLang = language === this.OS.i18n.language;

            return ui.div({
                classes: {
                    'language-option': true,
                    'selected': isCurLang
                },
                children: [
                    ui.div({
                        class: 'iso-639-2',
                        text: languages[language]['iso']['639-2']
                    }),
                    ui.div({
                        class: 'details',
                        children: [
                            ui.div({
                                class: 'name',
                                text: this.OS.i18n.text(`${isCurLang ? 'native' : language}`)
                            }),
                            ui.div({
                                class: 'keyboard',
                                text: `${languages[language]['keyboard-type']} ${this.OS.i18n.text('keyboard')}`
                            })
                        ]
                    })
                ],
                events: {
                    click: () => {
                        this.OS.i18n.language = language;
                        this.languageSwitch.replaceWith(this.languageSwitch = this.buildLanguageSwitch(true));
                    }
                }
            });
        }

        return ui.div({
            class: 'lang-switch',
            children: [
                ui.div({
                    class: 'language-display',
                    text: this.OS.i18n.text('iso.639-2')
                }),
                ui.div({
                    classes: {
                        'language-options': true,
                        shown
                    },
                    children: Object.keys(languages).map(buildLanguageOption)
                })
            ],
            events: {
                click: e => {
                    if (e.target.closest('.language-display')) {
                        e.currentTarget.querySelector('.language-options').classList.toggle('shown');
                    }
                }
            }
        });
    }

    buildShowDesktop() {
        return ui.div({
            class: 'show-desktop',
            events: {
                mouseenter: () => {
                    this.peekTimeout = setTimeout(() => {
                        this.OS.windows.style.opacity = 'var(--peek-preview, 1)';
                    }, 800);
                },
                mouseleave: () => {
                    if (this.peekTimeout) clearTimeout(this.peekTimeout);
                    this.OS.windows.style.opacity = '';
                },
                click: () => {
                    if (desktopSessions.length) {
                        restoreDesktopSessions();
                    } else {
                        saveDesktopSessions();
                    }
                }
            }
        });
    }

    buildTaskbar() {
        return ui.div({
            class: 'taskbar',
            children: [
                this.OS.start.element,
                ui.div({
                    class: 'container',
                    children: [
                        this.left = ui.div({
                            class: 'left',
                            children: [
                                this.search = this.buildSearch(),
                                this.appTray = this.buildAppTray()
                            ]
                        }),
                        this.right = ui.div({
                            class: 'right',
                            children: [
                                this.secondaryControls = this.buildSecondaryControls(),
                                this.languageSwitch = this.buildLanguageSwitch(),
                                this.OS.clock.element,
                                this.showDesktop = this.buildShowDesktop()
                            ]
                        })
                    ]
                }),
                this.contextMenu,
                this.previews
            ]
        });
    }
}

export default Taskbar;