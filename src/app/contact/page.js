import ContactForm from '@/components/ContactForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import InternalLinkHub from '@/components/InternalLinkHub';
import { getLegalPageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Contact Us',
  description:
    'Reach the MyCGPA team — report bugs, request new universities, or ask about CGPA calculations and grading scales.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="page-shell">
        <header className="page-hero">
          <div className="container">
            <Breadcrumbs
              items={[
                { href: '/', label: 'Home' },
                { label: 'Contact' },
              ]}
            />
            <h1 className="page-hero-title">Get in touch</h1>
            <p className="page-hero-subtitle">
              Found a wrong grade scale? Need a new university added? Or just want to say thanks —
              we read every message and reply within a few days.
            </p>
          </div>
        </header>

        <div className="container page-body">
          <div className="contact-layout">
            <ContactForm />
            <aside className="contact-sidebar" aria-label="Contact information">
              <div className="info-card">
                <h2 className="info-card-heading">Direct email</h2>
                <p>
                  Prefer email? Write to{' '}
                  <a href="mailto:hello@mycgpa.com">hello@mycgpa.com</a>
                </p>
              </div>
              <div className="info-card">
                <h2 className="info-card-heading">Response time</h2>
                <p>Usually 2–3 business days. During exam season it may take a bit longer — we get it.</p>
              </div>
              <div className="info-card">
                <h2 className="info-card-heading">Before you write</h2>
                <p>
                  Check our <a href="/#faq">FAQ</a> and{' '}
                  <a href="/universities">university directory</a> — your answer might already be there.
                </p>
              </div>
              <div className="info-card info-card--muted">
                <h2 className="info-card-heading">What we cannot do</h2>
                <p>
                  We cannot change official transcripts, verify grades with your university, or provide
                  certified conversions for visa applications.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <InternalLinkHub
        title="More calculators"
        groups={getLegalPageLinkGroups()}
        variant="muted"
      />
      <Footer />
    </>
  );
}
