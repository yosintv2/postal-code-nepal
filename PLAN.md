# PostalNP — Nepal Postal Code Directory

## Project Overview

A fully SEO-optimized Next.js 15 website for finding Nepal postal codes, organized by province → district → locality. Styled after CricFoot (cfnet-main) with a crimson/navy Nepal theme and a P² logo.

---

## Data Source

**API:** `https://api.singhyogendra.com.np/postal/p{1-7}.json`

### Province Map

| Num | Province | Slug | Capital | Former Name |
|-----|----------|------|---------|-------------|
| 1 | Koshi Province | `koshi` | Biratnagar | Province No. 1 |
| 2 | Madhesh Province | `madhesh` | Janakpur | Province No. 2 |
| 3 | Bagmati Province | `bagmati` | Kathmandu | Province No. 3 |
| 4 | Gandaki Province | `gandaki` | Pokhara | Province No. 4 |
| 5 | Lumbini Province | `lumbini` | Deukhuri/Butwal | Province No. 5 |
| 6 | Karnali Province | `karnali` | Birendranagar | Province No. 6 |
| 7 | Sudurpashchim Province | `sudurpashchim` | Dhangadhi | Province No. 7 |

### API Data Structures

**Format A** — Provinces 1–4: Object-based nesting
```json
{
  "province": "Koshi Province (Province No. 1)",
  "country": "Nepal",
  "total_districts": 14,
  "postal_codes": {
    "DistrictName": {
      "LocationName": "PostalCode"
    }
  }
}
```

**Format B** — Provinces 5–7: Array-based structure
```json
{
  "province": "Lumbini Province (Province 5)",
  "postal_codes": [
    {
      "district": "DistrictName",
      "post_offices": [
        { "name": "LocationName", "code": 32900, "type": "DPO" }
      ]
    }
  ]
}
```

Both formats are normalized into a unified `ProvinceData` interface by `lib/postal.ts`.

---

## URL Structure

```
/                                              → Homepage (all provinces + search)
/province/[province-slug]/                     → Province page (all districts)
/province/[province-slug]/[district-slug]/     → District page (all post offices)
/province/[province-slug]/[district-slug]/[postal-code]/  → Postal code detail page
```

**Example URLs:**
```
/province/koshi/
/province/koshi/bhojpur/
/province/koshi/bhojpur/57000/
/province/bagmati/kathmandu/44600/
```

---

## Page Content

### Homepage (`/`)
- Hero search: live client-side filtering across all ~1000+ postal codes
- Province cards grid: 7 cards with stats (districts, post offices, code range)
- "How to find your postal code" 3-step guide
- FAQ: 5 Nepal postal system questions

### Province Page (`/province/[slug]`)
- Province name, capital, former name, stats
- District grid (all districts with DPO code + count)
- Other Provinces widget (cross-province links)
- FAQ: 5 province-specific questions (dynamic)

### District Page (`/province/[slug]/[district]`)
- District + province name
- Full postal code table (DPO highlighted in amber)
- Other Districts in same province (internal links)
- Other Provinces widget
- FAQ: 5 district-specific questions (dynamic)

### Postal Code Page (`/province/[slug]/[district]/[postal]`)
- Large postal code display + type badge (DPO / APO)
- Location info card (name, district, province, country)
- Address format example box
- Nearby post offices (same district, up to 10)
- Other Provinces widget
- FAQ: 6 location-specific questions (dynamic)

---

## SEO Features

### Per-page Metadata
- Unique `<title>` and `<meta description>` for every page
- Canonical URL
- Open Graph + Twitter Card

### JSON-LD Schema
| Page | Schema Types |
|------|-------------|
| Homepage | WebSite + Organization + SearchAction |
| Province | Place + BreadcrumbList |
| District | Place + BreadcrumbList |
| Postal Code | PostalAddress + FAQPage + BreadcrumbList |

### Other
- `sitemap.xml` — auto-generated from API data (all pages)
- `robots.txt` — allows all, links sitemap
- Inter font from Google Fonts

