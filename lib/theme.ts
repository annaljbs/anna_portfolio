/**
 * Section themes (§2.1). The background colours mirror --bg in
 * styles/tokens.css — change both together. components/ThemeController.tsx
 * tweens the body background between them at each theme boundary.
 */
export type Theme = 'light' | 'dark';

export const THEME_BG: Record<Theme, string> = {
  light: '#f0f0f0',
  dark: '#0e0e0e',
};

export function isTheme(value: string | undefined): value is Theme {
  return value === 'light' || value === 'dark';
}
