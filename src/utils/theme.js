import { getSettings } from './storage';

export const THEME_DARK = 'dark';
export const THEME_RETRO = 'retro';

export const PALETTES = ['default', 'emerald', 'crimson', 'amber', 'indigo', 'cyan'];

export function normalizeTheme(theme) {
  return theme === THEME_RETRO ? THEME_RETRO : THEME_DARK;
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', normalizeTheme(theme));
}

export function applyPalette(palette) {
  document.documentElement.setAttribute(
    'data-palette',
    PALETTES.includes(palette) ? palette : 'default'
  );
}

export function getTheme() {
  return normalizeTheme(getSettings().theme);
}

export function getPalette() {
  return PALETTES.includes(getSettings().palette) ? getSettings().palette : 'default';
}
