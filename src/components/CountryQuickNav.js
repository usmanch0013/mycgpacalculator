import Link from 'next/link';
import { getCountryHubLinks } from '@/lib/internalLinks';

export default function CountryQuickNav({ activeCountry = null }) {
  const links = getCountryHubLinks();

  return (
    <nav className="country-quick-nav" aria-label="Browse calculators by country">
      {links.map((link) => {
        const isActive = activeCountry && link.href === `/universities/${activeCountry}`;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`country-quick-nav-item ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
