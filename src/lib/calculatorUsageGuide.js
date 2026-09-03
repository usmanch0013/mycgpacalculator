import { GRADING_SYSTEMS, getMaxGradePoint } from './gradingSystems';

const NAME_POOL = [
  'Data Structures',
  'Computer Networks',
  'Operating Systems',
  'Database Systems',
  'Software Engineering',
  'Digital Logic Design',
  'Engineering Mathematics',
  'Thermodynamics',
  'Fluid Mechanics',
  'Circuit Analysis',
  'Microprocessor Systems',
  'Object-Oriented Programming',
  'Business Communication',
  'Financial Accounting',
  'Marketing Management',
  'Corporate Finance',
  'Organizational Behavior',
  'Business Statistics',
  'Microeconomics',
  'Macroeconomics',
  'Calculus I',
  'Linear Algebra',
  'Discrete Mathematics',
  'Probability Theory',
  'Research Methodology',
  'Technical Writing',
  'Academic English',
  'Physics for Engineers',
  'Chemistry for Engineers',
  'Environmental Science',
  'Human Resource Management',
  'Operations Research',
  'Project Management',
  'International Business',
  'Cost Accounting',
  'Taxation Law',
  'Constitutional Law',
  'Programming Fundamentals',
  'Web Development',
  'Mobile App Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Cloud Computing',
  'Information Security',
  'Control Systems',
  'Power Electronics',
  'Structural Analysis',
  'Transportation Engineering',
  'Biochemistry',
  'Anatomy & Physiology',
  'Pharmacology',
  'Clinical Medicine',
  'Nursing Fundamentals',
  'Public Health',
  'Media Studies',
  'Political Science',
  'Sociology',
  'Psychology',
  'Fine Arts Studio',
  'Architecture Design',
  'Urban Planning',
  'Agricultural Economics',
  'Food Technology',
  'Plant Pathology',
  'Veterinary Anatomy',
  'Avionics Systems',
  'Aerospace Materials',
  'Quantum Mechanics',
  'Organic Chemistry',
  'Biostatistics',
  'Ethics & Governance',
  'Islamic Studies',
  'Pakistan Studies',
  'Malaysian Studies',
  'Pengantar Ekonomi',
  'Bahasa Melayu',
  'STPM Mathematics',
  'Pre-University Physics',
  'Dissertation Module',
  'Research Methods',
  'Advanced Seminar',
  'Lineare Algebra',
  'Analysis I',
  'Betriebswirtschaft',
  'European Union Law',
  'ECTS Project Work',
  'Innovation Management',
  'Sustainable Engineering',
  'Renewable Energy Systems',
  'Data Analytics',
  'Supply Chain Management',
  'Investment Analysis',
  'Auditing Principles',
  'Human Computer Interaction',
  'Compiler Design',
  'Embedded Systems',
  'Signals and Systems',
  'Electromagnetic Fields',
  'Heat Transfer',
  'Manufacturing Processes',
  'Quality Management',
  'Entrepreneurship',
  'Brand Management',
  'Consumer Behavior',
  'International Relations',
  'Development Economics',
];

const EXAMPLE_GRADES = {
  Bangladesh: ['A', 'A-'],
  India: ['A', 'B+'],
  Pakistan: ['A', 'B+'],
  Malaysia: ['A', 'A-'],
  Europe: ['A', 'B'],
};

const LEAD_VARIANTS = [
  (uni, scale, systemName) =>
    `The ${uni.shortName} tool above is locked to ${systemName}. Enter your transcript row by row — course name, credits, and letter grade — and the semester GPA updates instantly. Maximum on this scale is ${scale}.`,
  (uni, scale, systemName) =>
    `Use this walkthrough to mirror how ${uni.name} students calculate GPA in real life: add each graded course, assign credit hours, pick the letter from the ${uni.shortName} dropdown, and let the tool handle the weighted average on a ${scale} scale.`,
  (uni, scale, systemName) =>
    `Below is a visual guide for the ${uni.shortName} calculator. It shows exactly where to type course data, how grades map through ${systemName}, and how your running result appears — no spreadsheet required.`,
];

function slugVariant(slug, count) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) hash += slug.charCodeAt(i);
  return hash % count;
}

