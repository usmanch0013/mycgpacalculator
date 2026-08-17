import Link from 'next/link';

export default function MalaysiaBanner() {
  return (
    <section className="region-banner region-banner--my">
      <div className="container region-banner-inner">
        <div className="region-banner-text">
          <span className="badge" style={{ marginBottom: '0.75rem' }}>Malaysia</span>
          <h2 className="region-banner-title">UTM, UiTM, UTAR, UPM &amp; STPM calculators</h2>
          <p>
            Studying at a Malaysian IPTA or doing STPM? We added calculators with the 4.0 scales most local students
            actually use — so you are not guessing grade points from a screenshot on WhatsApp.
          </p>
        </div>
        <Link href="/universities/malaysia" className="btn btn-primary">
          Browse Malaysia →
        </Link>
      </div>
    </section>
  );
}
