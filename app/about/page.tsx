import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About PostalNP — Nepal Postal Code Directory',
  description: 'PostalNP is Nepal\'s free, comprehensive postal code directory covering all 7 provinces, 77 districts and 900+ post office locations. Learn how we help you find postal codes fast.',
  keywords: 'about postalNP, nepal postal code website, nepal post code directory, find postal code nepal, nepal postal code finder',
  alternates: { canonical: 'https://postal.singhyogendra.com.np/about' },
};

const PROVINCES = [
  { slug: 'koshi',         name: 'Koshi Province',         districts: 14 },
  { slug: 'madhesh',       name: 'Madhesh Province',       districts: 8  },
  { slug: 'bagmati',       name: 'Bagmati Province',       districts: 13 },
  { slug: 'gandaki',       name: 'Gandaki Province',       districts: 11 },
  { slug: 'lumbini',       name: 'Lumbini Province',       districts: 12 },
  { slug: 'karnali',       name: 'Karnali Province',       districts: 10 },
  { slug: 'sudurpashchim', name: 'Sudurpashchim Province', districts: 9  },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-head">
        <h1 className="page-title">About PostalNP</h1>
        <p className="page-sub">Nepal&rsquo;s free postal code directory — all 7 provinces, 77 districts</p>
      </div>

      <section className="section">
        <div className="about-body">
          <h2>What is PostalNP?</h2>
          <p>
            PostalNP is a free, easy-to-use online directory of Nepal&rsquo;s postal codes. We help individuals,
            businesses, and organizations quickly find the correct 5-digit postal code for any location
            across all 7 provinces of Nepal.
          </p>
          <p>
            Whether you&rsquo;re addressing a letter, filling out an online form, or shipping a parcel to Nepal,
            PostalNP gives you the exact postal code you need — instantly.
          </p>

          <h2>What We Cover</h2>
          <ul>
            <li>All <strong>7 provinces</strong> of Nepal</li>
            <li>All <strong>77 districts</strong></li>
            <li>Over <strong>900 post office locations</strong> including District Post Offices (D.P.O.) and Area Post Offices (A.P.O.)</li>
            <li>Full address format guide for every location</li>
            <li>Cross-province browsing and internal navigation</li>
          </ul>

          <h2>Nepal&rsquo;s 7 Provinces</h2>
          <div className="about-province-list">
            {PROVINCES.map(p => (
              <Link key={p.slug} href={`/province/${p.slug}`} className="about-province-item">
                <span className="about-province-name">{p.name}</span>
                <span className="about-province-meta">{p.districts} districts</span>
              </Link>
            ))}
          </div>

          <h2>How to Find a Postal Code</h2>
          <ol>
            <li>Use the <strong>search box</strong> on the homepage — type any place name or postal code.</li>
            <li>Or <strong>browse by province</strong> → select your district → find your location.</li>
            <li>Copy the 5-digit postal code and use it in your address.</li>
          </ol>

          <h2>About Nepal&rsquo;s Postal System</h2>
          <p>
            Nepal Post is the official national postal service of Nepal, operating under the Ministry of
            Communication and Information Technology. Nepal uses a 5-digit postal code system to route
            mail across the country.
          </p>
          <p>
            Each of Nepal&rsquo;s 77 districts has one <strong>District Post Office (D.P.O.)</strong> which
            serves as the main hub. Additional <strong>Area Post Offices (A.P.O.)</strong> cover specific
            localities within each district.
          </p>

          <h2>Data Source</h2>
          <p>
            Postal code data on PostalNP is sourced from Nepal Post records. While we strive to keep
            all information accurate and up to date, postal codes may occasionally change. For the most
            authoritative information, please visit{' '}
            <a href="https://nepalpost.gov.np" target="_blank" rel="noopener noreferrer">nepalpost.gov.np</a>.
          </p>

          <h2>Contact</h2>
          <p>
            For questions, corrections, or feedback about postal code data, please reach out via
            our GitHub repository.
          </p>
        </div>
      </section>
    </>
  );
}