function regionKey(country) {
  if (country === 'France' || country === 'Netherlands' || country === 'Ireland') return 'Europe';
  return country;
}

function pickCourseNames(uni) {
  const i = slugVariant(uni.slug, NAME_POOL.length);
  let j = (i + 17 + uni.shortName.length) % NAME_POOL.length;
  if (j === i) j = (j + 1) % NAME_POOL.length;
  return [NAME_POOL[i], NAME_POOL[j]];
}

function resolveGrade(system, labelHint) {
  const grade =
    system?.grades.find((g) => g.label === labelHint || g.label.startsWith(labelHint)) ??
    system?.grades[0];
  return grade ?? { label: labelHint, value: 4 };
}

function buildPreviewRows(uni, system) {
  if (uni.system === 'UK Honours') {
    const g1 = resolveGrade(system, 'First');
    const g2 = resolveGrade(system, 'Upper Second');
    return {
      courses: [
        { name: 'Research Methods', credits: '20', gradeLabel: g1.label, gradeValue: g1.value.toFixed(2) },
        { name: `${uni.shortName} Advanced Module`, credits: '20', gradeLabel: g2.label, gradeValue: g2.value.toFixed(2) },
      ],
      resultScore: '3.65',
      resultMax: getMaxGradePoint(uni.system),
    };
  }

  if (uni.system === 'German Scale') {
    return {
      courses: [
        { name: 'Analysis I', credits: '9', gradeLabel: '1.3', gradeValue: '4.00' },
        { name: 'Lineare Algebra', credits: '9', gradeLabel: '2.0', gradeValue: '3.30' },
      ],
      resultScore: '3.65',
      resultMax: getMaxGradePoint(uni.system),
    };
  }

  const [name1, name2] = pickCourseNames(uni);
  const gradeHints = EXAMPLE_GRADES[regionKey(uni.country)] ?? EXAMPLE_GRADES.Bangladesh;
  const credits = uni.type === 'Private' ? ['3', '3'] : ['4', '3'];
  const g1 = resolveGrade(system, gradeHints[0]);
  const g2 = resolveGrade(system, gradeHints[1]);
  const totalCredits = Number(credits[0]) + Number(credits[1]);
  const score = (
    (g1.value * Number(credits[0]) + g2.value * Number(credits[1])) /
    totalCredits
  ).toFixed(2);

  return {
    courses: [
      {
        name: name1,
        credits: credits[0],
        gradeLabel: g1.label,
        gradeValue: g1.value.toFixed(2),
      },
      {
        name: name2,
        credits: credits[1],
        gradeLabel: g2.label,
        gradeValue: g2.value.toFixed(2),
      },
    ],
    resultScore: score,
    resultMax: getMaxGradePoint(uni.system),
  };
}

