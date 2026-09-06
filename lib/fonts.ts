/**
 * Self-hosted fonts (§2.2), loaded with next/font/local. Each exposes a CSS
 * variable that styles/tokens.css folds into the --ff-* families.
 *
 * Files and licences live in styles/fonts/.
 *  - Anton           hero name; free stand-in for Manuka Black (see brief §6)
 *  - Nimbus Sans Bold display titles (URW base35)
 *  - Inter variable  body; free stand-in for BDO Grotesk
 *  - Geist Mono var. labels / meta
 */
import localFont from 'next/font/local';

export const heroFont = localFont({
  src: '../styles/fonts/Anton-Regular.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-hero',
  fallback: ['Impact', 'Arial Narrow', 'sans-serif'],
});

export const displayFont = localFont({
  src: '../styles/fonts/NimbusSans-Bold.woff2',
  weight: '700',
  style: 'normal',
  display: 'swap',
  variable: '--font-display',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
});

export const bodyFont = localFont({
  src: '../styles/fonts/Inter-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-body',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const monoFont = localFont({
  src: '../styles/fonts/GeistMono-Variable.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
});

/** Put this on <html> so the --font-* variables are available everywhere. */
export const fontClassNames = [
  heroFont.variable,
  displayFont.variable,
  bodyFont.variable,
  monoFont.variable,
].join(' ');
