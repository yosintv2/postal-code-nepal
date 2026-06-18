import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | PostalNP',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">Page Not Found</h1>
      <p className="not-found-desc">
        The postal code or page you&rsquo;re looking for doesn&rsquo;t exist.<br />
        Try browsing by province below.
      </p>
      <Link href="/" className="btn-primary">Go to Homepage</Link>
    </div>
  );
}
