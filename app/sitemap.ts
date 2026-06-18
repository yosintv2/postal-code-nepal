import type { MetadataRoute } from 'next';
import { getAllProvinces } from '@/lib/postal';

export const dynamic = 'force-static';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://postal.singhyogendra.com.np';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const provinces = await getAllProvinces();
  const now = new Date();

  const urls: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
  ];

  for (const province of provinces) {
    urls.push({
      url: `${BASE_URL}/province/${province.provinceSlug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    });

    for (const district of province.districts) {
      urls.push({
        url: `${BASE_URL}/province/${province.provinceSlug}/${district.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
      });

      for (const loc of district.locations) {
        urls.push({
          url: `${BASE_URL}/province/${province.provinceSlug}/${district.slug}/${loc.postalCode}`,
          lastModified: now,
          changeFrequency: 'yearly',
          priority: 0.7,
        });
      }
    }
  }

  return urls;
}
