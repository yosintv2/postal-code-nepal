import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProvinces, postalRange, totalLocations, PROVINCE_INFO } from '@/lib/postal';
import type { SearchEntry } from '@/types/postal';
import SearchClient from '@/components/SearchClient';
import Faq from '@/components/Faq';

export const metadata: Metadata = {
  title: 'Nepal Postal Code — Find Any Postal Code in Nepal | PostalNP',
  description: 'Complete Nepal postal code directory. Find 5-digit postal codes for all 7 provinces, 77 districts and thousands of localities. Free postal code lookup for Nepal.',
  alternates: { canonical: 'https://www.postalcodenp.com/' },
};

const HOME_FAQS = [
  {
    q: 'What is a postal code in Nepal?',
    a: "A postal code in Nepal is a 5-digit number assigned by Nepal Post to identify specific post offices and geographic areas. It helps route mail accurately across Nepal's 7 provinces and 77 districts. Nepal postal codes typically range from 10000 to 57999.",
  },
  {
    q: 'How many provinces does Nepal have postal codes for?',
    a: "Nepal has 7 provinces, each with its own set of postal codes: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, and Sudurpashchim. Together they cover thousands of localities and post offices nationwide.",
  },
  {
    q: 'How do I find my postal code in Nepal?',
    a: "Use the search box above to type your location name or postal code. You can also browse by province — click your province, select your district, then find your specific locality to see its 5-digit Nepal postal code.",
  },
  {
    q: "What does D.P.O. mean in Nepal's postal system?",
    a: "D.P.O. stands for District Post Office — the main post office of a district. Each of Nepal's 77 districts has one D.P.O. that acts as the central hub for all incoming and outgoing mail in that district. The D.P.O. postal code is typically a round number (e.g., 57000, 44600).",
  },
  {
    q: 'Are Nepal postal codes the same as ZIP codes?',
    a: "Nepal uses the term 'postal code' rather than 'ZIP code' (which is a US term), but they serve the same purpose. Nepal postal codes are 5 digits and can be used in the postal/ZIP code field on international address forms and e-commerce websites when shipping to Nepal.",
  },
];

export default async function HomePage() {
  const provinces = await getAllProvinces();

  const entries: SearchEntry[] = provinces.flatMap(p =>
    p.districts.flatMap(d =>
      d.locations.map(l => ({
        locationName: l.name,
        postalCode: l.postalCode,
        districtName: d.name,
        districtSlug: d.slug,
        provinceName: p.provinceName,
        provinceSlug: p.provinceSlug,
        href: `/province/${p.provinceSlug}/${d.slug}/${l.postalCode}`,
      }))
    )
  );

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Nepal Postal Code Directory</h1>
          <p className="hero-sub">Find the postal code for any location in Nepal — all 7 provinces, 77 districts</p>
          <SearchClient entries={entries} />
        </div>
      </section>

      <section id="provinces" className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          Browse by Province
        </h2>
        <div className="province-grid">
          {provinces.map(p => {
            const info = PROVINCE_INFO[p.provinceSlug];
            return (
              <Link key={p.provinceSlug} href={`/province/${p.provinceSlug}`} className="province-card">
                <div className="province-card-num">Province No. {p.provinceNum}</div>
                <div className="province-card-name">{p.provinceName}</div>
                {info && <div className="province-card-capital">Capital: {info.capital}</div>}
                <div className="province-card-stats">
                  <span>{p.totalDistricts} Districts</span>
                  <span>{totalLocations(p)} Post Offices</span>
                </div>
                <div className="province-card-range">Codes: {postalRange(p)}</div>
                <div className="province-card-arrow">Browse Districts →</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-alt">
        <h2 className="section-heading">
          <div className="accent-bar" />
          How to Find Your Nepal Postal Code
        </h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">1</div>
            <div className="step-title">Search or Select Province</div>
            <p className="step-desc">Type your location in the search box, or choose one of Nepal&apos;s 7 provinces from the cards above.</p>
          </div>
          <div className="step-card">
            <div className="step-num">2</div>
            <div className="step-title">Choose Your District</div>
            <p className="step-desc">Browse the districts within your province to narrow down to your area. Each district lists all its post offices.</p>
          </div>
          <div className="step-card">
            <div className="step-num">3</div>
            <div className="step-title">Get Your Postal Code</div>
            <p className="step-desc">Find your specific locality and copy its 5-digit Nepal postal code for addressing letters and parcels.</p>
          </div>
        </div>
      </section>

      <div className="section">
        <Faq items={HOME_FAQS} title="Frequently Asked Questions — Nepal Postal Codes" />
      </div>
    </>
  );
}
