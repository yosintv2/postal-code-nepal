import Link from 'next/link';
import Logo from './Logo';

const PROVINCES = [
  { slug: 'koshi',         name: 'Koshi Province' },
  { slug: 'madhesh',       name: 'Madhesh Province' },
  { slug: 'bagmati',       name: 'Bagmati Province' },
  { slug: 'gandaki',       name: 'Gandaki Province' },
  { slug: 'lumbini',       name: 'Lumbini Province' },
  { slug: 'karnali',       name: 'Karnali Province' },
  { slug: 'sudurpashchim', name: 'Sudurpashchim Province' },
];

const POPULAR = [
  { href: '/province/bagmati/kathmandu', label: 'Kathmandu Postal Codes' },
  { href: '/province/koshi',             label: 'Koshi Province Codes' },
  { href: '/province/madhesh',           label: 'Madhesh Province Codes' },
  { href: '/province/bagmati',           label: 'Bagmati Province Codes' },
  { href: '/province/lumbini',           label: 'Lumbini Province Codes' },
  { href: '/province/gandaki',           label: 'Gandaki Province Codes' },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo-row">
              <Logo size={30} />
              <span className="footer-brand-name">PostalNP</span>
            </div>
            <p className="footer-desc">
              Nepal&rsquo;s complete postal code directory. Find the 5-digit postal code for any location across all 7 provinces and 77 districts of Nepal.
            </p>
            <p className="footer-disclaimer">
              Data sourced from Nepal Post. For official postal services visit nepalpost.gov.np.
            </p>
          </div>

          <div>
            <div className="footer-col-title">All Provinces</div>
            <div className="footer-links">
              {PROVINCES.map(p => (
                <Link key={p.slug} href={`/province/${p.slug}`} className="footer-link">
                  {p.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Popular Searches</div>
            <div className="footer-links">
              {POPULAR.map(l => (
                <Link key={l.href} href={l.href} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="footer-col-title">About & Legal</div>
            <div className="footer-links">
              <Link href="/about" className="footer-link">About PostalNP</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/sitemap-html" className="footer-link">Full Site Sitemap</Link>
              <Link href="/#provinces" className="footer-link">Browse All Provinces</Link>
              <Link href="/province/bagmati" className="footer-link">Bagmati Postal Codes</Link>
              <Link href="/province/sudurpashchim" className="footer-link">Sudurpashchim Postal Codes</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-inner" style={{ paddingTop: 0, paddingBottom: 16 }}>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PostalNP — Nepal Postal Code Directory.</span>
          <span>All 7 provinces · 77 districts · Nepal Post data.</span>
        </div>
      </div>
    </footer>
  );
}
