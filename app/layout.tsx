import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/tokens.css';
import '@/styles/globals.css';
import '@/styles/type.css';

import { fontClassNames } from '@/lib/fonts';
import { site } from '@/content/site';
import SmoothScroll from '@/components/SmoothScroll';
import PageFrame from '@/components/PageFrame';
import ScrollProgress from '@/components/ScrollProgress';
import MailButton from '@/components/MailButton';

export const metadata: Metadata = {
  title: `${site.name} — Portfolio`,
  description: site.tagline.replace('[PLACEHOLDER] ', ''),
};

/**
 * Root layout: fonts on <html>, default light theme, Lenis + GSAP wiring,
 * then the always-present chrome (page frame, scroll progress, mail button).
 * Preloader, Nav and the custom cursor are added in later build steps.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontClassNames} data-theme="light">
      <body>
        <SmoothScroll>
          <main id="main">{children}</main>
          <PageFrame />
          <ScrollProgress />
          <MailButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
