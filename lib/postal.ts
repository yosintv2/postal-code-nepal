import { toSlug } from './utils';
import type { District, Location, ProvinceData } from '@/types/postal';

interface RawFormatA {
  province: string;
  former_name?: string;
  country?: string;
  total_districts?: number;
  postal_code_range?: string;
  postal_codes: Record<string, Record<string, string>>;
}

interface RawFormatB {
  province: string;
  postal_codes: Array<{
    district: string;
    post_offices: Array<{ name: string; code: number; type: string }>;
  }>;
}

export const PROVINCE_SLUGS: Record<number, string> = {
  1: 'koshi',
  2: 'madhesh',
  3: 'bagmati',
  4: 'gandaki',
  5: 'lumbini',
  6: 'karnali',
  7: 'sudurpashchim',
};

export const PROVINCE_SLUG_TO_NUM = Object.fromEntries(
  Object.entries(PROVINCE_SLUGS).map(([k, v]) => [v, Number(k)])
) as Record<string, number>;

export const PROVINCE_INFO: Record<string, { capital: string; formerName: string; region: string }> = {
  koshi:         { capital: 'Biratnagar',     formerName: 'Province No. 1', region: 'Eastern Nepal' },
  madhesh:       { capital: 'Janakpur',        formerName: 'Province No. 2', region: 'Southern-Central Nepal' },
  bagmati:       { capital: 'Kathmandu',       formerName: 'Province No. 3', region: 'Central Nepal' },
  gandaki:       { capital: 'Pokhara',         formerName: 'Province No. 4', region: 'Central-Western Nepal' },
  lumbini:       { capital: 'Deukhuri',        formerName: 'Province No. 5', region: 'Western-Central Nepal' },
  karnali:       { capital: 'Birendranagar',   formerName: 'Province No. 6', region: 'Mid-Western Nepal' },
  sudurpashchim: { capital: 'Dhangadhi',       formerName: 'Province No. 7', region: 'Far-Western Nepal' },
};

function isFormatB(raw: unknown): raw is RawFormatB {
  return Array.isArray((raw as { postal_codes?: unknown }).postal_codes);
}

function normalizeProvince(num: number, raw: RawFormatA | RawFormatB): ProvinceData {
  const slug = PROVINCE_SLUGS[num];

  if (isFormatB(raw)) {
    return {
      provinceNum: num,
      provinceName: raw.province,
      provinceSlug: slug,
      totalDistricts: raw.postal_codes.length,
      districts: raw.postal_codes.map(d => ({
        name: d.district,
        slug: toSlug(d.district),
        locations: d.post_offices.map(po => ({
          name: po.name,
          slug: toSlug(po.name),
          postalCode: String(po.code),
          type: po.type as Location['type'],
        })),
      })),
    };
  }

  const postalCodes = (raw as RawFormatA).postal_codes;
  return {
    provinceNum: num,
    provinceName: (raw as RawFormatA).province,
    provinceSlug: slug,
    totalDistricts: (raw as RawFormatA).total_districts ?? Object.keys(postalCodes).length,
    districts: Object.entries(postalCodes).map(([distName, locs]) => ({
      name: distName,
      slug: toSlug(distName),
      locations: Object.entries(locs).map(([locName, code]) => ({
        name: locName,
        slug: toSlug(locName),
        postalCode: code,
      })),
    })),
  };
}

const _cache = new Map<number, ProvinceData>();

async function fetchProvince(num: number): Promise<ProvinceData> {
  if (_cache.has(num)) return _cache.get(num)!;
  const res = await fetch(
    `https://api.singhyogendra.com.np/postal/p${num}.json`,
    { cache: 'force-cache' }
  );
  if (!res.ok) throw new Error(`Province ${num}: ${res.status}`);
  const raw = await res.json();
  const data = normalizeProvince(num, raw);
  _cache.set(num, data);
  return data;
}

export async function getAllProvinces(): Promise<ProvinceData[]> {
  return Promise.all([1, 2, 3, 4, 5, 6, 7].map(fetchProvince));
}

export async function getProvince(slug: string): Promise<ProvinceData | null> {
  const num = PROVINCE_SLUG_TO_NUM[slug];
  if (!num) return null;
  try { return await fetchProvince(num); }
  catch { return null; }
}

export function getDistrict(province: ProvinceData, districtSlug: string): District | null {
  return province.districts.find(d => d.slug === districtSlug) ?? null;
}

export function getLocation(district: District, postalCode: string): Location | null {
  return district.locations.find(l => l.postalCode === postalCode) ?? null;
}

export function totalLocations(province: ProvinceData): number {
  return province.districts.reduce((sum, d) => sum + d.locations.length, 0);
}

export function postalRange(province: ProvinceData): string {
  const all = province.districts
    .flatMap(d => d.locations.map(l => Number(l.postalCode)))
    .filter(n => !isNaN(n));
  if (!all.length) return 'N/A';
  return `${Math.min(...all)}–${Math.max(...all)}`;
}
