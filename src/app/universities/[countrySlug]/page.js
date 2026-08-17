import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import UniversitiesDirectory from '@/components/UniversitiesDirectory';
import InternalLinkHub from '@/components/InternalLinkHub';
import CountryQuickNav from '@/components/CountryQuickNav';
import {
  COUNTRY_SLUGS,
  getCountryFromSlug,
  getCountryPageLinkGroups,
} from '@/lib/internalLinks';
import { UNIVERSITIES } from '@/lib/universities';
import { buildPageMetadata, buildCountryCollectionSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export async function generateStaticParams() {
  return Object.keys(COUNTRY_SLUGS).map((countrySlug) => ({ countrySlug }));
}

import { getCountryKeywordMeta } from '@/lib/keywordSeo';

export async function generateMetadata({ params }) {
  const { countrySlug } = await params;
  const country = getCountryFromSlug(countrySlug);
  if (!country) return { title: 'Not Found', robots: { index: false } };
  const keywordMeta = getCountryKeywordMeta(countrySlug);
  const count = UNIVERSITIES.filter((u) => u.country === country).length;
  return buildPageMetadata({
    title: keywordMeta?.title ?? `${country} University CGPA Calculators`,
    description:
      keywordMeta?.description ??
      `Free CGPA and GPA calculators for ${count} ${country} universities. Pre-loaded grading scales — calculate semester GPA and cumulative CGPA instantly.`,
    path: `/universities/${countrySlug}`,
  });
}

export default async function CountryUniversitiesPage({ params }) {
  const { countrySlug } = await params;
  const country = getCountryFromSlug(countrySlug);
  if (!country) notFound();

  const count = UNIVERSITIES.filter((u) => u.country === country).length;
  const keywordMeta = getCountryKeywordMeta(countrySlug);
  const pageH1 = keywordMeta?.h1 ?? `${country} CGPA Calculators`;

  return (
    <>
      <JsonLd data={buildCountryCollectionSchema(country, countrySlug, UNIVERSITIES)} />
      <Navbar />
      <main id="main-content" className="uni-directory-page">
        <div className="container">
          <Breadcrumbs
            items={[
              { href: '/', label: 'Home' },
              { href: '/universities', label: 'Universities' },
              { label: country },
            ]}
          />
          <header className="uni-directory-header">
            <div className="badge" style={{ marginBottom: '1rem' }}>{country}</div>
            <h1 className="section-title">{pageH1}</h1>
            <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
              {count} free {country} CGPA calculators with pre-loaded grading scales — calculate semester GPA, cumulative CGPA, and CGPA to percentage.
            </p>
            <CountryQuickNav activeCountry={countrySlug} />
          </header>

          <UniversitiesDirectory initialCountry={country} />

          <div className="uni-directory-note">
            <h2>Using the right {country} grading scale</h2>
            <p>
              Universities in {country} don&apos;t all share one formula. Pick your institution below for an
              accurate calculator, or read our{' '}
              <a href="/#guide">complete CGPA guide</a> to understand SGPA vs CGPA and percentage conversions.
            </p>
          </div>
        </div>

        <InternalLinkHub
          title={`More ${country} & global calculators`}
          groups={getCountryPageLinkGroups(country)}
          variant="muted"
        />
      </main>
      <Footer />
    </>
  );
}
