import {
  UNIVERSITIES,
  getUniversityCalculatorLink,
  UK_EUROPE_COUNTRIES,
} from './universities';
import { PRIORITY_CALCULATOR_SLUGS } from './keywordSeo';

export const COUNTRY_SLUGS = {
  bangladesh: 'Bangladesh',
  india: 'India',
  pakistan: 'Pakistan',
  malaysia: 'Malaysia',
};

function slugToPopularEntry(slug) {
  const uni = UNIVERSITIES.find((u) => u.slug === slug);
  if (!uni) return null;
  return { slug, label: `${uni.shortName} CGPA Calculator` };
}

export const POPULAR_CALCULATORS = PRIORITY_CALCULATOR_SLUGS
  .map(slugToPopularEntry)
  .filter(Boolean);

export const RESOURCE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#calculator', label: 'Main CGPA Calculator' },
  { href: '/#formula', label: 'CGPA Formula Explained' },
  { href: '/#guide', label: 'Complete CGPA Guide' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/universities', label: 'All Universities' },
  { href: '/universities/uk-europe', label: 'UK & Europe Calculators' },
  { href: '/about', label: 'About MyCGPA' },
  { href: '/contact', label: 'Contact Us' },
];

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/cookies', label: 'Cookie Policy' },
];

export function getCountryFromSlug(countrySlug) {
  return COUNTRY_SLUGS[countrySlug] ?? null;
}

export function getCountryHubLink(country) {
  const entry = Object.entries(COUNTRY_SLUGS).find(([, name]) => name === country);
  return entry ? `/universities/${entry[0]}` : '/universities';
}

export function toLink(slug, label) {
  return { href: getUniversityCalculatorLink(slug), label };
}

export function getCalculatorsByCountry(country, excludeSlug, limit = 8) {
  return UNIVERSITIES.filter(
    (u) => u.country === country && u.slug !== excludeSlug,
  )
    .slice(0, limit)
    .map((u) => ({ href: getUniversityCalculatorLink(u.slug), label: `${u.shortName} CGPA Calculator` }));
}

export function getCalculatorsBySystem(system, excludeSlug, limit = 6) {
  return UNIVERSITIES.filter(
    (u) => u.system === system && u.slug !== excludeSlug,
  )
    .slice(0, limit)
    .map((u) => ({ href: getUniversityCalculatorLink(u.slug), label: `${u.shortName} Calculator` }));
}

export function getPopularCalculatorLinks(limit = 8) {
  return POPULAR_CALCULATORS.slice(0, limit).map((c) => toLink(c.slug, c.label));
}

export function getCountryHubLinks() {
  return [
    { href: '/universities/bangladesh', label: 'Bangladesh Universities' },
    { href: '/universities/india', label: 'India Universities' },
    { href: '/universities/pakistan', label: 'Pakistan Universities' },
    { href: '/universities/malaysia', label: 'Malaysia Universities' },
    { href: '/universities/uk-europe', label: 'UK & Europe Universities' },
    { href: '/universities', label: 'Full University Directory' },
  ];
}

export function getHomepageLinkGroups() {
  return [
    {
      title: 'Popular calculators',
      links: getPopularCalculatorLinks(10),
    },
    {
      title: 'Browse by country',
      links: getCountryHubLinks(),
    },
    {
      title: 'Learn & support',
      links: [
        { href: '/#guide', label: 'CGPA Guide' },
        { href: '/#formula', label: 'How CGPA is calculated' },
        { href: '/#faq', label: 'Frequently asked questions' },
        { href: '/about', label: 'About us' },
        { href: '/contact', label: 'Contact support' },
      ],
    },
  ];
}

