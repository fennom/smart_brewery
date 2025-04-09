import { I18n } from 'i18n-js';

import en from './locales/en.json';
import ru from './locales/ru.json';
import { getLocales } from 'expo-localization';

const i18n = new I18n({
    en,
    ru,
});

i18n.enableFallback = true;
i18n.translations = { en, ru };
i18n.locale = getLocales()[0].languageCode ?? 'en';

// Enable RTL support if needed

export default i18n; 