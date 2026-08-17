import Link from 'next/link';

export default function RegionBanner() {
  return (
    <section className="region-banner">
      <div className="container region-banner-inner">
        <div className="region-banner-text">
          <span className="badge" style={{ marginBottom: '0.75rem' }}>UK &amp; Europe</span>
          <h2 className="region-banner-title">Oxford, Cambridge, TUM &amp; other EU scales</h2>
          <p>
            Honours classifications, ECTS letter grades, and the German 1.0–5.0 system work differently from a
            straight 4.0 GPA. We added calculators that match how those universities actually grade.
          </p>
        </div>
        <Link href="/universities/uk-europe" className="btn btn-primary">
          Browse UK &amp; Europe →
        </Link>
      </div>
    </section>
  );
}
