import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import InternalLinkHub from '@/components/InternalLinkHub';
import CalculatorTabs from '@/components/CalculatorTabs';
import {
  UNIVERSITIES,
  getUniversityBySlug,
  getUniversityMeta,
  getUniversityCalculatorLink,
} from '@/lib/universities';
import {
  getUniversityPageTitle,
  getUniversityPageDescription,
  getUniversityPageH1,
  getUniversitySeoContent,
  getUniversityKeywords,
  getRelatedUniversities,
  getUniversityGuideLinks,
} from '@/lib/universityContent';
import { getCalculatorPageLinkGroups, getCountryHubLink } from '@/lib/internalLinks';
import { buildPageMetadata, buildUniversityJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import CalculatorUsageGuide from '@/components/calculator/CalculatorUsageGuide';
import { getCalculatorUsageGuide } from '@/lib/calculatorUsageGuide';
import { GRADING_SYSTEMS } from '@/lib/gradingSystems';

export async function generateStaticParams() {
  return UNIVERSITIES.map((uni) => ({ slug: uni.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const uni = getUniversityBySlug(slug);
  if (!uni) return { title: 'University Not Found', robots: { index: false } };
  return {
    ...buildPageMetadata({
      title: getUniversityPageTitle(uni),
      description: getUniversityPageDescription(uni),
      path: `/calculator/${slug}`,
    }),
    keywords: getUniversityKeywords(uni),
  };
}

export default async function UniversityCalculatorPage({ params }) {
  const { slug } = await params;
  const uni = getUniversityBySlug(slug);
  if (!uni) notFound();

  const meta = getUniversityMeta(uni);
  const content = getUniversitySeoContent(uni);
  const related = getRelatedUniversities(uni, UNIVERSITIES);
  const guideLinks = getUniversityGuideLinks(uni, related);
  const usageGuide = getCalculatorUsageGuide(uni);
  const grades = GRADING_SYSTEMS[uni.system]?.grades ?? [];
  const calcPath = `/calculator/${slug}`;
  const pageJsonLd = buildUniversityJsonLd(uni, content, calcPath);

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <Navbar />
      <main id="main-content">
        <section className="uni-calc-shell" aria-labelledby="uni-calc-page-title">
          <div className="container">
            <div className="uni-calc-shell__inner">
              <header className="uni-calc-hero">
                <Breadcrumbs
                  items={[
                    { href: '/', label: 'Home' },
                    { href: '/universities', label: 'Universities' },
                    { href: getCountryHubLink(uni.country), label: uni.country },
                    { label: `${uni.shortName} Calculator` },
                  ]}
                />
                <div className="uni-calc-hero-badge-row">
                  <span className="badge">{uni.country}</span>
                  <span className="uni-type-badge">{uni.type}</span>
                  <span className="uni-meta-tag">{meta.scale} scale</span>
                </div>
                <h1 id="uni-calc-page-title" className="uni-calc-title">
                  {getUniversityPageH1(uni)}
                </h1>
                <p className="uni-calc-subtitle">
                  Free {uni.shortName} CGPA calculator — calculate semester GPA, cumulative CGPA, and convert CGPA to percentage using {uni.name}&apos;s official grading system. No signup required.
                </p>
              </header>

              <Suspense
                fallback={
                  <div className="uni-calc-loading" role="status">
                    Loading calculator…
                  </div>
                }
              >
                <CalculatorTabs
                  initialSystem={uni.system}
                  lockSystem
                  university={uni}
                  openGradingTable
                />
              </Suspense>
            </div>
          </div>
        </section>

        <CalculatorUsageGuide guide={usageGuide} />

        <section className="uni-calc-content">
          <div className="container">
            <div className="uni-calc-content-grid">
              <article className="page-content-card legal-content">
                <p className="uni-calc-updated">
                  Last updated: September 2026 · {uni.type} · {uni.country}
                </p>

                <h2>About the {uni.shortName} CGPA Calculator</h2>
                {uni.desc && <p>{uni.desc}</p>}
                <p>
                  {content.intro}{' '}
                  Wrong scale?{' '}
                  <Link href="/contact">Tell us</Link> — or browse more{' '}
                  <Link href={getCountryHubLink(uni.country)}>{uni.country} calculators</Link>.
                </p>

                {content.context && (
                  <>
                    <h2>What {uni.shortName} students should know</h2>
                    <p>{content.context}</p>
                  </>
                )}

                <h2>How to use this calculator</h2>
                <ol className="uni-steps-list">
                  {content.howTo.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <h2>{uni.shortName} grading system</h2>
                <p>{content.gradingNote}</p>
                <p>
                  The math behind semester GPA and cumulative CGPA is the same across most universities — see our{' '}
                  <Link href={guideLinks.formulaHref}>CGPA formula guide</Link> for a worked example. For broader
                  planning tips, read the{' '}
                  <Link href={guideLinks.guideHref}>complete CGPA guide</Link> on the homepage or browse{' '}
                  <Link href={guideLinks.blogHref}>student articles on the blog</Link>.
                </p>

                <div className="seo-callout">
                  <h3 className="seo-callout-title">Percentage conversion</h3>
                  <p>{content.percentageNote}</p>
                </div>

                {guideLinks.peers.length > 0 && (
                  <>
                    <h2>Related {uni.country} calculators</h2>
                    <p>
                      {uni.type} students in {uni.country} often compare grades with peers at other campuses. You may
                      also want the{' '}
                      {guideLinks.peers.map((peer, i) => (
                        <span key={peer.href}>
                          {i > 0 && (i === guideLinks.peers.length - 1 ? ', and ' : ', ')}
                          <Link href={peer.href}>{peer.label}</Link>
                        </span>
                      ))}
                      . View every {uni.country} tool on the{' '}
                      <Link href={guideLinks.countryHub}>{uni.country} university hub</Link> or the full{' '}
                      <Link href={guideLinks.directoryHref}>61-university directory</Link>.
                    </p>
                  </>
                )}

                <h2>Frequently asked questions</h2>
                <div className="uni-calc-faq">
                  {content.faqs.map((faq, i) => (
                    <details key={i} className="faq-item">
                      <summary className="faq-summary">{faq.q}</summary>
                      <div className="faq-content">{faq.a}</div>
                    </details>
                  ))}
                </div>
              </article>

              <aside className="uni-calc-sidebar">
                <div className="info-card">
                  <h3>Grading scale</h3>
                  <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {meta.systemName}
                  </p>
                  <table className="data-table">
                    <thead>
                      <tr><th>Grade</th><th>Points</th></tr>
                    </thead>
                    <tbody>
                      {grades.slice(0, 8).map((g, i) => (
                        <tr key={i}>
                          <td><strong>{g.label}</strong></td>
                          <td>{g.value.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {grades.length > 8 && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.75rem' }}>
                      + {grades.length - 8} more grades in calculator above
                    </p>
                  )}
                </div>

                {related.length > 0 && (
                  <div className="info-card">
                    <h3>Related calculators</h3>
                    <ul className="related-uni-list">
                      {related.map((r) => (
                        <li key={r.slug}>
                          <Link href={getUniversityCalculatorLink(r.slug)}>
                            {r.shortName} CGPA Calculator →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="info-card info-card--muted">
                  <h3>Disclaimer</h3>
                  <p>
                    Results are for planning purposes. Always verify with your official {uni.shortName} transcript
                    or registrar before submitting grades for scholarships or applications.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <InternalLinkHub
          title={`More ${uni.shortName} & related calculators`}
          groups={getCalculatorPageLinkGroups(uni)}
          variant="muted"
        />
      </main>
      <Footer />
    </>
  );
}