---

## Tech Stack

- **Next.js 15** — App Router, Static Export (`output: 'export'`)
- **React 19**
- **TypeScript 5**
- **Pure CSS** — no Tailwind, all in `app/globals.css`
- **No client-side JS** except the homepage search component

---

## Internal Linking Strategy

Each page links to:
1. **Same level:** Other districts in same province (district page), other nearby codes (postal page)
2. **Parent level:** Province page, homepage (breadcrumbs)
3. **Cross-province:** All other provinces (province pills on every page)

This creates a dense internal link graph benefiting SEO crawlability.

---

## FAQ Strategy

### Homepage (static)
1. What is a postal code in Nepal?
2. How many provinces does Nepal have postal codes for?
3. How do I find my postal code in Nepal?
4. What does D.P.O. mean?
5. Are Nepal postal codes the same as ZIP codes?

### Province page (dynamic, uses real data)
1. What are the postal codes in [Province]?
2. How many districts are in [Province]?
3. What is the capital of [Province]?
4. What was [Province] formerly called?
5. How do I find a postal code in [Province]?

### District page (dynamic)
1. What is the postal code of [District]?
2. Which province is [District] in?
3. How many post offices are in [District]?
4. What is the D.P.O. postal code of [District]?
5. How do I use the [District] postal code?

### Postal code page (dynamic)
1. What is the postal code of [Location]?
2. Which district is [Location] in?
3. Which province is [Location] in?
4. How do I write [Location]'s postal code in an address?
5. What does [DPO/APO] mean in Nepal's postal system?
6. What are other postal codes near [Location]?

---

## Branding

- **Brand name:** PostalNP
- **Logo:** P² text on crimson gradient rounded square SVG
- **Favicon:** `app/icon.svg` (same SVG, used by Next.js automatically)
- **Theme color:** `#c0392b` (crimson)
- **Primary accent:** `#1a3a6b` (navy)
- **Postal code badge:** `#d97706` (amber/gold)

---

## Color Palette

```css
--navy:      #1a3a6b   /* nav, links */
--navy-dark: #0d2040
--navy-mid:  #1e4d8c
--red:       #c0392b   /* Nepal crimson accent */
--red-dark:  #96281b
--gold:      #d97706   /* postal code badges */
--gold-light:#fef3c7
--bg:        #ffffff
--bg-alt:    #f5f7fa
--bg-section:#e8ecf3
--border:    #d1d5db
--text:      #1a202c
--text-muted:#6b7280
```

---

## File Structure

```
postal/
├── PLAN.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── types/
│   └── postal.ts          # TypeScript interfaces
├── lib/
│   ├── utils.ts           # toSlug, fromSlug
│   └── postal.ts          # Data fetching + normalization
├── components/
│   ├── Logo.tsx           # P² SVG logo
│   ├── Navbar.tsx         # 3-row nav (logo, main links, province links)
│   ├── Footer.tsx         # Province links + quick links
│   ├── Faq.tsx            # FAQPage schema accordion
│   ├── Breadcrumb.tsx     # BreadcrumbList schema
│   └── SearchClient.tsx   # Client-side postal code search
├── app/
│   ├── globals.css        # All styles (adapted from cfnet)
│   ├── icon.svg           # P² favicon
│   ├── layout.tsx         # Root layout + WebSite schema
│   ├── page.tsx           # Homepage
│   ├── not-found.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── province/
│       └── [province]/
│           ├── page.tsx
│           └── [district]/
│               ├── page.tsx
│               └── [postal]/
│                   └── page.tsx
└── public/
    └── site.webmanifest
```

---

## Deployment

Build: `npm run build` → generates `out/` directory (static HTML)
Deploy: Upload `out/` to any static host (Vercel, Netlify, GitHub Pages, S3)

Environment variables:
- `NEXT_PUBLIC_SITE_URL` — set to production domain (e.g. `https://www.postalcodenp.com`)