export function getCalculatorPageLinkGroups(uni) {
  const countryLinks = getCalculatorsByCountry(uni.country, uni.slug, 8);
  const systemLinks = getCalculatorsBySystem(uni.system, uni.slug, 6);
  const groups = [
    {
      title: `More ${uni.country} calculators`,
      links: countryLinks.length
        ? countryLinks
        : [{ href: getCountryHubLink(uni.country), label: `Browse ${uni.country}` }],
    },
    {
      title: 'Site navigation',
      links: [
        { href: '/', label: 'Home' },
        { href: getCountryHubLink(uni.country), label: `${uni.country} hub` },
        { href: '/universities', label: 'All universities' },
        { href: '/#guide', label: 'CGPA guide' },
        { href: '/#faq', label: 'FAQ' },
      ],
    },
  ];
  if (systemLinks.length > 1) {
    groups.unshift({
      title: `Same grading scale (${uni.system})`,
      links: systemLinks,
    });
  }
  if (UK_EUROPE_COUNTRIES.includes(uni.country)) {
    groups.push({
      title: 'UK & Europe',
      links: [
        { href: '/universities/uk-europe', label: 'All UK & Europe calculators' },
        { href: '/calculator/university-of-oxford', label: 'Oxford calculator' },
        { href: '/calculator/tu-munich', label: 'TUM calculator' },
      ],
    });
  }
  return groups;
}

export function getLegalPageLinkGroups() {
  return [
    { title: 'Calculators', links: getPopularCalculatorLinks(6) },
    { title: 'Universities', links: getCountryHubLinks().slice(0, 4) },
    { title: 'Company', links: [...RESOURCE_LINKS.slice(6), ...LEGAL_LINKS] },
  ];
}

export function getUniversitiesPageLinkGroups() {
  return [
    { title: 'Top calculators', links: getPopularCalculatorLinks(8) },
    {
      title: 'By region',
      links: getCountryHubLinks(),
    },
    {
      title: 'Resources',
      links: [
        { href: '/#calculator', label: 'Main calculator' },
        { href: '/#guide', label: 'CGPA guide' },
        { href: '/#faq', label: 'FAQ' },
        { href: '/contact', label: 'Request a university' },
      ],
    },
  ];
}

export function getCountryPageLinkGroups(country) {
  const otherCountries = Object.entries(COUNTRY_SLUGS)
    .filter(([, name]) => name !== country)
    .map(([slug, name]) => ({ href: `/universities/${slug}`, label: `${name} calculators` }));

  return [
    {
      title: `${country} calculators`,
      links: getCalculatorsByCountry(country, null, 12),
    },
    {
      title: 'Other regions',
      links: [...otherCountries, { href: '/universities/uk-europe', label: 'UK & Europe' }],
    },
    {
      title: 'Helpful pages',
      links: [
        { href: '/#guide', label: 'CGPA guide' },
        { href: '/#formula', label: 'CGPA formula' },
        { href: '/universities', label: 'Full directory' },
      ],
    },
  ];
}

/** SEO-rich inline link map for guide content */
export const GUIDE_CALCULATOR_LINKS = {
  bracu: toLink('brac-university', 'BRACU CGPA calculator'),
  nsu: toLink('north-south-university', 'NSU CGPA calculator'),
  uiu: toLink('uiu', 'UIU CGPA calculator'),
  iub: toLink('iub', 'IUB CGPA calculator'),
  du: toLink('university-of-dhaka', 'DU CGPA calculator'),
  nu: toLink('national-university-bangladesh', 'NU CGPA calculator'),
  vit: toLink('vit-vellore', 'VIT CGPA calculator'),
  srm: toLink('srm-university', 'SRM CGPA calculator'),
  ktu: toLink('ktu-kerala', 'KTU CGPA calculator'),
  ipu: toLink('ggsipu', 'GGSIPU CGPA calculator'),
  saveetha: toLink('saveetha-university', 'Saveetha CGPA calculator'),
  nust: toLink('nust', 'NUST CGPA calculator'),
  uaf: toLink('uaf-faisalabad', 'UAF CGPA calculator'),
  iit: toLink('iit-delhi', 'IIT Delhi GPA calculator'),
  utm: toLink('utm', 'UTM CGPA calculator'),
  uitm: toLink('uitm', 'UiTM CGPA calculator'),
  utar: toLink('utar', 'UTAR CGPA calculator'),
  stpm: toLink('stpm-malaysia', 'STPM CGPA calculator'),
};
