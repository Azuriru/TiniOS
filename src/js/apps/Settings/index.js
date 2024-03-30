import ui from 'dorui';
import App from '../../client/App';
import Clock from '../../components/Clock';
import Icon from '../../components/Icon';
import Instance from '../../client/Instance';
import { Button, Checkbox, Dropdown, Grid, Radio, Range, Toggle } from '../../components/Inputs';
import i18n from '../../client/i18n';
import scopes from './i18n.json';
import inputscopes from './inputs.json';
import Categories from './categories';

import './index.css';

class SettingsInstance extends Instance {
    constructor(session) {
        super(session, 'Settings');

        this.i18n = this.session.app.i18n;
        this.history = [];
        this.state = {};
    }

    get windowEvents() {
        return {
            click: e => {
                if (e.target.closest('.dropdown')) return;

                for (const dropdown of document.body.querySelectorAll('.dropdown.open')) {
                    dropdown.classList.remove('open');
                }
            }
        }
    }

    updateState({ category: cat, option: opt } = {}) {
        if (cat) {
            this.state.category = cat;
        }

        if (opt) {
            this.state.option = opt;
        }

        const { category, option } = this.state;

        if (category && option) {
            if (this.history.length > 0) {
                const last = this.history[this.history.length - 1];

                if (last.category === category && last.option === option) return;
            }

            this.history.push({
                category,
                option
            });
        }
    }

    buildAppListItem(app, startup) {
        const { state } = this.session.app.OS;
        const checked = state.getStartup(app.stringified);
        const toggle = key => state.toggleStartup(key);

        return ui.div({
            class: 'app-item',
            data: {
                name: app.name,
                author: app.info.author,
                size: app.size,
                date: app.installDate
            },
            children: [
                ui.div({
                    class: 'app-info',
                    children: [
                        ui.div({
                            class: 'app-icon',
                            child: app.icon.cloneNode(true)
                        }),
                        ui.div({
                            class: 'primary',
                            children: [
                                ui.div({
                                    class: 'app-name',
                                    text: app.name
                                }),
                                ui.div({
                                    class: 'app-author',
                                    text: app.info.author
                                })
                            ]
                        }),
                        !startup && ui.div({
                            class: 'secondary',
                            children: [
                                ui.div({
                                    class: 'app-size',
                                    text: app.size
                                }),
                                ui.div({
                                    class: 'app-date',
                                    text: app.installDate
                                })
                            ]
                        }),
                        startup && ui.div({
                            class: 'startup-option',
                            child: Toggle(this.i18n.text('toggle'), app.stringified, checked, toggle)
                        })
                    ]
                }),
                !startup && ui.div({
                    class: 'app-actions',
                    child: Button({
                        text: this.i18n.text('button.uninstall'),
                        key: 'uninstall'
                    })
                })
            ],
            events: {
                click: e => {
                    if (startup) return;
                    const app = e.currentTarget;

                    for (const appItem of app.parentElement.children) {
                        appItem.classList.remove('open');
                    }
                    app.classList.toggle('open');
                }
            }
        });
    }

    buildAppList(key, currentIndex, set) {
        return ui.div({
            class: 'app-list-wrapper',
            children: [
                ui.div({
                    class: 'search-apps',
                    children: [
                        ui.input({
                            class: 'search-input',
                            placeholder: 'Search this list',
                            events: {
                                input: e => {
                                    const value = e.target.value.toUpperCase();

                                    for (const app of e.currentTarget.closest('.app-list-wrapper').children[2].children) {
                                        const { name, author, size, date } = app.dataset;
                                        const values = [ name, author, size, date ].join(' ').toUpperCase();

                                        if (values.includes(value)) {
                                            app.style.display = '';
                                        } else {
                                            app.style.display = 'none';
                                        }
                                    }
                                }
                            }
                        }),
                        Icon('search', {
                            className: 'search-icon'
                        })
                    ]
                }),
                ui.div({
                    class: 'filter-by',
                    children: [
                        Dropdown(this.i18n.text('dropdown.apps-sort-by'), key, 1, currentIndex, set, true)
                    ]
                }),
                ui.div({
                    class: 'app-list',
                    children: this.session.app.OS.apps
                        .sort((appA, appB) => {
                            switch(currentIndex) {
                                case 0:
                                    return appA.name.localeCompare(appB.name);
                                case 1:
                                    return appA.info.author.localeCompare(appB.info.author);
                                case 2:
                                    return appA.size.localeCompare(appB.size);
                                case 3:
                                    const date = date => date.split('/').reverse().join('/');
                                    return date(appA.installDate).localeCompare(date(appB.installDate));
                            }
                        })
                        .map(app => this.buildAppListItem(app, key.includes('startup')))
                })
            ]
        });
    }

