import { GRADING_SYSTEMS } from './gradingSystems';
import { getCountryHubLink } from './internalLinks';
import {
  getUniversityKeywordTitle,
  getUniversityKeywordDescription,
  getUniversityKeywordH1,
  getUniversityKeywordList,
} from './keywordSeo';
import { getUniversityContentOverride } from './universityContentOverrides';

const PERCENTAGE_FORMULAS = {
  Bangladesh: 'A rough guide used by many colleges: multiply CGPA by 25. Your faculty may use something different — check your handbook.',
  India: 'Common shortcuts include (CGPA − 0.5) × 10 on IIT-style scales, or CGPA × 9.5 on CBSE-style tables. Always confirm with your department.',
  Pakistan: 'HEC-affiliated universities each publish their own multiplier. We show CGPA accurately; certified percentage conversion comes from your registrar.',
  'United Kingdom': 'UK degrees are usually classified (First, 2:1, 2:2) rather than expressed as a percentage CGPA.',
  Germany: 'German transcripts use 1.0 (best) to 5.0 (fail). That scale does not map cleanly to a 4.0 GPA without an official conversion table.',
  France: 'French and ECTS grades (A through F) follow European credit standards, not a single percentage formula.',
  Netherlands: 'Dutch universities typically use ECTS letter grades. Percentage equivalents vary by programme.',
  Ireland: 'Irish universities often align with ECTS. Use your transcript notes for any official conversion.',
  Malaysia: 'Many IPTA faculties use CGPA × 25 as a rough percentage estimate. Double-check with your faculty office before submitting forms.',
};

function slugVariant(slug, count) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash += slug.charCodeAt(i);
  return hash % count;
}

function buildIntro(uni, system, scale) {
  const systemName = system?.name ?? uni.system;
  const variants = [
    `Students at ${uni.name} (${uni.shortName}) usually want one thing before result day: a CGPA number they can trust. This calculator is set up for ${systemName} on a ${scale} scale — the same grade boundaries listed in most ${uni.shortName} handbooks.`,
    `If you are at ${uni.shortName}, you have probably tried doing CGPA math in Notes or Excel at least once. We saved you the trouble: pick your courses, enter credits and grades, and the tool applies ${uni.name}'s ${systemName} automatically.`,
    `This page is for ${uni.shortName} students who need a quick semester GPA or running cumulative CGPA without logging into anything. Grading follows ${systemName}; we reference the published ${scale} scale so you are not guessing grade points from memory.`,
    `Whether you are checking if one course pulled your average down or converting grades for a scholarship form, start here. ${uni.name} uses ${systemName}, and every dropdown on this page matches that table.`,
  ];
  return variants[slugVariant(uni.slug, variants.length)];
}

function buildHowTo(uni, scale) {
  const sets = [
    [
      `Choose Semester GPA if you only need this term, or CGPA if you are averaging multiple semesters.`,
      `Add each subject with its credit hours and the letter grade from your ${uni.shortName} transcript.`,
      `Grades map to points on the ${scale} scale for you — no manual lookup table needed.`,
      `Need a percentage figure or a target GPA plan? Switch tabs or turn on Pro mode above the results.`,
    ],
    [
      `Pick the mode that fits: one semester (SGPA) or your full running average (CGPA).`,
      `Enter course names if it helps you stay organised; credits and grades are what matter for the math.`,
      `The ${scale} scale is already loaded for ${uni.shortName}.`,
      `Use the Percentage tab for a rough conversion, or Pro tools if you are planning next semester's targets.`,
    ],
  ];
  return sets[slugVariant(uni.slug, sets.length)];
}

function buildGradingNote(uni, system) {
  if (!system) {
    return `${uni.name} follows ${uni.system}. If something looks off, compare with your official transcript — handbooks get updated quietly.`;
  }
  const top = system.grades[0];
  return `${uni.name} publishes grades under ${system.name}. The top mark on this scale is ${top?.label} (${top?.value.toFixed(2)} points). A failed course usually counts as 0.00 and will drag your cumulative average down until you pass it.`;
}

