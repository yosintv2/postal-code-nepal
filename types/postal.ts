export interface Location {
  name: string;
  slug: string;
  postalCode: string;
  type?: 'DPO' | 'APO';
}

export interface District {
  name: string;
  slug: string;
  locations: Location[];
}

export interface ProvinceData {
  provinceNum: number;
  provinceName: string;
  provinceSlug: string;
  totalDistricts: number;
  districts: District[];
}

export interface SearchEntry {
  locationName: string;
  postalCode: string;
  districtName: string;
  districtSlug: string;
  provinceName: string;
  provinceSlug: string;
  href: string;
}