    buildCustomTitlebar() {
        return ui.div({
            class: 'settings-titlebar',
            children: [
                this.buildBack(),
                this.titlebar = ui.div({
                    class: 'title',
                    text: this.currentTitle
                })
            ]
        });
    }

    buildSearch() {
        return ui.div({
            class: 'settings-search',
            children: [
                ui.input({
                    class: 'input',
                    placeholder: this.i18n.text('find-setting')
                }),
                Icon('search', {
                    className: 'search-icon'
                })
            ]
        });
    }

    buildBack() {
        if (this.history.length < 2) {
            return this.back = ui.div({
                class: 'back'
            });
        }

        return this.back = Icon('arrow_back', {
            className: 'back',
            events: {
                click: () => {
                    const { category, option } = this.history.splice([this.history.length - 2], 1)[0];

                    const { name, options } = Categories.find(cat => cat.name === category);
                    const main = options.find(opt => opt.title === option);
                    this.interface.replaceWith(
                        this.buildPanel({
                            name,
                            options,
                            main
                        })
                    );
                }
            }
        });
    }

    buildContent({ type, args = {} } = {}) {
        const i18n = (type, key) => this.i18n.text(`${type}${key ? `.${key}` : ''}`);
        const { key, defaultIndex } = args;
        const { settings } = this.session.app.OS;
        const toggle = settings.toggle.bind(settings);
        const get = settings.get.bind(settings);
        const set = settings.set.bind(settings);

        switch(type) {
            case 'button':
                return Button({ text: i18n('button', key), key });
            case 'checkbox':
                return Checkbox(i18n('checkbox', key), key, get(key), toggle);
            case 'dropdown':
                return Dropdown(i18n('dropdown', key), key, defaultIndex, get(key), set);
            case 'grid':
                return Grid(key, defaultIndex, get(key), args.options, set);
            case 'radio':
                return Radio(i18n('radio', key), key, defaultIndex, get(key), set);
            case 'range':
                return Range(args, set);
            case 'toggle':
                return Toggle(i18n('toggle'), key, get(key), toggle);
            case 'clock':
                return new Clock('flat').start().element;
            default:
                return this.buildAppList(key, get(key), set);
        }
    }

    buildGroup(name, { info, content }) {
        return ui.div({
            class: 'settings-group',
            children: [
                info && ui.div({
                    class: 'group-info',
                    text: this.i18n.text(`${name}.options.${info}`)
                }),
                content && ui.div({
                    class: 'group-content',
                    children: content instanceof Array
                        ? content.map(this.buildContent.bind(this))
                        : [ this.buildContent(content) ]
                })
            ]
        });
    }

    buildSection(name, { header, groups }) {
        return ui.div({
            class: 'settings-section',
            children: [
                header && ui.div({
                    class: 'settings-header',
                    text: this.i18n.text(`${name}.options.${header}`)
                }),
                ui.div({
                    class: 'settings-groups',
                    children: groups.map(group => {
                        return this.buildGroup(name, group);
                    })
                })
            ]
        });
    }

    buildMain(name, { title, sections }) {
        return this.main = ui.div({
            classes: ['settings-main', title],
            children: [
                ui.div({
                    class: 'settings-header',
                    text: this.i18n.text(`${name}.options.${title}`)
                }),
                ui.div({
                    class: 'settings-sections',
                    children: sections.map(section => {
                        return this.buildSection(name, section);
                    })
                })
            ]
        });
    }

