import { dev } from '$app/environment';
import i18n, { Config } from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'en';
export const config: Config = {
    log: {
        level: dev ? 'warn' : 'error'
    },
    translations: {
        en: { lang },
        cs: { lang }
    },
    loaders: [
        {
            locale: 'en',
            key: '',
            loader: async () => (await import('./en/main.json')).default
        }
    ]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);