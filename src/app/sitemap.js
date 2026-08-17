import { UNIVERSITIES } from '@/lib/universities';
import { COUNTRY_SLUGS } from '@/lib/internalLinks';
import { SITE_URL } from '@/lib/seo';

const STATIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/universities', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/universities/uk-europe', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const countryEntries = Object.keys(COUNTRY_SLUGS).map((slug) => ({
    url: `${SITE_URL}/universities/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const calculatorEntries = UNIVERSITIES.map((uni) => ({
    url: `${SITE_URL}/calculator/${uni.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...countryEntries, ...calculatorEntries];
}