export function getUniversityPageTitle(uni) {
  return getUniversityKeywordTitle(uni);
}

export function getUniversityPageDescription(uni) {
  return getUniversityKeywordDescription(uni);
}

export function getUniversityPageH1(uni) {
  return getUniversityKeywordH1(uni);
}

export function getUniversityKeywords(uni) {
  return getUniversityKeywordList(uni);
}

export function getUniversitySeoContent(uni) {
  const system = GRADING_SYSTEMS[uni.system];
  const scale = system?.scale ?? '4.0';
  const pctFormula = PERCENTAGE_FORMULAS[uni.country] ?? 'Check your university handbook for the official conversion rule.';
  const override = getUniversityContentOverride(uni.slug);

  const base = {
    intro: buildIntro(uni, system, scale),
    howTo: buildHowTo(uni, scale),
    gradingNote: buildGradingNote(uni, system),
    percentageNote: pctFormula,
    faqs: getUniversityFaqs(uni, system, pctFormula),
  };

  if (!override) return base;

  return {
    ...base,
    intro: override.intro ?? base.intro,
    context: override.context,
    howTo: override.howTo ?? base.howTo,
    gradingNote: override.gradingNote ?? base.gradingNote,
    percentageNote: override.percentageNote ?? base.percentageNote,
    faqs: override.faqs ?? base.faqs,
  };
}

function getUniversityFaqs(uni, system, pctFormula) {
  const maxGp = system?.grades[0]?.value.toFixed(2) ?? '4.00';
  const scaleName = system?.name ?? uni.system;

  return [
    {
      q: `How do I calculate CGPA at ${uni.shortName}?`,
      a: `Multiply each course's grade point by its credits, add everything up, then divide by total credits. That is the standard formula ${uni.shortName} uses on the ${scaleName}. Enter your courses above and the calculator does the arithmetic.`,
    },
    {
      q: `How do I convert ${uni.shortName} CGPA to percentage?`,
      a: pctFormula,
    },
    {
      q: `How do I work out CGPA from semester GPAs?`,
      a: `Weight each semester's GPA by its credit hours, add those weighted scores, then divide by total credits completed. CGPA mode on this page is built for exactly that — add each semester row instead of individual courses.`,
    },
    {
      q: `What is the highest CGPA at ${uni.name}?`,
      a: `On the ${scaleName}, the maximum grade point is ${maxGp}. Straight ${topLabel(system)} grades across every course would give you the top possible CGPA on that scale.`,
    },
    {
      q: `Is this ${uni.shortName} calculator free?`,
      a: `Yes. No account, no download, and nothing you type is sent to our servers. It all runs in your browser.`,
    },
  ];
}

function topLabel(system) {
  return system?.grades[0]?.label ?? 'A';
}

export function getRelatedUniversities(uni, allUniversities, limit = 6) {
  const others = allUniversities.filter((u) => u.slug !== uni.slug);
  const sameSystem = others.filter((u) => u.system === uni.system);
  const sameCountry = others.filter(
    (u) => u.country === uni.country && u.system !== uni.system,
  );
  const seen = new Set();
  return [...sameSystem, ...sameCountry]
    .filter((u) => {
      if (seen.has(u.slug)) return false;
      seen.add(u.slug);
      return true;
    })
    .slice(0, limit);
}

/** Short contextual blurb with internal links — unique per university via desc + related list. */
export function getUniversityGuideLinks(uni, related = []) {
  const peers = related.slice(0, 3).map((r) => ({
    href: `/calculator/${r.slug}`,
    label: `${r.shortName} CGPA calculator`,
  }));

  return {
    countryHub: getCountryHubLink(uni.country),
    peers,
    formulaHref: '/#formula',
    guideHref: '/#guide',
    blogHref: '/blog',
    directoryHref: '/universities',
  };
}
