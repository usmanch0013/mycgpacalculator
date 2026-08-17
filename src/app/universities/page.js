import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import UniversitiesDirectory from '@/components/UniversitiesDirectory';
import InternalLinkHub from '@/components/InternalLinkHub';
import CountryQuickNav from '@/components/CountryQuickNav';
import { getUniversitiesPageLinkGroups } from '@/lib/internalLinks';
import { UNIVERSITIES } from '@/lib/universities';
import { buildPageMetadata, buildUniversitiesDirectorySchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = buildPageMetadata({
  title: 'All Supported Universities',
  description:
    'Browse 60+ university CGPA calculators on MyCGPA — Bangladesh, India, Pakistan, Malaysia, UK, and Europe. UTM, UiTM, SRM, NSU and more with official grading scales.',
  path: '/universities',
});

export default function UniversitiesPage() {
  return (
    <>
      <JsonLd data={buildUniversitiesDirectorySchema(UNIVERSITIES)} />
      <Navbar />
      <main id="main-content" className="uni-directory-page">
        <div className="container">
          <Breadcrumbs
            items={[
              { href: '/', label: 'Home' },
              { label: 'Universities' },
            ]}
          />
          <header className="uni-directory-header">
            <div className="badge" style={{ marginBottom: '1rem' }}>University Directory</div>
            <h1 className="section-title">All Supported Universities</h1>
            <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>
              {UNIVERSITIES.length} universities across Bangladesh, India, Pakistan, Malaysia, UK, and Europe —
              each mapped to the grading scale your institution actually uses.
              Pick yours, open the calculator, and we&apos;ll pre-select the right system for you.
            </p>
            <CountryQuickNav />
          </header>

          <UniversitiesDirectory />

          <div className="uni-directory-note">
            <h2>Don&apos;t see your university?</h2>
            <p>
              Many colleges under the same board share one grading scale — try the general scale for your country
              via our <a href="/universities/bangladesh">Bangladesh</a>,{' '}
              <a href="/universities/india">India</a>, or{' '}
              <a href="/universities/pakistan">Pakistan</a> hubs. Still stuck?{' '}
              <a href="/contact">Send us a message</a> and we&apos;ll add it.
            </p>
          </div>
        </div>

        <InternalLinkHub
          title="Popular calculators & regions"
          groups={getUniversitiesPageLinkGroups()}
          variant="muted"
        />
      </main>
      <Footer />
    </>
  );
}
