import Link from 'next/link';
import Logo from '@/components/Logo';
import { SITE_NAME, SITE_EMAIL } from '@/lib/seo';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <Link href="/" className="footer-brand-link" aria-label={`${SITE_NAME} Home`}>
              <span className="footer-brand">
                <Logo variant="full" className="logo--footer" />
              </span>
            </Link>
            <p className="footer-desc">
              Free CGPA calculators with your university grading scale built in. No signup — everything runs in your browser.
            </p>
            <a href={`mailto:${SITE_EMAIL}`} className="footer-email">
              {SITE_EMAIL}
            </a>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Explore</h4>
            <nav className="footer-links" aria-label="Site navigation">
              <Link href="/#calculator">CGPA Calculator</Link>
              <Link href="/blog">Blog &amp; guides</Link>
              <Link href="/#guide">How it works</Link>
              <Link href="/universities">All universities</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Regions</h4>
            <nav className="footer-links" aria-label="Regional hubs">
              <Link href="/universities/bangladesh">Bangladesh</Link>
              <Link href="/universities/india">India</Link>
              <Link href="/universities/pakistan">Pakistan</Link>
              <Link href="/universities/malaysia">Malaysia</Link>
              <Link href="/universities/uk-europe">UK &amp; Europe</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Popular</h4>
            <nav className="footer-links" aria-label="Popular calculators">
              <Link href="/calculator/srm-university">SRM CGPA</Link>
              <Link href="/calculator/north-south-university">NSU CGPA</Link>
              <Link href="/calculator/brac-university">BRACU CGPA</Link>
              <Link href="/calculator/vit-vellore">VIT CGPA</Link>
              <Link href="/calculator/utm">UTM CGPA</Link>
            </nav>
          </div>

          <div className="footer-col">
            <h4 className="footer-title">Legal</h4>
            <nav className="footer-links" aria-label="Legal pages">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/cookies">Cookie Policy</Link>
            </nav>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} {SITE_NAME}. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Legal links">
            <Link href="/privacy">Privacy</Link>
            <span className="footer-legal-sep" aria-hidden="true">·</span>
            <Link href="/terms">Terms</Link>
            <span className="footer-legal-sep" aria-hidden="true">·</span>
            <Link href="/cookies">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
