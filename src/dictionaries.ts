import { en } from './locales/en';
import { tr } from './locales/tr';

export type Locale = 'en' | 'tr';

export const dictionaries = {
  en,
  tr,
};

export const getDictionary = (locale: Locale) => dictionaries[locale] || dictionaries.en;
