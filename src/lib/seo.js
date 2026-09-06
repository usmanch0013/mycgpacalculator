/** @typedef {{ question: string, answer: string }} FaqItem */

import { deriveSiteNameFromUrl } from './blog/admin-config';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cgpacalculatorpro.com';

function siteHostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, '');
  } catch {
    return 'localhost';
  }
}

export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME?.trim() || deriveSiteNameFromUrl(SITE_URL);
export const SITE_EMAIL =
  process.env.SITE_EMAIL?.trim() || `hello@${siteHostname(SITE_URL)}`;
export const SITE_TAGLINE = 'Free CGPA & GPA Calculator for Students Worldwide';
export const DEFAULT_OG_IMAGE = '/logo.svg';

export const HOMEPAGE_FAQS = [
  {
    question: 'How to calculate CGPA?',
    answer:
      'Multiply each course grade point by its credit hours, add those up, and divide by total credits. That is it. Pick your grading system in the calculator above, enter your courses, and you are done.',
  },
  {
    question: 'How to convert CGPA to percentage?',
    answer:
      'There is no one formula for everyone. Some schools use CGPA × 9.5, others use × 10, and Bangladesh often uses × 25 as a rough guide. Check your handbook — or use a university-specific page like SRM, VIT, or NSU for a closer match.',
  },
  {
    question: 'How to calculate CGPA from SGPA?',
    answer:
      'Take each semester GPA, multiply by that semester credits, add everything, then divide by total credits. CGPA mode on our calculator lets you enter semester rows instead of individual subjects.',
  },
  {
    question: 'What is the difference between SGPA and CGPA?',
    answer:
      'SGPA is one semester. CGPA is the running average across every semester you have finished so far.',
  },
  {
    question: 'How can I convert my CGPA to a percentage?',
    answer:
      'Ask your department first — they may have an official multiplier. If not, our Percentage tab and university pages give common formulas used in India, Bangladesh, and Pakistan.',
  },
  {
    question: 'Does a failed course affect my CGPA?',
    answer:
      'Usually yes. A fail is often 0 grade points, which pulls your average down hard until you retake and pass the course.',
  },
  {
    question: 'Is a 3.5 CGPA considered good?',
    answer:
      'On a 4.0 scale, 3.5 is strong — often around an A-minus average. On a 10.0 scale the numbers look different, so compare against your university cut-offs, not random internet charts.',
  },
  {
    question: 'Which grading system should I select?',
    answer:
      'Whichever matches your transcript. If you study at a listed university, open its dedicated page — SRM, NSU, UTM, and others load the right table automatically.',
  },
  {
    question: 'Is this CGPA calculator free to use?',
    answer:
      'Yes. No account needed. Calculations happen in your browser and we do not store what you type.',
  },
];

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * @param {{
 *   title: string;
 *   description: string;
 *   path: string;
 *   openGraph?: Record<string, unknown>;
 *   noIndex?: boolean;
 * }} options
 */
export function buildPageMetadata({
  title,
  description,
  path,
  openGraph = {},
  noIndex = false,
}) {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 180,
          height: 48,
          alt: `${SITE_NAME} — CGPA Calculator`,
        },
      ],
      ...openGraph,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.svg'),
    },
    description: SITE_TAGLINE,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE_EMAIL,
      url: absoluteUrl('/contact'),
    },
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/universities?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildWebApplicationSchema(overrides = {}) {
  return {
    '@type': 'WebApplication',
    '@id': `${SITE_URL}/#webapp`,
    name: `${SITE_NAME} Calculator`,
    url: SITE_URL,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description:
      'Free online CGPA calculator — calculate semester GPA, cumulative CGPA, CGPA to percentage, and percentage to CGPA. UTM, UiTM, SRM, NSU, VIT, NUST and 60+ university tools.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    ...overrides,
  };
}

/** @param {FaqItem[]} faqs */
export function buildFAQSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
}

/** @param {{ label: string, href?: string }[]} items */
export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function buildHowToSchema(name, steps) {
  return {
    '@type': 'HowTo',
    name,
    step: steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
    })),
  };
}

export function buildUniversityWebPageSchema(uni, path) {
  return {
    '@type': 'WebPage',
    '@id': absoluteUrl(path),
    url: absoluteUrl(path),
    name: `${uni.shortName} CGPA Calculator`,
    description: `Free ${uni.name} CGPA and GPA calculator with pre-loaded grading scale.`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: {
      '@type': 'EducationalOrganization',
      name: uni.name,
      address: {
        '@type': 'PostalAddress',
        addressCountry: uni.country,
      },
    },
    mainEntity: {
      '@type': 'WebApplication',
      name: `${uni.shortName} CGPA Calculator`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  };
}

export function buildJsonLdGraph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export const GLOBAL_JSON_LD = buildJsonLdGraph(
  buildOrganizationSchema(),
  buildWebSiteSchema(),
);

export const HOMEPAGE_JSON_LD = buildJsonLdGraph(
  buildOrganizationSchema(),
  buildWebSiteSchema(),
  buildWebApplicationSchema(),
  buildFAQSchema(HOMEPAGE_FAQS),
);

export function buildUniversityJsonLd(uni, content, path) {
  return buildJsonLdGraph(
    buildUniversityWebPageSchema(uni, path),
    buildFAQSchema(
      content.faqs.map((faq) => ({ question: faq.q, answer: faq.a })),
    ),
    buildHowToSchema(
      `How to calculate CGPA at ${uni.shortName}`,
      content.howTo,
    ),
  );
}

export function buildCountryCollectionSchema(country, countrySlug, universities) {
  const countryUnis = universities.filter((u) => u.country === country);

  return buildJsonLdGraph({
    '@type': 'CollectionPage',
    name: `${country} University CGPA Calculators`,
    url: absoluteUrl(`/universities/${countrySlug}`),
    description: `Free CGPA calculators for ${countryUnis.length} ${country} universities with pre-loaded grading scales.`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: countryUnis.length,
      itemListElement: countryUnis.map((uni, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/calculator/${uni.slug}`),
        name: `${uni.shortName} CGPA Calculator`,
      })),
    },
  });
}

export function buildUniversitiesDirectorySchema(universities) {
  return buildJsonLdGraph({
    '@type': 'CollectionPage',
    name: 'All Supported Universities — CGPA Calculator Pro',
    url: absoluteUrl('/universities'),
    description: 'Directory of university-specific CGPA and GPA calculators across Bangladesh, India, Pakistan, Malaysia, UK, and Europe.',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: universities.length,
      itemListElement: universities.slice(0, 50).map((uni, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(`/calculator/${uni.slug}`),
        name: `${uni.shortName} CGPA Calculator`,
      })),
    },
  });
}
