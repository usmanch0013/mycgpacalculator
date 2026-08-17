import { getFeaturedUniversities, getUniversityMeta } from '@/lib/universities';
import CountryQuickNav from '@/components/CountryQuickNav';

export default function UniversityGrid() {
  const universities = getFeaturedUniversities();

  return (
    <section className="section bg-muted" id="universities">
      <div className="container">
        <div className="section-header">
          <div className="badge" style={{ marginBottom: '0.875rem' }}>Localized Calculation</div>
          <h2 className="section-title">Pick your university</h2>
          <p className="section-subtitle">
            Each page loads the grading table that school uses — so you are not forcing a generic scale onto BRAC, SRM, or UTM.
          </p>
        </div>

        <CountryQuickNav />

        <div className="uni-grid">
          {universities.map((uni) => {
            const meta = getUniversityMeta(uni);
            return (
              <article key={uni.slug} className="uni-card">
                <div className="uni-country">{uni.country}</div>
                <h3 className="uni-name">
                  <a href={meta.calculatorLink}>{uni.name}</a>
                </h3>
                <p className="uni-desc">{uni.desc}</p>
                <div className="uni-footer">
                  <a href={meta.calculatorLink} className="uni-link">Open Calculator →</a>
                  <span className="uni-est">{uni.shortName}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center" style={{ marginTop: '1.5rem' }}>
          <a href="/universities" className="btn btn-outline btn-sm">Browse all supported universities</a>
          <a href="/universities/bangladesh" className="btn btn-outline btn-sm" style={{ marginLeft: '0.75rem' }}>Bangladesh →</a>
          <a href="/universities/malaysia" className="btn btn-outline btn-sm" style={{ marginLeft: '0.75rem' }}>Malaysia →</a>
          <a href="/universities/uk-europe" className="btn btn-outline btn-sm" style={{ marginLeft: '0.75rem' }}>UK &amp; Europe →</a>
        </div>
      </div>
    </section>
  );
}
