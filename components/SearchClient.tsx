'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { SearchEntry } from '@/types/postal';

export default function SearchClient({ entries }: { entries: SearchEntry[] }) {
  const [q, setQ] = useState('');

  const results = useMemo(() => {
    const t = q.trim();
    if (t.length < 2) return [];
    const lower = t.toLowerCase();
    return entries
      .filter(e =>
        e.locationName.toLowerCase().includes(lower) ||
        e.postalCode.includes(lower) ||
        e.districtName.toLowerCase().includes(lower) ||
        e.provinceName.toLowerCase().includes(lower)
      )
      .slice(0, 12);
  }, [q, entries]);

  return (
    <div className="search-wrap">
      <div className="hero-search-box">
        <svg className="hero-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          className="hero-search"
          placeholder="Search postal code, location, or district…"
          value={q}
          onChange={e => setQ(e.target.value)}
          aria-label="Search Nepal postal codes"
          autoComplete="off"
        />
      </div>
      {results.length > 0 && (
        <div className="search-results" role="listbox">
          {results.map(r => (
            <Link key={r.href} href={r.href} className="search-result-item" role="option" onClick={() => setQ('')}>
              <span className="search-result-code">{r.postalCode}</span>
              <div className="search-result-text">
                <div className="search-result-name">{r.locationName}</div>
                <div className="search-result-meta">{r.districtName} · {r.provinceName}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {q.trim().length >= 2 && results.length === 0 && (
        <div className="search-empty">No results found for &ldquo;{q}&rdquo;</div>
      )}
    </div>
  );
}
