import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProvinces, getProvince, postalRange, totalLocations, PROVINCE_INFO } from '@/lib/postal';
import Breadcrumb from '@/components/Breadcrumb';
import Faq from '@/components/Faq';

type Props = { params: Promise<{ province: string }> };

export async function generateStaticParams() {
  const provinces = await getAllProvinces();
  return provinces.map(p => ({ province: p.provinceSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { province: slug } = await params;
  const province = await getProvince(slug);
  if (!province) return {};
  const title = `${province.provinceName} Postal Code — All ${province.totalDistricts} Districts | PostalNP`;
  const desc = `Find postal codes for all ${province.totalDistricts} districts in ${province.provinceName}, Nepal. Browse district-wise post office locations and 5-digit postal codes.`;
  const pName = province.provinceName;
  return {
    title,
    description: desc,
    keywords: `${pName} postal code, postal code of ${pName}, postal code ${pName}, ${pName} zip code of nepal, ${pName} post code of nepal, ${pName} province postal code, ${pName} district postal codes, postal code ${pName} nepal, find postal code ${pName}, ${pName} postal code list`,
    alternates: { canonical: `https://postal.singhyogendra.com.np/province/${slug}` },
    openGraph: { title, description: desc, type: 'website' },
  };
}

export default async function ProvincePage({ params }: Props) {
  const { province: slug } = await params;
  const province = await getProvince(slug);
  if (!province) notFound();

  const info = PROVINCE_INFO[slug];
  const otherProvinces = (await getAllProvinces()).filter(p => p.provinceSlug !== slug);
  const range = postalRange(province);
  const total = totalLocations(province);

  const faqs = [
    {
      q: `What are the postal codes in ${province.provinceName}?`,
      a: `${province.provinceName}${info ? ` (formerly ${info.formerName})` : ''} has postal codes ranging from ${range}, covering ${province.totalDistricts} districts and ${total} post office locations across ${info?.region ?? 'Nepal'}.`,
    },
    {
      q: `How many districts are in ${province.provinceName}?`,
      a: `${province.provinceName} has ${province.totalDistricts} districts: ${province.districts.map(d => d.name).join(', ')}.`,
    },
    {
      q: `What is the capital of ${province.provinceName}?`,
      a: info
        ? `The provincial capital of ${province.provinceName} is ${info.capital}, located in ${info.region}.`
        : `${province.provinceName} is one of Nepal's 7 federal provinces.`,
    },
    {
      q: `What was ${province.provinceName} formerly called?`,
      a: info
        ? `${province.provinceName} was formerly known as ${info.formerName} before Nepal's provinces were officially renamed in 2020.`
        : `${province.provinceName} is one of Nepal's 7 federal provinces established after the 2015 constitution.`,
    },
    {
      q: `How do I find a specific postal code in ${province.provinceName}?`,
      a: `Click on any district below to see all post office locations and their 5-digit postal codes within that district of ${province.provinceName}. You can also use the search box on the homepage.`,
    },
    {
      q: `What region is ${province.provinceName} in?`,
      a: info
        ? `${province.provinceName} is located in the ${info.region} region of Nepal. It is Province No. ${province.provinceNum} and its provincial capital is ${info.capital}.`
        : `${province.provinceName} is one of Nepal's 7 federal provinces established under the 2015 Constitution.`,
    },
    {
      q: `Can I use ${province.provinceName} postal codes for international mail?`,
      a: `Yes. The 5-digit postal codes in ${province.provinceName} are official Nepal Post codes and are accepted on all international address forms, e-commerce platforms, and courier shipments to Nepal. Use the specific locality code shown on each postal code page.`,
    },
    {
      q: `What is the difference between D.P.O. and A.P.O. in ${province.provinceName}?`,
      a: `D.P.O. (District Post Office) is the main postal hub of a district, while A.P.O. (Area Post Office) is a branch serving a specific locality. In ${province.provinceName}, each of the ${province.totalDistricts} districts has one D.P.O. with branch A.P.O.s for surrounding areas.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: province.provinceName,
    description: `Postal codes for all ${province.totalDistricts} districts in ${province.provinceName}, Nepal`,
    containedInPlace: { '@type': 'Country', name: 'Nepal' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: province.provinceName },
        ]} />
        <h1 className="page-title">{province.provinceName} Postal Codes</h1>
        <p className="page-sub">
          {province.totalDistricts} Districts &middot; {total} Post Offices &middot; Codes: {range}
          {info && ` · Capital: ${info.capital}`}
        </p>
      </div>

      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Districts in {province.provinceName}
        </h2>
        <div className="district-grid">
          {province.districts.map(d => {
            const dpo = d.locations.find(l => l.type === 'DPO') ?? d.locations[0];
            return (
              <Link key={d.slug} href={`/province/${slug}/${d.slug}`} className="district-card">
                <div className="district-card-name">{d.name}</div>
                <div className="district-card-count">{d.locations.length} post offices</div>
                {dpo && <div className="district-card-dpo">DPO: {dpo.postalCode}</div>}
                <div className="district-card-arrow">View Postal Codes →</div>
              </Link>
            );
          })}
        </div>
      </section>

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
        <Faq items={faqs} title={`FAQ: ${province.provinceName} Postal Codes`} />
      </div>
    </>
  );
}
