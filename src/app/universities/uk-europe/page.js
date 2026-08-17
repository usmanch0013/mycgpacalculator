import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CountryQuickNav from '@/components/CountryQuickNav';
import InternalLinkHub from '@/components/InternalLinkHub';
import { getUniversitiesPageLinkGroups } from '@/lib/internalLinks';
import { getUkEuropeUniversities, getUniversityCalculatorLink } from '@/lib/universities';
import { GRADING_SYSTEMS, getCalculatorLink } from '@/lib/gradingSystems';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'UK & Europe CGPA Calculators',
  description:
    'Free CGPA, honours classification, ECTS, and German grade calculators for Oxford, Cambridge, TUM, TU Delft, Sorbonne, and more European universities.',
  path: '/universities/uk-europe',
});

export default function UkEuropePage() {
  const universities = getUkEuropeUniversities();
  const systems = ['UK Honours', 'ECTS Europe', 'German Scale', 'US 4.0 Scale'];

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-shell">
        <header className="page-hero page-hero--uk">
          <div className="container">
            <Breadcrumbs
              items={[
                { href: '/', label: 'Home' },
                { href: '/universities', label: 'Universities' },
                { label: 'UK & Europe' },
              ]}
            />
            <CountryQuickNav />
            <h1 className="page-hero-title">UK &amp; Europe Calculators</h1>
            <p className="page-hero-subtitle">
              Studying at Oxford, TUM, or TU Delft? We built grading scales for UK honours classifications,
              ECTS European grades, and the German 1.0–5.0 system — so your CGPA math is actually correct.
            </p>
          </div>
        </header>

        <div className="container page-body">
          <div className="uk-systems-row">
            {systems.map((key) => (
              <a key={key} href={getCalculatorLink(key)} className="uk-system-card">
                <span className="uk-system-scale">{GRADING_SYSTEMS[key].scale}</span>
                <strong>{key}</strong>
                <span>Open calculator →</span>
              </a>
            ))}
          </div>

          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            {universities.length} supported institutions
          </h2>
          <div className="uni-grid">
            {universities.map((uni) => (
              <article key={uni.slug} className="uni-card">
                <div className="uni-card-top">
                  <span className="uni-country">{uni.country}</span>
                  <span className="uni-type-badge">{uni.type}</span>
                </div>
                <h3 className="uni-name">{uni.name}</h3>
                <p className="uni-desc">{uni.desc}</p>
                <div className="uni-footer">
                  <a href={getUniversityCalculatorLink(uni.slug)} className="uni-link">Open Calculator →</a>
                  <span className="uni-est">{uni.shortName}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="page-content-card legal-content" style={{ marginTop: '3rem' }}>
            <h2>Understanding UK &amp; European grading</h2>
            <p>
              Unlike South Asia&apos;s fixed GPA scales, UK universities often award a <strong>degree classification</strong> —
              First Class, Upper Second (2:1), Lower Second (2:2), or Third — based on your weighted average across all years.
            </p>
            <p>
              European universities under the Bologna Process use <strong>ECTS credits</strong> and letter grades from A to F.
              German universities use an inverted numeric scale where <strong>1.0 is the best</strong> and 4.0 is a pass.
            </p>
            <p>
              When applying for jobs or masters programmes abroad, you may need to convert between these systems.
              Our calculators use publicly documented grade boundaries — but always confirm with your registrar for official conversions.
            </p>
            <p>
              Missing your university? <Link href="/contact">Contact us</Link> and we&apos;ll add it within a few days.
              Also browse <Link href="/universities/bangladesh">Bangladesh</Link>,{' '}
              <Link href="/universities/india">India</Link>, and{' '}
              <Link href="/#guide">our CGPA guide</Link>.
            </p>
          </div>
        </div>

        <InternalLinkHub
          title="More calculators & regions"
          groups={getUniversitiesPageLinkGroups()}
          variant="muted"
        />
      </main>
      <Footer />
    </>
  );
}
