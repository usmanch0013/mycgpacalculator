import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InternalLinkHub from '@/components/InternalLinkHub';
import { getHomepageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist. Browse CGPA Calculator Pro calculators or return to the homepage.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="container page-body" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
          <article className="page-content-card legal-content text-center">
            <p className="badge" style={{ display: 'inline-block', marginBottom: '1rem' }}>404</p>
            <h1 className="page-hero-title">Page not found</h1>
            <p>
              That URL does not exist. Try the homepage calculator, browse universities, or use the links below.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/" className="btn btn-primary btn-sm">Go to homepage</Link>
              <Link href="/universities" className="btn btn-outline btn-sm">All universities</Link>
            </div>
          </article>
        </div>
        <InternalLinkHub
          title="Popular calculators"
          groups={getHomepageLinkGroups()}
          variant="muted"
        />
      </main>
      <Footer />
    </>
  );
}
