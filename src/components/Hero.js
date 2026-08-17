export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container animate-fade-up">
        <p className="badge" style={{ marginBottom: '1.25rem' }}>
          Free CGPA to Percentage Calculator
        </p>
        <h1 className="hero-title" id="hero-heading">
          Free CGPA Calculator — GPA, Percentage &amp; Semester Grades
        </h1>
        <p className="hero-subtitle">
          Pick your grading system, add your courses, and see your semester GPA or cumulative CGPA in seconds.
          Works for 60+ universities across Bangladesh, India, Pakistan, Malaysia, the UK, and Europe. No sign-up.
        </p>
        <div className="hero-actions">
          <a href="#calculator" className="btn btn-primary">
            Open CGPA Calculator
            <span aria-hidden="true">→</span>
          </a>
          <a href="/calculator/utm" className="btn btn-outline">
            UTM CGPA Calculator
          </a>
        </div>
        <nav className="hero-trust" aria-label="Popular CGPA calculators by region">
          <a href="/calculator/srm-university" className="hero-trust-item hero-trust-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            SRM CGPA Calculator
          </a>
          <a href="/calculator/utm" className="hero-trust-item hero-trust-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            UTM CGPA Calculator
          </a>
          <a href="/calculator/north-south-university" className="hero-trust-item hero-trust-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            NSU CGPA Calculator
          </a>
          <a href="/universities/malaysia" className="hero-trust-item hero-trust-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            Malaysia Calculators
          </a>
        </nav>
      </div>
    </section>
  );
}