function buildSteps(uni, system, scale) {
  const isUk = uni.system === 'UK Honours';
  const isGerman = uni.system === 'German Scale';
  const isTenPoint = scale === '10.0';
  const maxLabel = system?.grades[0]?.label ?? 'A';
  const maxVal = system?.grades[0]?.value?.toFixed(2) ?? '4.00';

  if (isUk) {
    return [
      {
        title: 'Choose Semester GPA or CGPA',
        body: `Open the Semester GPA tab for one term's modules, or CGPA to combine multiple terms. Percentage mode is for rough planning only — ${uni.shortName} degrees are classified (First, 2:1, 2:2).`,
      },
      {
        title: 'Add each module with credits',
        body: `Click "+ Add Course" and enter module titles from your ${uni.shortName} transcript. Use CATS/credit weight exactly as listed — weighted averages depend on credit volume, not module count alone.`,
      },
      {
        title: 'Select your classification band',
        body: `Pick the letter or class band shown on your result slip. The calculator maps UK honours boundaries to points for averaging — verify against your department handbook.`,
      },
      {
        title: 'Review your weighted result',
        body: `The bottom bar shows your semester or cumulative figure. Use it to track progress toward a First or 2:1 — official classification is confirmed on your degree transcript.`,
      },
    ];
  }

  if (isGerman) {
    return [
      {
        title: 'Pick Semester GPA or CGPA',
        body: `Start with Semester GPA for one exam period. Remember: on the German scale lower numbers are better (1.0 = sehr gut). This calculator converts to a comparable point scale for averaging.`,
      },
      {
        title: 'List every graded course',
        body: `Add each course from your ${uni.shortName} Schein or transcript. Include credits (ECTS/Leistungspunkte) as printed — labs and seminars count if they carry grades and credits.`,
      },
      {
        title: 'Enter your numeric grade',
        body: `Select or match the grade shown on your result (e.g. 1.3, 2.0, 3.7). Do not confuse German exam marks with the 4.0-style GPAs used in North America.`,
      },
      {
        title: 'Check the computed average',
        body: `Your semester or cumulative average appears at the bottom. Use it for scholarship or exchange planning — certified copies still come from ${uni.shortName} student services.`,
      },
    ];
  }

  const scalePhrase = isTenPoint
    ? `out of 10.00 (${maxLabel} = ${maxVal})`
    : `out of ${scale} (${maxLabel} = ${maxVal})`;

  return [
    {
      title: 'Select Semester GPA, CGPA, or Percentage',
      body: `Use Semester GPA for the current term at ${uni.shortName}, CGPA for your full running average across semesters, and Percentage only when you need a rough conversion figure for forms.`,
    },
    {
      title: 'Add courses from your transcript',
      body: `Press "+ Add Course" for each subject on your ${uni.shortName} registration. Course names are optional labels — credits and grades drive the calculation.`,
    },
    {
      title: 'Enter credits and letter grades',
      body: `Type credit hours exactly as on your portal, then choose the letter from the dropdown. Grades are pre-mapped to ${system?.name ?? uni.system} — ${scalePhrase}.`,
    },
    {
      title: 'Read the live result bar',
      body: `The highlighted score at the bottom updates as you edit rows. Toggle Pro mode to plan target grades for next semester without leaving the page.`,
    },
  ];
}

function buildCollectionNote(uni) {
  const notes = [
    `Everything you enter stays in your browser tab. We do not store ${uni.shortName} course names, credits, or grades on any server — close the tab and the data is gone.`,
    `This ${uni.shortName} calculator collects input only from what you type: course rows, credit values, and grade selections. No login, no cookies for grades, no transcript upload required.`,
    `Your data never leaves your device. The tool runs locally in JavaScript — ideal for quick checks on a ${uni.type.toLowerCase()} campus network without sharing personal results online.`,
  ];
  return notes[slugVariant(uni.slug, notes.length)];
}

function buildExampleFromPreview(preview) {
  const [c1, c2] = preview.courses;
  const credits = Number(c1.credits) + Number(c2.credits);

  return {
    courses: [
      { name: c1.name, credits: c1.credits, grade: c1.gradeLabel, points: c1.gradeValue },
      { name: c2.name, credits: c2.credits, grade: c2.gradeLabel, points: c2.gradeValue },
    ],
    result: `${preview.resultScore} / ${preview.resultMax}`,
    formula:
      preview.formulaNote ??
      `((${c1.credits} × ${c1.gradeValue}) + (${c2.credits} × ${c2.gradeValue})) ÷ ${credits} = ${preview.resultScore}`,
  };
}

export function getCalculatorUsageGuide(uni) {
  const system = GRADING_SYSTEMS[uni.system];
  const scale = system?.scale ?? '4.0';
  const systemName = system?.name ?? uni.system;
  const lead = LEAD_VARIANTS[slugVariant(uni.slug, LEAD_VARIANTS.length)](uni, scale, systemName);
  const preview = buildPreviewRows(uni, system);

  if (uni.system === 'UK Honours') {
    preview.formulaNote =
      'Weighted by module credits — official degree class confirmed on your transcript.';
  } else if (uni.system === 'German Scale') {
    preview.formulaNote =
      'German numeric grades converted for averaging — lower raw marks are better on German scales.';
  }

  return {
    title: `How to use the ${uni.shortName} CGPA calculator`,
    lead,
    steps: buildSteps(uni, system, scale),
    collectionNote: buildCollectionNote(uni),
    example: buildExampleFromPreview(preview),
    preview: {
      systemName,
      shortName: uni.shortName,
      ...preview,
    },
    imageAlt: `${uni.shortName} CGPA calculator showing ${preview.courses[0].name}, credits, ${systemName} grades, and semester GPA ${preview.resultScore} / ${preview.resultMax}`,
  };
}
