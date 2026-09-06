import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/type.css';

import { fontClassNames } from '@/lib/fonts';
import { site } from '@/content/site';
import SmoothScroll from '@/components/SmoothScroll';
import { INTRO_STORAGE_KEY } from '@/lib/intro';
import { IntroProvider } from '@/components/IntroProvider';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import PageFrame from '@/components/PageFrame';
import ScrollProgress from '@/components/ScrollProgress';
import MailButton from '@/components/MailButton';

export const metadata: Metadata = {
  title: `${site.name} — Portfolio`,
  description: site.tagline.replace('[PLACEHOLDER] ', ''),
};

/* Runs before hydration: html[data-intro] = "seen" skips the preloader on
   repeat visits this session; any value keeps the hero hidden until its
   intro starts (see IntroProvider). */
const introScript = `(function(){var v='first';try{if(sessionStorage.getItem('${INTRO_STORAGE_KEY}'))v='seen'}catch(e){}document.documentElement.dataset.intro=v})();`;

/**
 * Root layout: fonts on <html>, default light theme, Lenis + GSAP wiring,
 * intro coordination, then the always-present chrome.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassNames} data-theme="light" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <SmoothScroll>
          <IntroProvider>
            <Preloader />
            <Nav />
            <main id="main">{children}</main>
            <PageFrame />
            <ScrollProgress />
            <MailButton />
          </IntroProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
