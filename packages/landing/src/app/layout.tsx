import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { FC, ReactNode } from 'react';
import Footer from '@/components/molecules/Footer';
import Navbar from '@/components/molecules/Navbar';
import './globals.css';

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('fr55-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'fr55-dark':'fr55';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

const inter = Inter({ subsets: ['latin'] });

const GITHUB = 'https://github.com/hieudoanm/fr55';
const BASE = process.env.NODE_ENV === 'production' ? '/fr55' : '';
const LOGO =
  process.env.NODE_ENV === 'production' ? '/fr55/logo.svg' : '/logo.svg';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Build', href: '#build' },
  { label: 'Install', href: '#install' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Docs', href: '/docs/' },
  { label: 'Downloads', href: '/downloads/' },
];

const DESCRIPTION =
  'Connect IQ watchfaces for the Garmin Forerunner 55 (fr55, 240×240 MIP): 16 buildable Monkey C watchfaces — hands, rings, dotmatrix, compass, and more.';

export const metadata: Metadata = {
  metadataBase: new URL('https://hieudoanm.github.io/fr55/'),
  title: {
    default: 'FR55 Watchfaces',
    template: '%s — FR55',
  },
  description: DESCRIPTION,
  keywords: [
    'Garmin',
    'Forerunner 55',
    'fr55',
    'Connect IQ',
    'Monkey C',
    'watchface',
    'watch faces',
    'MIP display',
  ],
  authors: [{ name: 'hieudoan', url: GITHUB }],
  category: 'electronics',
  openGraph: {
    siteName: 'FR55 Watchfaces',
    type: 'website',
    title: 'FR55 Watchfaces',
    description: DESCRIPTION,
    url: 'https://hieudoanm.github.io/fr55/',
    images: ['/og.png'],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
  icons: {
    icon: [
      { url: `${BASE}/favicon.ico`, sizes: 'any' },
      { url: `${BASE}/favicon.svg`, type: 'image/svg+xml' },
    ],
  },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'FR55 Watchfaces',
      url: 'https://hieudoanm.github.io/fr55/',
      description: DESCRIPTION,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'FR55 Watchfaces',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Garmin Connect IQ',
      description: DESCRIPTION,
      url: 'https://hieudoanm.github.io/fr55/',
      codeRepository: GITHUB,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html
    lang="en"
    data-theme="fr55"
    suppressHydrationWarning
    className={`scroll-smooth antialiased motion-reduce:scroll-auto ${inter.className}`}>
    <body className="bg-base-100 text-base-content m-0 leading-relaxed">
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Navbar
        name="FR55 Watchfaces"
        logoSrc={LOGO}
        links={NAV_LINKS}
        githubUrl={GITHUB}
      />
      {children}
      <Footer
        name="fr55"
        tagline="Connect IQ watchfaces for Garmin Forerunner 55"
        githubUrl={GITHUB}
      />
    </body>
  </html>
);

export default RootLayout;
