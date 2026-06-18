'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const MAIN_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#provinces', label: 'All Provinces' },
  { href: '/about', label: 'About' },
];

const PROVINCE_LINKS = [
  { href: '/province/koshi', label: 'Koshi' },
  { href: '/province/madhesh', label: 'Madhesh' },
  { href: '/province/bagmati', label: 'Bagmati' },
  { href: '/province/gandaki', label: 'Gandaki' },
  { href: '/province/lumbini', label: 'Lumbini' },
  { href: '/province/karnali', label: 'Karnali' },
  { href: '/province/sudurpashchim', label: 'Sudurpashchim' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-top">
        <div className="nav-top-inner">
          <Link href="/" className="nav-logo" aria-label="PostalNP — Nepal Postal Code Directory">
            <Logo size={40} />
            <span className="nav-brand">Postal<span>NP</span></span>
          </Link>
          <div className="nav-tagline">Nepal&rsquo;s Postal Code Directory</div>
          <div className="nav-top-actions">
            <button
              className={`nav-hamburger${open ? ' open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              type="button"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="nav-main">
        <div className="nav-main-inner">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-main-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-leagues" aria-label="Province quick links">
        <div className="nav-leagues-inner">
          {PROVINCE_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-league-link">
              {label}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div className="nav-mobile-menu" role="menu">
          {MAIN_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-mobile-link${pathname === href ? ' active' : ''}`}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="nav-mobile-provinces">
            <div className="nav-mobile-section-title">Provinces</div>
            {PROVINCE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="nav-mobile-link"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {label} Province
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
