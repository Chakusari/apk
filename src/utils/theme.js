import { getSettings } from './storage';

export const THEME_DARK = 'dark';
export const THEME_RETRO = 'retro';

export function normalizeTheme(theme) {
  return theme === THEME_RETRO ? THEME_RETRO : THEME_DARK;
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', normalizeTheme(theme));
}

export function getTheme() {
  return normalizeTheme(getSettings().theme);
}