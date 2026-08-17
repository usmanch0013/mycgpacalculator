import Link from 'next/link';
import { buildBreadcrumbSchema } from '@/lib/seo';

export default function Breadcrumbs({ items }) {
  const jsonLd = buildBreadcrumbSchema(items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="legal-breadcrumb" aria-label="Breadcrumb">
        <ol className="breadcrumb-list">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`} className="breadcrumb-item">
              {i > 0 && <span className="breadcrumb-sep" aria-hidden="true">/</span>}
              {item.href ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
