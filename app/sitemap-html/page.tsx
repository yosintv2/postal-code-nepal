import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProvinces } from '@/lib/postal';

export const metadata: Metadata = {
  title: 'Nepal Postal Code Sitemap — All Provinces, Districts & Locations | PostalNP',
  description: 'Complete HTML sitemap of all Nepal postal codes. Browse all 7 provinces, 77 districts and 900+ post office locations with their 5-digit postal codes.',
  keywords: 'nepal postal code sitemap, all nepal postal codes, nepal postal code list, complete nepal postal codes',
  alternates: { canonical: 'https://postal.singhyogendra.com.np/sitemap-html' },
};

export default async function SitemapHtmlPage() {
  const provinces = await getAllProvinces();
  const totalLocations = provinces.reduce((s, p) => s + p.districts.reduce((ds, d) => ds + d.locations.length, 0), 0);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Nepal Postal Code — Full Sitemap</h1>
        <p className="page-sub">
          {provinces.length} Provinces &middot; {provinces.reduce((s, p) => s + p.districts.length, 0)} Districts &middot; {totalLocations} Post Office Locations
        </p>
      </div>

      <section className="section">
        <div className="sitemap-grid">
          {provinces.map(province => (
            <div key={province.provinceSlug} className="sitemap-province">
              <Link href={`/province/${province.provinceSlug}`} className="sitemap-province-link">
                <span className="sitemap-province-num">Province {province.provinceNum}</span>
                {province.provinceName}
              </Link>

              <div className="sitemap-districts">
                {province.districts.map(district => (
                  <details key={district.slug} className="sitemap-district">
                    <summary className="sitemap-district-link">
                      <Link href={`/province/${province.provinceSlug}/${district.slug}`}>
                        {district.name}
                      </Link>
                      <span className="sitemap-count">{district.locations.length}</span>
                    </summary>
                    <ul className="sitemap-locations">
                      {district.locations.map(loc => (
                        <li key={loc.postalCode}>
                          <Link
                            href={`/province/${province.provinceSlug}/${district.slug}/${loc.postalCode}`}
                            className="sitemap-loc-link"
                          >
                            <span className="sitemap-loc-code">{loc.postalCode}</span>
                            <span className="sitemap-loc-name">{loc.name}</span>
                            {loc.type && <span className={`sitemap-type type-${loc.type.toLowerCase()}`}>{loc.type}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
