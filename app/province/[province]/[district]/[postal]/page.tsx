import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProvinces, getProvince, getDistrict, getLocation, PROVINCE_INFO } from '@/lib/postal';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';
import CopyButton from '@/components/CopyButton';
import ShareButtons from '@/components/ShareButtons';

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
  const lName = location.name;
  const dName = district.name;
  const pName = province.provinceName;
  const title = `${lName} Postal Code: ${postal} | ${dName}, ${pName} | PostalNP`;
  const desc = `The postal code of ${lName}, ${dName} district, ${pName}, Nepal is ${postal}. Find the correct address format and nearby postal codes.`;
  return {
    title,
    description: desc,
    keywords: `${lName} postal code, postal code ${lName}, ${lName} zip code of nepal, ${lName} post code of nepal, postal code of ${lName} nepal, ${lName} ${dName} postal code, ${postal} postal code nepal, what is postal code of ${lName}, ${lName} area postal code, ${lName} post office code, ${pName} ${lName} postal code, ${lName} zip code, ${lName} pin code nepal`,
    alternates: { canonical: `https://postal.singhyogendra.com.np/province/${pSlug}/${dSlug}/${postal}` },
    openGraph: { title, description: desc, type: 'website' },
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
  const dpo = district.locations.find(l => l.type === 'DPO') ?? district.locations[0];

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
    {
      q: `Is ${postal} the same as a PIN code for ${location.name}?`,
      a: `Yes — postal code and PIN code refer to the same thing. In Nepal, the official term is "postal code." The 5-digit code ${postal} is used for ${location.name}, ${district.name}, and can be entered as PIN/ZIP code on any international form.`,
    },
    {
      q: `Can I use postal code ${postal} for international shipping to ${location.name}?`,
      a: `Yes. When shipping internationally to ${location.name}, ${district.name}, ${province.provinceName}, Nepal, enter ${postal} as the postal/ZIP code. Nepal Post and international couriers (DHL, FedEx, UPS) accept this code for delivery routing.`,
    },
    {
      q: `What courier services deliver to ${location.name} (${postal})?`,
      a: `${location.name} (${postal}) is served by Nepal Post. Private couriers such as DHL, FedEx, and local services like Aramex Nepal also deliver to addresses in ${district.name} district using postal code ${postal}.`,
    },
    {
      q: `How do I verify if postal code ${postal} is correct for ${location.name}?`,
      a: `Postal code ${postal} is the officially assigned Nepal Post code for ${location.name}, ${district.name} district, ${province.provinceName}. You can verify by checking the Nepal Post official website at nepalpost.gov.np or by contacting the ${dpo?.postalCode ? `D.P.O. (${dpo.postalCode})` : 'district post office'} for ${district.name}.`,
    },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'PostOffice',
      name: `${location.name} Post Office`,
      description: `${location.type === 'DPO' ? 'District Post Office' : 'Area Post Office'} in ${district.name}, ${province.provinceName}, Nepal`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.name,
        addressLocality: district.name,
        addressRegion: province.provinceName,
        postalCode: postal,
        addressCountry: 'NP',
      },
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: district.name,
        containedInPlace: { '@type': 'AdministrativeArea', name: province.provinceName },
      },
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

      {/* Hero */}
      <section className="postal-detail">
        <div className="postal-code-hero">
          <div className="postal-code-label">Postal Code</div>
          <div className="postal-code-number">{postal}</div>
          {location.type && (
            <span className={`type-badge-lg type-${location.type.toLowerCase()}`}>{location.type}</span>
          )}
          <div className="postal-hero-actions">
            <CopyButton text={postal} label="Copy Code" variant="hero" />
          </div>
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

      {/* Share */}
      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Share this Postal Code
        </h2>
        <ShareButtons
          postalCode={postal}
          locationName={location.name}
          districtName={district.name}
          provinceName={province.provinceName}
        />
      </section>

      {/* Address format */}
      <section className="section section-alt">
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
        <div style={{ marginTop: 12 }}>
          <CopyButton
            text={`${location.name}, ${district.name} District, ${province.provinceName}, Nepal - ${postal}`}
            label="Copy Full Address"
            variant="default"
          />
        </div>
      </section>

      {/* Nearby */}
      {otherLocations.length > 0 && (
        <section className="section">
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

      {/* Other provinces */}
      <section className="section section-alt">
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
