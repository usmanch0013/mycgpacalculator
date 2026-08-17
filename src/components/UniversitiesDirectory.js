"use client";

import { useMemo, useState } from 'react';
import {
  UNIVERSITIES,
  COUNTRIES,
  getUniversityMeta,
} from '@/lib/universities';

export default function UniversitiesDirectory({ initialCountry = 'All' }) {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState(initialCountry);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return UNIVERSITIES.filter((uni) => {
      const matchesCountry = country === 'All' || uni.country === country;
      if (!matchesCountry) return false;
      if (!q) return true;
      return (
        uni.name.toLowerCase().includes(q) ||
        uni.shortName.toLowerCase().includes(q) ||
        uni.country.toLowerCase().includes(q) ||
        uni.system.toLowerCase().includes(q) ||
        uni.type.toLowerCase().includes(q)
      );
    });
  }, [query, country]);

  const counts = useMemo(() => {
    const c = { All: UNIVERSITIES.length };
    COUNTRIES.filter((x) => x !== 'All').forEach((country) => {
      c[country] = UNIVERSITIES.filter((u) => u.country === country).length;
    });
    return c;
  }, []);

  return (
    <>
      <div className="uni-directory-toolbar">
        <div className="uni-search-wrap">
          <svg className="uni-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="uni-search-input"
            placeholder="Search by name, country, or grading system…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search universities"
          />
        </div>

        <div className="uni-filter-tabs" role="tablist" aria-label="Filter by country">
          {COUNTRIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={country === c}
              className={`uni-filter-tab ${country === c ? 'active' : ''}`}
              onClick={() => setCountry(c)}
            >
              {c}
              <span className="uni-filter-count">{counts[c]}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="uni-results-count">
        Showing <strong>{filtered.length}</strong> of {UNIVERSITIES.length} supported universities
      </p>

      {filtered.length === 0 ? (
        <div className="uni-empty">
          <p>No universities match your search.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { setQuery(''); setCountry('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="uni-grid">
          {filtered.map((uni) => {
            const meta = getUniversityMeta(uni);
            return (
              <article key={uni.slug} className="uni-card">
                <div className="uni-card-top">
                  <span className="uni-country">{uni.country}</span>
                  <span className="uni-type-badge">{uni.type}</span>
                </div>
                <h2 className="uni-name">
                  <a href={meta.calculatorLink}>{uni.name}</a>
                </h2>
                <p className="uni-desc">{uni.desc}</p>
                <div className="uni-meta-row">
                  <span className="uni-meta-tag">{meta.scale} scale</span>
                  <span className="uni-meta-tag">{uni.system}</span>
                </div>
                <div className="uni-footer">
                  <a href={meta.calculatorLink} className="uni-link">Open Calculator →</a>
                  <span className="uni-est">{uni.shortName}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
