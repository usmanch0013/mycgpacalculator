import Breadcrumbs from './Breadcrumbs';
import Navbar from './Navbar';
import Footer from './Footer';
import InternalLinkHub from './InternalLinkHub';

export default function PageLayout({
  title,
  subtitle,
  lastUpdated = 'August 18, 2026',
  children,
  toc,
  linkGroups,
  breadcrumbItems,
}) {
  const crumbs = breadcrumbItems ?? [
    { href: '/', label: 'Home' },
    { label: title },
  ];

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-shell">
        <header className="page-hero">
          <div className="container">
            <Breadcrumbs items={crumbs} />
            <h1 className="page-hero-title">{title}</h1>
            {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
            <p className="page-hero-meta">Last updated: {lastUpdated}</p>
          </div>
        </header>

        <div className="container page-body">
          <div className={`page-content-layout ${toc ? 'has-toc' : ''}`}>
            {toc && (
              <aside className="page-toc">
                <p className="page-toc-label">On this page</p>
                <nav aria-label="Table of contents">{toc}</nav>
              </aside>
            )}
            <article className="page-content-card legal-content">{children}</article>
          </div>
        </div>

        {linkGroups && (
          <InternalLinkHub
            title="Explore CGPA Calculator Pro"
            groups={linkGroups}
            variant="muted"
          />
        )}
      </main>
      <Footer />
    </>
  );
}
