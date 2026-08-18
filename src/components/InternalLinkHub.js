import Link from 'next/link';

export default function InternalLinkHub({
  title = 'Explore more on CGPA Calculator Pro',
  subtitle,
  groups,
  variant = 'default',
}) {
  if (!groups?.length) return null;

  return (
    <section className={`internal-links internal-links--${variant}`}>
      <div className="container">
        {(title || subtitle) && (
          <header className="internal-links-header">
            {title && <h2 className="internal-links-title">{title}</h2>}
            {subtitle && <p className="internal-links-subtitle">{subtitle}</p>}
          </header>
        )}
        <div className="internal-links-grid">
          {groups.map((group) => (
            <div key={group.title} className="internal-links-group">
              <h3 className="internal-links-group-title">{group.title}</h3>
              <ul className="internal-links-list">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
