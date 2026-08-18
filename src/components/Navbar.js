import Logo from '@/components/Logo';
import { SITE_NAME } from '@/lib/seo';

export default function Navbar() {
  return (
    <header className="nav-header">
      <div className="container nav-container">
        <a href="/" className="nav-logo" aria-label={`${SITE_NAME} Home`}>
          <Logo />
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="/#calculator">Calculator</a>
          <a href="/universities">Universities</a>
          <a href="/universities/uk-europe">UK &amp; Europe</a>
          <a href="/about">About</a>
          <a href="/#faq">FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="/#calculator" className="btn btn-primary btn-sm">Calculate CGPA</a>
        </div>
      </div>
    </header>
  );
}
