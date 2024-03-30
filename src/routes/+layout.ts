import type { Load } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { defaultLocale, loadTranslations, locale } from '$lib/i18n';
import { persistible } from '$lib/util/store';

export const ssr = false;
export const load: Load = async ({ url }) => {
    const language = persistible('language', defaultLocale);
    const initLocale = locale.get() || get(language);

    await loadTranslations(initLocale, url.pathname);
};