    buildSidebarOption(name, { title, icon, sections }, i, selectedIndex) {
        return ui.div({
            classes: {
                'sidebar-option': true,
                'selected': selectedIndex === -1 && i === 0 || i === selectedIndex
            },
            children: [
                typeof icon === 'string'
                    ? Icon(icon, {
                        type: 'outlined',
                        className: `option-icon ${title.toLowerCase()}`
                    })
                    : ui.div({
                        classes: ['option-icon', title.toLowerCase()]
                    }),
                ui.div({
                    class: 'option-title',
                    text: this.i18n.text(`${name}.options.${title}`)
                })
            ],
            events: {
                click: e => {
                    this.updateState({ option: title });
                    this.back.replaceWith(this.buildBack());

                    for (const option of this.sidebarOptions) {
                        option.classList.remove('selected');
                    }
                    e.currentTarget.classList.add('selected');

                    this.main.replaceWith(
                        this.buildMain(name, { title, sections })
                    );
                }
            }
        })
    }

    buildSidebar(name, options, selectedIndex) {
        return ui.div({
            class: 'settings-sidebar',
            children: [
                ui.div({
                    class: 'sidebar-home',
                    children: [
                        Icon('home', {
                            className: 'home',
                            type: 'outlined'
                        }),
                        ui.div({
                            text: this.i18n.text('home')
                        })
                    ],
                    events: {
                        click: e => {
                            e.currentTarget.closest('.window-settings').classList.remove('panel-view');

                            this.state = {};
                            this.main = null;
                            this.sidebarOptions = null;
                            this.interface.replaceWith(
                                this.buildUI()
                            );
                        }
                    }
                }),
                this.buildSearch(),
                ui.div({
                    class: 'sidebar-header',
                    text: this.i18n.text(`${name}.header`)
                }),
                ...this.sidebarOptions = options.map((o, i) => this.buildSidebarOption(name, o, i, selectedIndex))
            ]
        });
    }

    buildPanel({ name, options, main }) {
        this.back.replaceWith(this.buildBack());

        return this.interface = ui.div({
            classes: ['settings-panel', name],
            children: [
                this.buildSidebar(name, options, options.indexOf(main)),
                this.buildMain(name, main || options[0])
            ]
        });
    }

    buildCategory({ name, icon, options }) {
        return ui.div({
            classes: ['settings-category', name ],
            children: [
                ui.div({
                    class: 'category-icon',
                    child: typeof icon === 'string'
                        ? Icon(icon)
                        : ui.frag(icon.map(Icon))
                }),
                ui.div({
                    class: 'category-info',
                    children: [
                        ui.div({
                            class: 'category-header',
                            text: this.i18n.text(`${name}.header`)
                        }),
                        ui.div({
                            class: 'category-desc',
                            text: this.i18n.text(`${name}.desc`)
                        })
                    ]
                })
            ],
            events: {
                click: e => {
                    e.currentTarget.closest('.window-settings').classList.add('panel-view');

                    this.updateState({
                        category: name,
                        option: options[0].title
                    });

                    this.interface.replaceWith(
                        this.buildPanel({
                            name,
                            options
                        })
                    );
                }
            }
        });
    }

    buildUI() {
        return this.interface = ui.div({
            class: 'settings-menu',
            children: [
                ui.div({
                    class: 'settings-menu-header',
                    text: 'Tini Settings'
                }),
                this.buildSearch(),
                ui.div({
                    class: 'settings-categories',
                    children: Categories.map(this.buildCategory.bind(this))
                })
            ]
        });
    }
}

class Settings extends App {
    constructor(OS) {
        super(OS, {
            name: 'Settings',
            icon: Icon('settings', {
                type: 'outlined'
            }),
            options: {
                pinned: true,
                docked: true
            },
            windowSettings: {
                width: 680,
                height: 500,
                customTitlebar: true
            },
            instance: SettingsInstance
        });
        this.i18n = new i18n(scopes, 'en');
        this.i18n.import(null, inputscopes);
    }
}

export default Settings;