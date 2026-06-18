import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProvinces, getProvince, getDistrict, PROVINCE_INFO } from '@/lib/postal';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

type Props = { params: Promise<{ province: string; district: string }> };

export async function generateStaticParams() {
  const provinces = await getAllProvinces();
  return provinces.flatMap(p =>
    p.districts.map(d => ({ province: p.provinceSlug, district: d.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province: pSlug, district: dSlug } = await params;
  const province = await getProvince(pSlug);
  if (!province) return {};
  const district = getDistrict(province, dSlug);
  if (!district) return {};
  const title = `${district.name} District Postal Code — ${district.locations.length} Locations | ${province.provinceName}`;
  const desc = `Postal codes for all ${district.locations.length} post offices in ${district.name} district, ${province.provinceName}, Nepal. Find the 5-digit postal code for your location.`;
  const dName = district.name;
  const pName = province.provinceName;
  return {
    title,
    description: desc,
    keywords: `${dName} postal code, postal code of ${dName}, postal code ${dName}, ${dName} zip code of nepal, ${dName} post code of nepal, ${dName} district postal code, ${dName} nepal postal code, ${pName} ${dName} postal code, ${dName} area postal code, post office ${dName} nepal, ${dName} post code`,
    alternates: { canonical: `https://postal.singhyogendra.com.np/province/${pSlug}/${dSlug}` },
    openGraph: { title, description: desc, type: 'website' },
  };
}

export default async function DistrictPage({ params }: Props) {
  const { province: pSlug, district: dSlug } = await params;
  const province = await getProvince(pSlug);
  if (!province) notFound();
  const district = getDistrict(province, dSlug);
  if (!district) notFound();

  const dpo = district.locations.find(l => l.type === 'DPO') ?? district.locations[0];
  const otherDistricts = province.districts.filter(d => d.slug !== dSlug);
  const otherProvinces = (await getAllProvinces()).filter(p => p.provinceSlug !== pSlug);
  const info = PROVINCE_INFO[pSlug];

  const faqs = [
    {
      q: `What is the postal code of ${district.name} district?`,
      a: `The main District Post Office (D.P.O.) postal code for ${district.name} is ${dpo?.postalCode ?? 'N/A'}. ${district.name} district has ${district.locations.length} post office locations in total within ${province.provinceName}, Nepal.`,
    },
    {
      q: `Which province is ${district.name} in?`,
      a: `${district.name} district is in ${province.provinceName}${info ? ` (formerly ${info.formerName})` : ''} of Nepal.`,
    },
    {
      q: `How many post offices are in ${district.name}?`,
      a: `${district.name} district has ${district.locations.length} post office locations — including the District Post Office (D.P.O.) and Area Post Offices (A.P.O.) serving different localities.`,
    },
    {
      q: `What is the D.P.O. postal code of ${district.name}?`,
      a: `The District Post Office (D.P.O.) of ${district.name} has the postal code ${dpo?.postalCode ?? 'N/A'}. The D.P.O. is the main post office hub for the entire ${district.name} district.`,
    },
    {
      q: `How do I use the ${district.name} postal code?`,
      a: `When addressing mail to ${district.name}, ${province.provinceName}, Nepal, use the 5-digit postal code of the specific locality. For example, use ${dpo?.postalCode ?? ''} for the district headquarters area. Click on any location below to see the full address format.`,
    },
    {
      q: `Is ${district.name} postal code the same as a ZIP or PIN code?`,
      a: `Yes — postal code, ZIP code, and PIN code all refer to the same 5-digit area identifier. In Nepal, the official term is postal code. The ${district.name} D.P.O. code ${dpo?.postalCode ?? ''} can be entered as ZIP or PIN code on any international form when sending mail to ${district.name}, Nepal.`,
    },
    {
      q: `What courier services deliver to ${district.name} district?`,
      a: `${district.name} district is served by Nepal Post as the primary postal service. Private couriers including DHL, FedEx, Aramex Nepal, and various local services also deliver to ${district.name} using the postal codes listed on this page.`,
    },
    {
      q: `What is the address format for ${district.name}, ${province.provinceName}?`,
      a: `A standard address in ${district.name} district: [Recipient Name], [Street/Ward/Tole], [Locality Name], ${district.name} District, ${province.provinceName}, Nepal - [5-digit postal code]. Click on any post office below to see the complete address format with its specific code.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: `${district.name} District`,
    description: `Postal codes for ${district.name} district, ${province.provinceName}, Nepal`,
    containedInPlace: { '@type': 'AdministrativeArea', name: province.provinceName },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: province.provinceName, href: `/province/${pSlug}` },
          { label: `${district.name} District` },
        ]} />
        <h1 className="page-title">{district.name} District — Postal Codes</h1>
        <p className="page-sub">
          {province.provinceName} &middot; {district.locations.length} post office locations
          {dpo && ` · DPO: ${dpo.postalCode}`}
        </p>
      </div>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          All Post Offices in {district.name}
        </h2>
        <div className="postal-table-wrap">
          <table className="postal-table">
            <thead>
              <tr>
                <th>Location / Post Office</th>
                <th>Postal Code</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {district.locations.map(loc => (
                <tr key={loc.postalCode} className={loc.type === 'DPO' ? 'row-dpo' : ''}>
                  <td>
                    <Link href={`/province/${pSlug}/${dSlug}/${loc.postalCode}`} className="table-link">
                      {loc.name}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/province/${pSlug}/${dSlug}/${loc.postalCode}`} className="postal-badge">
                      {loc.postalCode}
                    </Link>
                  </td>
                  <td>
                    {loc.type
                      ? <span className={`type-badge type-${loc.type.toLowerCase()}`}>{loc.type}</span>
                      : <span className="type-badge type-apo">PO</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {otherDistricts.length > 0 && (
        <section className="section section-alt">
          <h2 className="section-heading">
            <div className="accent-bar" />
            Other Districts in {province.provinceName}
          </h2>
          <div className="district-pill-list">
            {otherDistricts.map(d => (
              <Link key={d.slug} href={`/province/${pSlug}/${d.slug}`} className="district-pill">
                {d.name}
              </Link>
            ))}
          </div>
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
        <Faq items={faqs} title={`FAQ: ${district.name} Postal Codes`} />
      </div>
    </>
  );
}
