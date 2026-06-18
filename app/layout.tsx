import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.postalcodenp.com';

export const metadata: Metadata = {
  title: 'Nepal Postal Code — Find Any Postal Code in Nepal | PostalNP',
  description: 'Complete Nepal postal code directory. Find 5-digit postal codes for all 7 provinces, 77 districts and thousands of locations. Free Nepal postal code lookup.',
  keywords: 'nepal postal code, postal code nepal, nepal zip code, nepal post code, kathmandu postal code, koshi postal code, bagmati postal code, find postal code nepal',
  authors: [{ name: 'PostalNP' }],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    siteName: 'PostalNP',
    title: 'Nepal Postal Code Directory | PostalNP',
    description: 'Find postal codes for any location in Nepal across all 7 provinces and 77 districts.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nepal Postal Code | PostalNP',
    description: 'Complete Nepal postal code directory — all 7 provinces, 77 districts.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE_URL}/` },
  manifest: '/site.webmanifest',
  applicationName: 'PostalNP',
  category: 'reference',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'PostalNP',
        url: BASE_URL,
        description: 'Complete Nepal postal code directory for all 7 provinces.',
        publisher: { '@id': `${BASE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/?q={search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'PostalNP',
        url: BASE_URL,
        logo: { '@type': 'ImageObject', url: `${BASE_URL}/icon.svg` },
        description: 'Nepal postal code directory covering all 7 provinces.',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#c0392b" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <Navbar />
        <div className="container">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
