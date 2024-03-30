import ui from 'dorui';
import Icon from '../components/Icon';
import { bringToFront } from './Sessions';
import { fadeInBottom, fadeOutBottom, options } from '../components/util/animations';
import scopes from '../../data/i18n/start';

import '../../css/Start.css';

class Start {
    constructor(OS) {
        this.OS = OS;
        this.OS.i18n.import('start', scopes);
        this.isOpen = false;
        this.sidebar = this.buildSidebar();
        this.main = this.buildMain();
        this.element = this.buildStart();
    }

    loadApp(app) {
        this.allPrograms.appendChild(this.buildStartAppItem(app, 'all-programs'));
    }

    loadApps(apps, state) {
        for (const name of state) {
            const app = apps.find(app => app.stringified === name);

            if (!app) return;

            this.pinned.appendChild(this.buildStartAppItem(app, 'pinned'));
        }
    }

    show() {
        this.isOpen = true;
        this.content.classList.remove('hidden');
        this.icon.classList.add('active');
    }

    hide() {
        this.isOpen = false;
        this.content.classList.add('hidden');
        this.icon.classList.remove('active');
    }

    showContextMenu(e, contextMenuItems) {
        this.contextMenu.innerHTML = '';
        this.contextMenu.style.top = `${e.clientY}px`;
        this.contextMenu.style.left = `${e.clientX}px`;
        this.contextMenu.appendChild(
            ui.frag(
                contextMenuItems
                    .filter(Boolean)
                    .map(group => ui.div({
                        class: 'context-group',
                        children: group
                            .filter(Boolean)
                            .map(this.buildContextMenuItem.bind(this))
                    }))
            )
        );
        this.contextMenu.style.display = 'flex';
    }

    hideContextMenu() {
        this.contextMenu.style.display = '';
    }

    buildIcon() {
        return ui.div({
            class: 'start-icon',
            child: ui.div({
                class: 'buntini-icon'
            })
        });
    }

    buildSidebarIcon({ icon, text, click, events, ...rest }) {
        return ui.div({
            class: 'sidebar-item',
            children: [
                ui.div({
                    class: 'icon',
                    child: icon
                }),
                ui.div({
                    class: 'name',
                    text
                })

            ],
            events: {
                click,
                ...events
            },
            ...rest
        });
    };

    buildSidebar() {
        const i18n = path => this.OS.i18n.text(`start.sidebar.${path}`);
        const buildPowerOption = ({ icon, text, click }) => {
            return ui.div({
                class: 'power-option',
                children: [
                    Icon(icon, {
                        type: 'outlined'
                    }),
                    ui.div({
                        text
                    })
                ],
                events: {
                    click
                }
            });
        }

        return ui.div({
            class: 'sidebar-content',
            children: [
                this.buildSidebarIcon({
                    icon: Icon('menu'),
                    text: i18n('menu'),
                    click: e => {
                        e.currentTarget.parentElement.classList.toggle('active');
                    }
                }),
                this.buildSidebarIcon({
                    icon: Icon('account_circle', {
                        type: 'outlined'
                    }),
                    text: i18n('account')
                }),
                this.buildSidebarIcon({
                    icon: Icon('settings', {
                        type: 'outlined'
                    }),
                    text: i18n('settings'),
                    click: () => {
                        const settings = this.OS.apps.find(app => app.stringified === 'settings');

                        if (settings.sessions.length) {
                            settings.focus();
                            bringToFront(settings.latestSession);
                            settings.latestSession.minimize(false);
                        } else {
                            settings.launch();
                        }

                        this.hide();
                    }
                }),
                this.buildSidebarIcon({
                    icon: Icon('power_settings_new'),
                    text: i18n('power'),
                    child: this.powerOptions = ui.div({
                        class: 'power-options',
                        children: [
                            buildPowerOption({
                                icon: 'dark_mode',
                                text: i18n('power-context.sleep')
                            }),
                            buildPowerOption({
                                icon: 'power_settings_new',
                                text: i18n('power-context.shut-down')
                            }),
                            buildPowerOption({
                                icon: 'refresh',
                                text: i18n('power-context.restart')
                            })
                        ]
                    }),
                    click: async () => {
                        if (this.powerOptions.style.display === 'flex') {
                            await this.powerOptions.animate(fadeOutBottom, options).finished;
                            this.powerOptions.style.display = '';
                        } else {
                            this.powerOptions.style.display = 'flex';
                            this.powerOptions.animate(fadeInBottom, options);
                        }
                    },
                    events: {
                        mouseleave: async () => {
                            await this.powerOptions.animate(fadeOutBottom, options).finished;
                            this.powerOptions.style.display = '';
                        }
                    }
                })
            ],
            events: {
                mouseenter: e => {
                    e.currentTarget.classList.add('active');
                },
                mouseleave: e => {
                    e.currentTarget.classList.remove('active');
                }
            }
        });
    }

    buildDivider() {
        return ui.div({
            class: 'divider'
        });
    }

    buildMenu() {
        return ui.div({
            class: 'menu',
            children: [
                this.pinned = ui.div({
                    class: 'main-pinned'
                }),
                this.buildDivider(),
                this.recent = ui.div({
                    class: 'main-recent'
                })
            ]
        });
    }

    buildAllPrograms() {
        return ui.div({
            class: 'all-programs',
            style: {
                display: 'none'
            }
        });
    }

