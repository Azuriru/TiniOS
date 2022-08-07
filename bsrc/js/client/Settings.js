import { Database } from './Database';
import { mixColors } from '../components/util';
import { color } from '../components/util/normalize';
import placeholder from '../../data/settings.json';
import languages from '../../data/i18n/index.json';

class Settings {
    constructor(OS) {
        window.settings = this;
        this.OS = OS;
        this.database = new Database('settings', placeholder);
        // this.init();
    }

    init() {
        for (const key in this.database.data) {
            const val = this.get(key);
            if (typeof val === 'boolean') {
                this.toggle(key, true);
            } else {
                this.set(key, val, true);
            }
        }
    }

    toRGB([h, s, l]) {
		h /= 360; s /= 100; l /= 100;

        let r;
        let g;
        let b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
    }

    toHSL([r, g, b]) {
		r /= 255; g /= 255; b /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let d = max - min;

        let h;
        if (d === 0) {
            h = 0;
        } else if (max === r) {
            h = (g - b) / d % 6;
        } else if (max === g) {
            h = (b - r) / d + 2;
        } else if (max === b) {
            h = (r - g) / d + 4;
        }

        let l = (min + max) / 2;
        let s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

		return [ Math.round(h * 60), Math.round(s * 100), Math.round(l * 100) ];
	}

    setCSS(key, val = '') {
        document.documentElement.style.setProperty(`--${key}`, val);
    }

    toggleCSS(key, prop, { val = '', fallback = '' }) {
        document.documentElement.style.setProperty(`--${prop}`, this.get(key) ? val : fallback);
    }

    ifSet(key, enable, disable) {
        if (this.get(key)) {
            typeof enable === 'function' && enable();
        } else {
            typeof disable === 'function' && disable();
        }
    }

    get(key) {
        return this.database.get(key);
    }

    set(key, val, init) {
        if (!init) {
            this.database.set(key, val);
        };

        switch (key) {
            // System
            case 'brightness':
                this.setCSS(key, `${val / 100 * 150}%`);
                break;
            case 'contrast':
                this.setCSS(key, `${val + 50}%`);
                break;
            case 'saturate':
                this.setCSS(key, `${val / 100 * 150}%`);
                break;
            // Personalization
            case 'background-fit':
                switch (val) {
                    case 0: // Fill
                        this.setCSS('background-size', 'cover');
                        this.setCSS('background-position-x', ['left', 'right', 'center'][this.get('background-position-x')]);
                        this.setCSS('background-position-y', ['top', 'bottom', 'center'][this.get('background-position-y')]);
                        break;
                    case 1: // Fit
                        this.setCSS('background-size', 'contain');
                        this.setCSS('background-repeat', 'no-repeat');
                        this.setCSS('background-position-x', 'center');
                        this.setCSS('background-position-y', 'center');
                        break;
                    case 2: // Stretch
                        this.setCSS('background-size', '100% 100%');
                        break;
                    case 3: // Tile
                        this.setCSS('background-repeat', 'repeat');
                        this.setCSS('background-size', '200px');
                        break;
                    case 4: // Center
                        this.setCSS('background-size', 'auto');
                        this.setCSS('background-repeat', 'no-repeat');
                        this.setCSS('background-position-x', 'center');
                        this.setCSS('background-position-y', 'center');
                        break;
                }
                break;
            case 'background-position-x':
                this.setCSS(key, ['left', 'right', 'center'][val]);
                break;
            case 'background-position-y':
                this.setCSS(key, ['top', 'bottom', 'center'][val]);
                break;
            case 'color':
                if (val === 'rgb(0, 127, 128)') break; // isDefault

                const rgb = color(val);
                const [ h, s, l ] = this.toHSL(rgb);

                this.setCSS('color-rgb', rgb.join(', '));
                this.setCSS('color-hue', h);
                this.setCSS('color-sat', `${s}%`);
                this.setCSS('color-lig', `${l}%`);

                this.toggle('accent-start-taskbar', true);
                break;
            case 'theme':
                val === 1 ? this.OS.client.classList.add('dark') : this.OS.client.classList.remove('dark');
                break;
            // Time and language
            case 'language':
                this.OS.i18n.language = Object.keys(languages)[val];
                // this.OS.reboot();
                break;
            // Sort apps by
            case 'general-apps-sort-by':
            case 'startup-apps-sort-by':
                if (init) break;

                const settingsSessions = this.OS.apps.find(app => app.stringified === 'settings').sessions;
                if (settingsSessions.length === 0) break;

                const { instance } = settingsSessions[0];
                if (instance.state.category !== 'apps') break;

                const appList = instance.main.querySelector('.app-list');
                const apps = [...appList.children].sort((appA, appB) => {
                    const { name: nameA, author: authorA, size: sizeA, date: dateA } = appA.dataset;
                    const { name: nameB, author: authorB, size: sizeB, date: dateB } = appB.dataset;

                    switch (val) {
                        case 0:
                            return nameA.localeCompare(nameB);
                        case 1:
                            return authorA.localeCompare(authorB);
                        case 2:
                            return sizeA.localeCompare(sizeB);
                        case 3:
                            const date = date => date.split('/').reverse().join('/');
                            return date(dateA).localeCompare(date(dateB));
                    }
                });

                for (const app of apps) {
                    appList.appendChild(app);
                }
                break;
        }
    }

