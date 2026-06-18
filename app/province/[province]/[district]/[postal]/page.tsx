import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProvinces, getProvince, getDistrict, getLocation, PROVINCE_INFO } from '@/lib/postal';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

type Props = { params: Promise<{ province: string; district: string; postal: string }> };

export async function generateStaticParams() {
  const provinces = await getAllProvinces();
  return provinces.flatMap(p =>
    p.districts.flatMap(d =>
      d.locations.map(l => ({
        province: p.provinceSlug,
        district: d.slug,
        postal: l.postalCode,
      }))
    )
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province: pSlug, district: dSlug, postal } = await params;
  const province = await getProvince(pSlug);
  if (!province) return {};
  const district = getDistrict(province, dSlug);
  if (!district) return {};
  const location = getLocation(district, postal);
  if (!location) return {};
  const title = `${location.name} Postal Code: ${postal} | ${district.name}, ${province.provinceName} | PostalNP`;
  const desc = `The postal code of ${location.name}, ${district.name} district, ${province.provinceName}, Nepal is ${postal}. Find the correct address format and nearby postal codes.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.postalcodenp.com/province/${pSlug}/${dSlug}/${postal}` },
    openGraph: {
      title,
      description: desc,
      type: 'website',
    },
  };
}

export default async function PostalPage({ params }: Props) {
  const { province: pSlug, district: dSlug, postal } = await params;
  const province = await getProvince(pSlug);
  if (!province) notFound();
  const district = getDistrict(province, dSlug);
  if (!district) notFound();
  const location = getLocation(district, postal);
  if (!location) notFound();

  const otherLocations = district.locations.filter(l => l.postalCode !== postal).slice(0, 10);
  const otherProvinces = (await getAllProvinces()).filter(p => p.provinceSlug !== pSlug);
  const info = PROVINCE_INFO[pSlug];

  const nearbyStr = otherLocations.slice(0, 5).map(l => `${l.name} (${l.postalCode})`).join(', ');

  const faqs = [
    {
      q: `What is the postal code of ${location.name}?`,
      a: `The postal code of ${location.name}, ${district.name} district, ${province.provinceName}, Nepal is ${postal}. This is a 5-digit Nepal Post code used to route mail to this location.`,
    },
    {
      q: `Which district is ${location.name} in?`,
      a: `${location.name} is located in ${district.name} district, ${province.provinceName}, Nepal. The district has ${district.locations.length} post office locations in total.`,
    },
    {
      q: `Which province is ${location.name} in?`,
      a: `${location.name} is in ${province.provinceName}${info ? ` (formerly ${info.formerName})` : ''}, Nepal${info ? `, in the ${info.region} region` : ''}.`,
    },
    {
      q: `How do I write the address for ${location.name} in Nepal?`,
      a: `To address mail to ${location.name}, write: [Recipient Name], [Street/Ward/Tole], ${location.name}, ${district.name} District, ${province.provinceName}, Nepal - ${postal}. The 5-digit postal code ${postal} goes at the end of the address.`,
    },
    {
      q: `What does ${location.type ?? 'Post Office'} mean in Nepal's postal system?`,
      a: location.type === 'DPO'
        ? `D.P.O. stands for District Post Office. ${location.name} (${postal}) is the main post office hub for ${district.name} district, handling all inbound and outbound mail for the district.`
        : location.type === 'APO'
        ? `A.P.O. stands for Area Post Office. ${location.name} (${postal}) is a branch post office serving the local area within ${district.name} district, ${province.provinceName}.`
        : `${location.name} is a post office serving the local community in ${district.name} district, ${province.provinceName}, Nepal.`,
    },
    {
      q: `What are other postal codes near ${location.name}?`,
      a: nearbyStr
        ? `Other post offices in ${district.name} district include: ${nearbyStr}. Browse all ${district.locations.length} locations in ${district.name} to find your specific area.`
        : `${location.name} is one of ${district.locations.length} post offices in ${district.name} district. Browse the district page to see all locations.`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'PostalAddress',
      addressLocality: location.name,
      addressRegion: district.name,
      postalCode: postal,
      addressCountry: 'NP',
      name: `${location.name} Post Office`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: province.provinceName, href: `/province/${pSlug}` },
          { label: `${district.name} District`, href: `/province/${pSlug}/${dSlug}` },
          { label: location.name },
        ]} />
      </div>

      <section className="postal-detail">
        <div className="postal-code-hero">
          <div className="postal-code-label">Postal Code</div>
          <div className="postal-code-number">{postal}</div>
          {location.type && (
            <span className={`type-badge-lg type-${location.type.toLowerCase()}`}>{location.type}</span>
          )}
        </div>
        <div className="postal-info-grid">
          <div className="postal-info-row">
            <div className="postal-info-label">Location</div>
            <div className="postal-info-value">{location.name}</div>
          </div>
          <div className="postal-info-row">
            <div className="postal-info-label">District</div>
            <div className="postal-info-value">
              <Link href={`/province/${pSlug}/${dSlug}`}>{district.name}</Link>
            </div>
          </div>
          <div className="postal-info-row">
            <div className="postal-info-label">Province</div>
            <div className="postal-info-value">
              <Link href={`/province/${pSlug}`}>{province.provinceName}</Link>
            </div>
          </div>
          {info && (
            <div className="postal-info-row">
              <div className="postal-info-label">Region</div>
              <div className="postal-info-value">{info.region}</div>
            </div>
          )}
          <div className="postal-info-row">
            <div className="postal-info-label">Country</div>
            <div className="postal-info-value">Nepal</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Address Format
        </h2>
        <div className="address-box">
          <div className="address-line">[Recipient Name]</div>
          <div className="address-line">[Street / Ward / Tole]</div>
          <div className="address-line">{location.name}</div>
          <div className="address-line">{district.name} District</div>
          <div className="address-line">{province.provinceName}</div>
          <div className="address-line">Nepal &mdash; <strong>{postal}</strong></div>
        </div>
      </section>

      {otherLocations.length > 0 && (
        <section className="section section-alt">
          <h2 className="section-heading">
            <div className="accent-bar" />
            Other Post Offices in {district.name}
          </h2>
          <div className="nearby-list">
            {otherLocations.map(l => (
              <Link key={l.postalCode} href={`/province/${pSlug}/${dSlug}/${l.postalCode}`} className="nearby-item">
                <span className="nearby-code">{l.postalCode}</span>
                <span className="nearby-name">{l.name}</span>
              </Link>
            ))}
          </div>
          <Link href={`/province/${pSlug}/${dSlug}`} className="view-all-link">
            View all {district.locations.length} post offices in {district.name} district →
          </Link>
        </section>
      )}

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Other Provinces in Nepal
        </h2>
        <div className="province-links">
          {otherProvinces.map(p => (
            <Link key={p.provinceSlug} href={`/province/${p.provinceSlug}`} className="province-link-pill">
              {p.provinceName}
            </Link>
          ))}
        </div>
      </section>

      <div className="section">
        <Faq items={faqs} title={`FAQ: ${location.name} Postal Code ${postal}`} />
      </div>
    </>
  );
}
