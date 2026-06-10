import pt from './pt.json';
import en from './en.json';

const STORAGE_KEY = 'jogo2d.language';
const dictionaries = { pt, en };

export const languages = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' }
];

function getStoredLanguage() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return dictionaries[stored] ? stored : 'pt';
}

let activeLanguage = getStoredLanguage();

export function getLanguage() {
  return activeLanguage;
}

export function setLanguage(language) {
  activeLanguage = dictionaries[language] ? language : 'pt';
  window.localStorage.setItem(STORAGE_KEY, activeLanguage);
}

export function toggleLanguage() {
  setLanguage(activeLanguage === 'pt' ? 'en' : 'pt');
  return activeLanguage;
}

export function t(key, values = {}) {
  const dictionary = dictionaries[activeLanguage] ?? dictionaries.pt;
  const fallback = dictionaries.pt[key] ?? key;
  const template = dictionary[key] ?? fallback;

  return template.replace(/\{(\w+)\}/g, (_, valueKey) => {
    return values[valueKey] ?? '';
  });
}