    toggle(key, init) {
        if (!init) {
            this.database.toggle(key);
        }

        switch (key) {
            // Personalization
            case 'transparency-effects':
                this.toggleCSS(key, 'transparency-effects-start', {
                    val: .7,
                });
                this.toggleCSS(key, 'transparency-effects-start-sidebar', {
                    val: .3,
                });
                this.toggleCSS(key, 'transparency-effects-taskbar', {
                    val: .6,
                });
                break;
            case 'accent-start-taskbar':
                // Futuristic algorithm 👌
                // If you're a mere mortal don't attempt to comprehend this genius
                const rgb = color(this.get('color'));
                const [ h, s, l ] = this.toHSL(rgb);
                const sS = l > 34 // startSat
                    ? s > 18
                        ? 14
                        : 4
                    : 2;
                const sL = l > 34 ? 18 : 12; // startLig
                const tL = l > 34 ? 24 : 16; // taskbarLig
                const previews = mixColors(this.toRGB([ h, s - 6, l - tL ]), [...rgb, .15]);
                const previewsHover = mixColors(previews, [255, 255, 255, .1]);

                this.toggleCSS(key, 'start', {
                    val: `hsla(var(--color-hue, 180), calc(var(--color-sat, 100%) - ${sS}%), calc(var(--color-lig, 25%) - ${sL}%), var(--transparency-effects-start, 1))`,
                    fallback: 'hsla(0, 0%, 9%, var(--transparency-effects-start, 1))'
                });

                this.toggleCSS(key, 'start-sidebar', {
                    val: `hsla(var(--color-hue, 180), calc(var(--color-sat, 100%) - ${sS}%), calc(var(--color-lig, 25%) - ${sL - 3}%), var(--transparency-effects-start, 1))`,
                    fallback: 'hsla(0, 0%, 13%, var(--transparency-effects-start, 1))'
                });

                this.toggleCSS(key, 'start-context', {
                    val: `hsla(var(--color-hue, 180), calc(var(--color-sat, 100%) - ${sS}%), calc(var(--color-lig, 25%) - ${sL - 7}%), var(--transparency-effects-start, 1))`,
                    fallback: 'hsla(0, 0%, 20%, var(--transparency-effects-start, 1))'
                });

                this.toggleCSS(key, 'taskbar', {
                    val: `hsla(var(--color-hue, 180), calc(var(--color-sat, 100%) - 6%), calc(var(--color-lig, 25%) - ${tL}%), var(--transparency-effects-taskbar, 1))`,
                    fallback: 'hsla(0, 0%, 6%, var(--transparency-effects-taskbar, 1))'
                });

                this.toggleCSS(key, 'previews', {
                    val: `rgba(${previews.slice(0, 3).join(', ')}, var(--transparency-effects-taskbar, 1))`,
                    fallback: 'hsla(0, 0%, 16%, var(--transparency-effects-taskbar, 1))'
                });

                this.toggleCSS(key, 'previews-hover', {
                    val: `rgba(${previewsHover.slice(0, 3).join(', ')}, var(--transparency-effects-taskbar, 1))`,
                    fallback: 'hsla(0, 1%, 25%, var(--transparency-effects-taskbar, 1))'
                });

                this.toggleCSS(key, 'context-border', {
                    val: 'var(--color-rgb)',
                    fallback: '69, 71, 74'
                });
                break;
            case 'accent-titlebar':
                this.toggleCSS(key, 'color-accent-windows', {
                    val: 1,
                });
                break;
            case 'start-all-programs':
                this.ifSet(key, () => {
                    this.setCSS(key);
                    this.OS.start.allPrograms.style.display = 'none';
                    this.OS.start.allProgramsButton.classList.remove('back');
                }, () => {
                    this.setCSS(key, 'none');
                    this.OS.start.menu.style.display = '';
                });
                break;
            case 'start-recently-used':
                this.toggleCSS(key, key, {
                    fallback: 'none'
                });
                break;
            case 'taskbar-peek':
                this.toggleCSS(key, 'peek-preview', {
                    val: 0
                });
                break;
            case 'taskbar-preview-hover':
                this.toggleCSS(key, 'taskbar-preview-hover', {
                    val: '4px'
                });
        }
    }
}

export default Settings;