    buildStartItem({ icon, text, type, click, contextmenu: contextMenuItems, closeStart = false, ...rest }) {
        return ui.div({
            classes: ['start-item', type],
            children: [
                ui.div({
                    class: 'app-icon',
                    child: icon
                }),
                ui.div({
                    class: 'app-name',
                    text
                })
            ],
            events: {
                click: e => {
                    click && click(e);

                    if (closeStart) {
                        this.hide();
                    }
                },
                contextmenu: e => {
                    e.preventDefault();
                    this.showContextMenu(e, contextMenuItems);
                }
            },
            ...rest
        });
    }

    buildStartAppItem(app, type) {
        const typeIs = _type => type === _type;
        const startItem = this.buildStartItem({
            icon: app.icon.cloneNode(true),
            text: app.name,
            type,
            closeStart: true,
            click: app.launch.bind(app),
            contextmenu: [
                [
                    {
                        text: 'Open',
                        click: app.launch.bind(app)
                    },
                    !typeIs('recent') && {
                        text: 'Open file location'
                    }
                ],
                [
                    {
                        text: `${app.isDocked ? 'Unpin from taskbar' : 'Pin to Taskbar'}`,
                        showContext: true,
                        click: e => {
                            if (app.isDocked) {
                                app.unpin();
                                e.currentTarget.textContent = 'Pin to taskbar';
                            } else {
                                app.pin();
                                e.currentTarget.textContent = 'Unpin from taskbar';
                            }
                        }
                    },
                    {
                        text: `${app.isPinned ? 'Unpin from Start Menu' : 'Pin to Start Menu'}`,
                        showContext: true,
                        click: e => {
                            const me = e.currentTarget;
                            if (app.isPinned) {
                                app.pinned.remove();
                                app.pinned = null;
                                this.OS.state.unmount('start', app.stringified);
                                me.textContent = 'Pin to Start Menu';
                            } else {
                                if (app.recent) {
                                    app.recent.remove();
                                    app.recent = null;
                                }

                                this.pinned.appendChild(
                                    this.buildStartAppItem(app, 'pinned')
                                );
                                this.OS.state.mount('start', app.stringified);
                                me.textContent = 'Unpin from Start Menu';
                            }
                        }
                    }
                ],
                !typeIs('recent') && [
                    {
                        text: 'Rename',
                    }
                ],
                !typeIs('recent') && [
                    {
                        text: 'Properties'
                    }
                ],
                typeIs('recent') && [
                    {
                        text: 'Remove from this list',
                        click: () => {
                            app.recent.remove();
                            app.recent = null;
                        }
                    }
                ]
            ],
            data: {
                name: app.stringified
            },
        });

        switch(type) {
            case 'pinned':
                app.pinned = startItem;
                break;
            case 'recent':
                app.recent = startItem;
                break;
        }

        return startItem;
    }

    buildAllProgramsButton() {
        const i18n = scope => this.OS.i18n.text(`start.main.${scope}`);
        return this.buildStartItem({
            icon: Icon('arrow_forward'),
            type: 'all-programs-button',
            text: i18n('programs'),
            click: e => {
                const me = e.currentTarget;
                if (me.classList.contains('back')) {
                    me.classList.remove('back');
                    me.querySelector('.app-name').textContent = i18n('programs');
                    this.allPrograms.style.display = 'none';
                    this.menu.style.display = '';
                } else {
                    me.classList.add('back');
                    me.querySelector('.app-name').textContent = i18n('back');
                    this.allPrograms.style.display = '';
                    this.menu.style.display = 'none';
                }
            }
        });
    }

    buildMain() {
        return ui.div({
            class: 'main-content',
            children: [
                this.menu = this.buildMenu(),
                this.allPrograms = this.buildAllPrograms(),
                this.buildDivider(),
                this.allProgramsButton = this.buildAllProgramsButton()
            ]
        });
    }

    buildContextMenuItem({ className, text, click, showContext }) {
        return ui.div({
            classes: ['context-item', className],
            text,
            events: {
                click: e => {
                    click && click(e);

                    if (!showContext) {
                        this.hideContextMenu();
                    }
                }
            }
        });
    }

    buildContextMenu() {
        return ui.div({
            class: 'context'
        });
    }

    buildContent() {
        return ui.div({
            classes: ['start-content', 'hidden'],
            children: [
                ui.div({
                    class: 'sidebar',
                    child: this.sidebar
                }),
                ui.div({
                    class: 'main',
                    children: [
                        this.main,
                        this.buildDivider(),
                        ui.div({
                            class: 'start-search',
                            children: [
                                ui.div({
                                    class: 'search-icon',
                                    child: Icon('search'),
                                }),
                                ui.input({
                                    class: 'search-input',
                                    placeholder: this.OS.i18n.text('start.main.search-placeholder')
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }

    buildStart() {
        return ui.div({
            class: 'start',
            children: [
                this.icon = this.buildIcon(),
                this.content = this.buildContent(),
                this.contextMenu = this.buildContextMenu()
            ],
            events: {
                click: e => {
                    const startIcon = e.target.closest('.start-icon');
                    if (!startIcon) return;

                    if (this.isOpen) {
                        this.hide();
                    } else {
                        this.show();
                    }
                }
            }
        })
    }
}

export default Start;