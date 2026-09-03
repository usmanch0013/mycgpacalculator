/**
 * Hand-written guide content for high-traffic calculator pages.
 * Overrides templated copy in universityContent.js for AdSense-quality uniqueness.
 */

import { OVERRIDES as bangladeshOverrides } from './universityContent/overrides/bangladesh.js';
import { OVERRIDES as indiaOverrides } from './universityContent/overrides/india.js';
import { OVERRIDES as pakistanOverrides } from './universityContent/overrides/pakistan.js';
import { OVERRIDES as europeOverrides } from './universityContent/overrides/europe.js';
import { OVERRIDES as malaysiaOverrides } from './universityContent/overrides/malaysia.js';

/** @typedef {{ intro?: string, context?: string, howTo?: string[], gradingNote?: string, percentageNote?: string, faqs?: { q: string, a: string }[] }} UniversityContentOverride */

const CORE_OVERRIDES = {
  'university-of-dhaka': {
    intro:
      'University of Dhaka (DU) is Bangladesh\'s oldest public university, and most faculties still grade on the UGC-mandated 4.0 scale. Whether you are in Arts, Science, Business Studies, or Social Sciences, your semester result is ultimately a credit-weighted average — not a simple mean of marks. This calculator loads DU\'s standard A+ through F table so you can sanity-check results before they appear on the DU portal.',
    context:
      'DU students often mix theory papers, lab courses, and viva components in one semester. Credits vary by department — a 3-credit core course counts the same in the formula as a 1-credit lab if both appear on your registration slip. If you retake a failed paper, only the passing attempt should enter your cumulative average; confirm that rule with your department office before planning targets.',
    howTo: [
      'Open Semester GPA and list every course from your current registration — include lab and tutorial credits if they carry separate grades.',
      'Match each letter grade to the UGC table shown above (A+ = 4.00 down to F = 0.00). DU faculties use the same national boundaries in most cases.',
      'Switch to CGPA when you want a running average across completed semesters — weight each term by its total credits, not by counting semesters equally.',
      'Use the Percentage tab only as a rough estimate (CGPA × 25 is common in Bangladesh). Scholarship forms and abroad applications usually need an official DU transcript.',
    ],
    gradingNote:
      'DU follows the UGC Standard Grading System on a 4.0 scale. An A+ (80% and above) earns 4.00 grade points, while a D at 40–44% still carries 2.00 points — failing grades (below 40%) score 0.00 and will pull your CGPA down until you pass the course. Honours students aiming for merit lists typically need consistent A-/A performance across core papers, not just high marks in electives.',
    percentageNote:
      'Many DU colleges informally estimate marks as CGPA × 25 (so 3.60 CGPA ≈ 90%). Faculties do not all publish the same conversion — engineering, business, and arts units may word their rules differently. Use this figure for personal planning only; download your official transcript for job or visa applications.',
    faqs: [
      {
        q: 'Does DU use the same grading scale in every faculty?',
        a: 'Most DU faculties follow the national UGC 4.0 table loaded in this calculator. Professional or institute-specific programmes occasionally publish addenda — compare your result sheet with the grade table above.',
      },
      {
        q: 'How is DU semester GPA calculated?',
        a: 'Multiply each course grade point by its credit hours, sum those products, then divide by total credits registered that semester. Failed courses with 0.00 grade points reduce the average the same way a low pass would.',
      },
      {
        q: 'What CGPA do I need for a DU merit certificate?',
        a: 'Merit cut-offs change every session and faculty. Public-health and business programmes often publish minimum CGPA thresholds in their notices — this tool helps you track progress, not guarantee a certificate.',
      },
      {
        q: 'Can I convert DU CGPA to percentage for abroad applications?',
        a: 'Foreign universities usually ask for official transcripts, not self-calculated percentages. If a form requires a percentage, ask DU\'s registrar or your department which conversion they certify.',
      },
      {
        q: 'How do I combine two semesters into one CGPA?',
        a: 'Use CGPA mode: enter each semester\'s GPA and its credit total. Do not average the two GPA numbers directly — weight by credits.',
      },
      {
        q: 'Is this DU calculator free to use?',
        a: 'Yes. Everything runs in your browser; we do not store your grades.',
      },
    ],
  },

  buet: {
    intro:
      'Bangladesh University of Engineering and Technology (BUET) is the country\'s most competitive engineering school, and grades are unforgiving — a single failed lab or low sessional mark can erase months of work. BUET uses the UGC 4.0 scale, but pass marks and course loads are stricter than many general universities. Use this page when you want a realistic semester GPA before results are posted on the BUET portal.',
    context:
      'Engineering programmes at BUET stack heavy credit loads: mathematics, drawing, workshop, and lab courses often run in parallel. Sessionals, midterms, and finals are combined into one letter grade per course — if your transcript shows one grade, enter that final letter here. Retake policies are department-specific; a 0.00 on an F grade stays in your cumulative record until you pass.',
    howTo: [
      'Select Semester GPA and enter every course from your registration card, including sessional-only components if they appear as separate graded entries.',
      'Use the UGC grade table — BUET applies the same A+ (4.00) to F (0.00) boundaries as other public universities.',
      'For cumulative standing after multiple levels (e.g., Level 3 Term 1 + Term 2), switch to CGPA and weight each semester by credits completed.',
      'Planning target grades? Try Pro mode to see what average you need next term to reach a CGPA goal.',
    ],
    gradingNote:
      'BUET publishes results under the UGC Standard Grading System. The maximum grade point is 4.00 (A+). Engineering faculties typically treat anything below 40% as failure (0.00 points). Because credit loads are high, one C+ in a 3-credit math course affects your CGPA more than the same grade in a 1-credit humanities elective.',
    percentageNote:
      'BUET transcripts emphasize letter grades and CGPA rather than percentage marks. If an employer asks for a percentage, multiply CGPA by 25 only as an informal estimate — verify with your department or alumni office before submitting official forms.',
    faqs: [
      {
        q: 'Is BUET\'s grading scale different from DU?',
        a: 'Both use the UGC 4.0 national table for letter-to-point mapping. BUET differs in rigour and credit structure, not usually in the basic A+ to F boundaries.',
      },
      {
        q: 'How many credits does BUET use per semester?',
        a: 'It varies by department and level — 18–22 credits is common. Enter the exact credits from your registration slip; guessing skews your GPA.',
      },
      {
        q: 'Do failed courses stay on my BUET CGPA?',
        a: 'Failed courses score 0.00 grade points and reduce your average until you pass. After a successful retake, confirm with your department whether both attempts appear on the transcript.',
      },
      {
        q: 'What CGPA is considered strong at BUET?',
        a: 'Because admission is highly selective, cohort averages are compressed. Many employers look at degree class equivalents and project work — use CGPA as one signal, not the only one.',
      },
      {
        q: 'Can I calculate CGPA from only theory courses?',
        a: 'Your official CGPA includes every graded course on the transcript — labs and workshops count if they carry credits and letter grades.',
      },
      {
        q: 'Does this BUET calculator store my data?',
        a: 'No. Calculations happen locally in your browser.',
      },
    ],
  },

  'north-south-university': {
    intro:
      'North South University (NSU) was Bangladesh\'s first private university and still uses its own detailed grading bands — tighter than the public UGC table. An A at NSU starts at 93%, not 80%, so copying DU grade boundaries will give you the wrong GPA. This calculator is pre-loaded with NSU\'s official letter-to-point mapping used on American-style transcripts.',
    context:
      'NSU runs on a semester credit system with frequent quizzes, midterms, and finals rolled into one letter grade. Business, engineering, and liberal arts programmes share the same grade table but different credit requirements. If you are on probation or aiming for the Dean\'s List, watch both your semester GPA and cumulative CGPA — NSU publishes separate academic standing rules each term.',
    howTo: [
      'Choose Semester GPA and add each course with the credit hours listed on your NSU course schedule.',
      'Pick letter grades exactly as they appear on the NSU portal — NSU uses A, A-, B+, etc., with different cut-offs than public universities.',
      'Switch to CGPA to combine multiple semesters; weight each term by its total credits.',
      'For scholarship or transfer forms, screenshot your official NSU transcript — do not rely on percentage estimates alone.',
    ],
    gradingNote:
      'NSU grades on a 4.0 scale where A (93–100) = 4.00 and A- (90–92) = 3.70. The pass/fail boundary sits at 60% for most courses (D = 1.00, F below 60 = 0.00). Because NSU bands are narrower than UGC public scales, a drop from A- to B+ costs 0.40 grade points — more than at many public universities.',
    percentageNote:
      'NSU transcripts show letter grades and GPA rather than a single percentage column. Some students multiply CGPA by 25 for informal comparisons with public universities — that is not an NSU-certified formula. Request an official GPA verification letter from the registrar for employers or embassies.',
    faqs: [
      {
        q: 'Why is my NSU GPA lower than a friend\'s at a public university with the same marks?',
        a: 'NSU uses higher cut-offs for top grades. An 85% might be B+ at NSU but A- on the UGC public scale — always use NSU\'s own table.',
      },
      {
        q: 'How does NSU calculate cumulative CGPA?',
        a: 'Total grade points earned (grade point × credits for every course) divided by total credits attempted, including failed courses until retaken per policy.',
      },
      {
        q: 'What CGPA do I need for NSU Dean\'s List?',
        a: 'Dean\'s List thresholds are published each semester — often around 3.50+ but confirm in the academic calendar. This calculator shows your current standing only.',
      },
      {
        q: 'Can I retake a course to replace an F at NSU?',
        a: 'Retake policies are in the NSU undergraduate bulletin. An F (0.00) hurts CGPA immediately; ask your advisor how retakes appear on the transcript.',
      },
      {
        q: 'Does NSU use plus/minus grades on transcripts?',
        a: 'Yes — A, A-, B+, B, B-, C+, C, C-, D+, D, and F all map to different grade points on the NSU scale loaded here.',
      },
      {
        q: 'Is the NSU CGPA calculator free?',
        a: 'Yes — no login, no data sent to our servers.',
      },
    ],
  },

  'brac-university': {
    intro:
      'BRAC University (BRACU) uses one of the most granular grading tables among Bangladesh private universities — twelve letter bands from A+ down to F, with different mark ranges than NSU or UIU. If you imported a spreadsheet built for a public UGC scale, your BRACU GPA will be wrong. This page locks the calculator to BRACU\'s published grade points so CSE, BBA, and architecture students get the same accurate math.',
    context:
      'BRACU emphasises continuous assessment: quizzes, projects, and finals combine into one letter grade per course. Architecture and pharmacy programmes sometimes carry higher credit loads — enter the exact credits from your BRACU student portal. Students planning semester abroad or credit transfer should export an official transcript; self-calculated GPAs are starting points, not certified documents.',
    howTo: [
      'Start in Semester GPA mode and list every course on your current advisement report.',
      'Select BRACU letter grades from the dropdown — note that A and A+ both carry 4.00 points but require different mark ranges.',
      'Use CGPA mode after two or more semesters to see your cumulative standing across the whole programme.',
      'Compare your result with the BRACU portal before submitting scholarship essays or internship applications.',
    ],
    gradingNote:
      'BRACU\'s scale tops out at 4.00 for both A+ (97–100) and A (90–96). A failing grade below 52% scores 0.00. The wide spread between B- (2.70) and C+ (2.30) means small exam differences can move your semester GPA noticeably — especially in 3-credit core courses.',
    percentageNote:
      'BRACU does not publish one national percentage formula. Some faculties mention CGPA × 25 in informal guides; others prefer letter-grade descriptions on transcripts. For verified conversions, contact BRACU\'s Office of the Registrar.',
    faqs: [
      {
        q: 'Is BRACU\'s scale the same as NSU\'s?',
        a: 'No. Both use 4.0 GPA terminology but different mark bands. Always calculate BRACU grades with the BRACU table — mixing scales under-reports or over-reports your GPA.',
      },
      {
        q: 'How do I calculate BRACU CGPA after a failed course?',
        a: 'Include the F (0.00) in total grade points and credits until you retake and pass under current academic policy. Our calculator reflects standard credit-weighted averaging.',
      },
      {
        q: 'What is a good CGPA at BRACU?',
        a: 'Employers and graduate schools look at programme reputation and projects as well as GPA. Many competitive internships cite 3.30+ as a screening line — verify requirements individually.',
      },
      {
        q: 'Do BRACU labs count the same as lectures?',
        a: 'If the lab appears as a separate graded course with its own credits on your transcript, include it separately with its letter grade.',
      },
      {
        q: 'Can I use this for BRACU MBA or graduate programmes?',
        a: 'Graduate programmes may use different policies — check your programme handbook. This tool reflects the standard undergraduate BRACU letter scale.',
      },
      {
        q: 'Is this BRACU calculator accurate?',
        a: 'It mirrors the grade table published for BRACU on this site. Always confirm final results against your official BRACU transcript.',
      },
    ],
  },

  'vit-vellore': {
    intro:
      'Vellore Institute of Technology (VIT) grades on a 10-point scale where S grade (90%+) equals 10.0 — not 4.0. That single difference trips up students who paste marks into a generic GPA spreadsheet. Whether you study at VIT Vellore, Chennai, or AP campus, this calculator uses VIT\'s S/A/B/C/D/E/F letter mapping so your semester GPA matches what appears on VIT\'s VTOP portal.',
    context:
      'VIT courses use credits (often 3–4 per subject) with continuous evaluation: CAT marks, digital assignments, and FAT contribute to one final letter. Relative grading in some batches can shift cut-offs — your transcript letter is the source of truth, not classroom rumours. Students targeting placements often track both CGPA (out of 10) and equivalent percentages required by off-campus recruiters.',
    howTo: [
      'Pick Semester GPA and enter each subject with credits from your VIT curriculum plan.',
      'Choose letter grades (S, A, B, C, D, E, F) exactly as VIT publishes on the grade sheet.',
      'Switch to CGPA to combine Fall and Winter semesters — weight by credits, not by simple average of semester GPAs.',
      'Use the Percentage tab cautiously: many Indian employers ask for (CGPA / 10) × 100 or proprietary VIT conversion — confirm with placement cell guidelines.',
    ],
    gradingNote:
      'VIT\'s 10-point scale assigns S = 10.0 (90–100), A = 9.0 (80–89), B = 8.0 (70–79), and F = 0.0 below 50%. An E grade (5.0 points) still passes but hurts placement shortlists. Because the scale is out of 10, a 8.5 CGPA is strong — do not compare directly with a 4.0-scale US GPA without conversion.',
    percentageNote:
      'A common rough conversion is (CGPA / 10) × 100, so 8.50 CGPA ≈ 85%. VIT placement slides sometimes use different formulas for specific companies. Download your official grade sheet from VTOP when a form asks for "aggregate percentage."',
    faqs: [
      {
        q: 'Is VIT CGPA out of 4 or 10?',
        a: 'VIT uses a 10-point CGPA scale. This calculator is configured for that system — do not enter VIT grades into a 4.0-scale tool without converting.',
      },
      {
        q: 'How is VIT semester GPA calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester. Failed courses with F = 0.0 reduce the average until cleared.',
      },
      {
        q: 'What CGPA is good for VIT placements?',
        a: 'Cut-offs vary by company — product firms often filter around 8.0+ CGPA, while core engineering roles may accept lower with strong projects. Track your programme\'s placement report for realistic targets.',
      },
      {
        q: 'Does relative grading change my letter grade?',
        a: 'Some courses curve final letters. Enter the letter shown on your official result — that is what VIT records on your transcript.',
      },
      {
        q: 'Can I combine FFCS and regular credits in one GPA?',
        a: 'If both appear on the same semester transcript with grades and credits, include all in one semester GPA calculation.',
      },
      {
        q: 'Is this VIT calculator free?',
        a: 'Yes. No signup; grades stay on your device.',
      },
    ],
  },

  'srm-university': {
    intro:
      'SRM Institute of Science and Technology (SRM) — including SRMIST Chennai and affiliated campuses — uses a 10-point grading system with O, A+, A, B+, B, C, and F letters. Placements, higher-study applications, and Tamil Nadu engineering counselling all reference this CGPA format. This calculator prevents the common mistake of treating SRM\'s "O" grade (10.0 points) like a 4.0-scale A.',
    context:
      'SRM splits the academic year into odd and even semesters with continuous internal marks feeding the final letter. Credit totals differ between B.Tech, B.Arch, and health-science programmes — pull credits from the SRM academic portal, not from a friend\'s timetable. If you have arrear papers, include them in the semester where they appear on your grade sheet; hiding an F skews your planning.',
    howTo: [
      'Select Semester GPA and list subjects with credits from your SRM course registration printout.',
      'Map each final letter to SRM\'s table — O = 10.0, A+ = 9.0, A = 8.0, and so on.',
      'Use CGPA mode to track standing across multiple semesters for NAAC or placement eligibility.',
      'Cross-check totals with the SRM student portal before submitting forms to banks or scholarship portals.',
    ],
    gradingNote:
      'SRM\'s top grade O (91–100) carries 10.0 points on a 10.0 scale. A C grade (50–55) still earns 5.0 points — passing but weak for competitive placements. Failed courses below 50% score 0.0 and must be cleared according to SRM arrear rules.',
    percentageNote:
      'Many SRM students estimate percentage as (CGPA / 10) × 100. SRM official documents may state a different multiplier — use the academic section\'s circular for certified conversions. This page gives planning numbers only.',
    faqs: [
      {
        q: 'What is the highest CGPA at SRM?',
        a: 'On the 10-point scale, the maximum is 10.00 — achievable with O grades in every credited course.',
      },
      {
        q: 'How is SRM CGPA different from Anna University GPA?',
        a: 'Letter bands and cut-offs differ even when both use 10-point terminology. Always calculate with SRM\'s published table, not a generic Anna University sheet.',
      },
      {
        q: 'Do SRM internal marks affect GPA before finals?',
        a: 'Your transcript shows final letter grades per course. Enter those letters here — internal weighting is already reflected in the published grade.',
      },
      {
        q: 'Can I improve CGPA after a low first year?',
        a: 'Later semesters with higher credits can pull CGPA up if you earn strong grades — use CGPA mode to model scenarios before registration.',
      },
      {
        q: 'Is attendance linked to GPA calculation?',
        a: 'Attendance can affect eligibility to sit exams, but GPA math uses letter grades and credits only once results are published.',
      },
      {
        q: 'Is this SRM CGPA calculator free?',
        a: 'Yes — entirely browser-based with no account required.',
      },
    ],
  },

  nust: {
    intro:
      'National University of Sciences and Technology (NUST) is Pakistan\'s premier STEM-focused university with campuses in Islamabad, Rawalpindi, and regional colleges. NUST follows the HEC 4.0 grading framework with plus/minus letters and strict quality-point rules. Use this calculator when you need a semester GPA or cumulative CGPA that aligns with NUST\'s official quality-point table — especially before HEC verification or graduate-school applications.',
    context:
      'NUST programmes blend military-college discipline with semester credits: labs, design projects, and professional courses all carry weight. Some schools publish minimum CGPA for graduation (often near 2.0) and higher bars for honours or Dean\'s List. If you are on academic warning, model recovery scenarios here before course add/drop deadlines.',
    howTo: [
      'Open Semester GPA and enter each course with credit hours from your NUST LMS or grade report.',
      'Select HEC letter grades (A through F with plus/minus variants) as shown on your result.',
      'Move to CGPA to aggregate multiple semesters — include every graded attempt listed on your transcript.',
      'For HEC attestation or foreign applications, request an official transcript from NUST\'s examinations office.',
    ],
    gradingNote:
      'NUST uses the HEC Pakistan 4.0 scale where A (90–100) = 4.00 and F (below 45) = 0.00. Minus grades (e.g., B- = 2.70) matter on tight merit lists. NUST\'s quality points per credit hour determine semester and cumulative averages — the same formula this calculator applies.',
    percentageNote:
      'HEC-affiliated universities do not share one public percentage multiplier. Some employers accept CGPA × 20 or CGPA × 25 informally — NUST\'s examinations branch can issue official conversion letters when required. Do not self-certify percentages for visa files.',
    faqs: [
      {
        q: 'How does NUST calculate CGPA?',
        a: 'Sum of (grade point × credit hours) for all courses divided by total credit hours attempted, per HEC guidelines reflected in NUST handbooks.',
      },
      {
        q: 'What CGPA is required to graduate from NUST?',
        a: 'Minimum graduation CGPA is programme-specific — commonly 2.00 on a 4.0 scale but confirm in your student handbook.',
      },
      {
        q: 'Are NUST and LUMS GPAs comparable?',
        a: 'Both may use 4.0 terminology but programme difficulty and grading culture differ. Compare transcripts side by side rather than raw numbers alone.',
      },
      {
        q: 'How do I recover from a failed course at NUST?',
        a: 'Failed courses earn 0.00 quality points. Retake policies vary by school — speak with your academic advisor and recalculate CGPA after results publish.',
      },
      {
        q: 'Does NUST count audit or pass/fail courses in CGPA?',
        a: 'Only credit-bearing graded courses on your transcript belong in CGPA calculations unless your handbook states otherwise.',
      },
      {
        q: 'Is this NUST calculator free?',
        a: 'Yes. Your entries never leave your browser.',
      },
    ],
  },

  utm: {
    intro:
      'Universiti Teknologi Malaysia (UTM) is one of Malaysia\'s leading IPTA engineering universities, grading on the standard Malaysian public-university 4.0 scale (A = 4.00 down to F). Students in Johor Bahru and Kuala Lumpur campuses use the same letter table for most undergraduate programmes. This calculator helps you track semester PNGS (GPA) and PNGK (CGPA) before results appear on the UTM student portal.',
    context:
      'UTM engineering curricula mix lecture, tutorial, and laboratory credits — especially in Faculty of Engineering and Faculty of Computing. Some courses use continuous assessment (40% coursework, 60% final); your transcript shows the final letter only. Students aiming for Dean\'s List or mobility programmes should monitor PNGK each semester because early weak grades are hard to offset later.',
    howTo: [
      'Choose Semester GPA and add each subject with SKS (credit hours) from your UTM course registration.',
      'Pick letter grades matching UTM\'s IPTA table — A (80–100) = 4.00, D (40–44) = 1.00, F below 40 = 0.00.',
      'Switch to CGPA to combine semesters into PNGK — weight by total SKS per semester.',
      'For MARA, JPA, or private scholarship forms, attach official UTM transcripts rather than calculator screenshots.',
    ],
    gradingNote:
      'UTM follows the Malaysian IPTA 4.0 grading system. An A- (75–79) earns 3.67 grade points — slightly different from some private Malaysian universities. Failing grades score 0.00 and remain on your record until you repeat the course under current UTM academic regulations.',
    percentageNote:
      'Many Malaysian faculties estimate marks as CGPA × 25 (so 3.60 PNGK ≈ 90%). UTM official documents may use different wording — check your faculty\'s academic guide or examination unit before citing a percentage on government forms.',
    faqs: [
      {
        q: 'What is the difference between PNGS and PNGK at UTM?',
        a: 'PNGS is semester GPA; PNGK is cumulative CGPA across all semesters. This calculator supports both modes.',
      },
      {
        q: 'How many SKS does UTM use per semester?',
        a: 'Typical undergraduate loads range from 15–20 SKS depending on programme. Enter exact credits from your registration slip.',
      },
      {
        q: 'What PNGK do I need for UTM Dean\'s List?',
        a: 'Dean\'s List criteria are published each session — often PNGK 3.50+ with no repeat grades. Verify in the current academic calendar.',
      },
      {
        q: 'Can I convert UTM CGPA to WAM for Australia applications?',
        a: 'Australian universities use their own conversion tools. Provide UTM\'s official transcript and let the admitting institution convert.',
      },
      {
        q: 'Does UTM use the same scale as UiTM?',
        a: 'Both IPTA universities use similar 4.0 frameworks but may differ slightly in plus/minus cut-offs — use the UTM table on this page.',
      },
      {
        q: 'Is this UTM CGPA calculator free?',
        a: 'Yes — no login required, runs entirely in your browser.',
      },
    ],
  },

  iub: {
    intro:
      'Independent University, Bangladesh (IUB) blends American-style semester credits with its own letter-grade cut-offs — similar to BRACU and NSU but not identical. Business, engineering, and environmental science programmes all reference IUB\'s 4.0 scale on transcripts. This calculator prevents the common error of applying public UGC grade boundaries to IUB results.',
    context:
      'IUB emphasises participation and continuous assessment; your final letter already reflects quizzes and projects. Credit loads vary — BBA students and EEE students should not share generic credit assumptions. Students applying abroad often need WES or similar evaluations; self-calculated GPAs help you plan, but embassies want registrar-sealed transcripts.',
    howTo: [
      'Start with Semester GPA and list courses from your IUB student information system.',
      'Select IUB letter grades — note that A starts at 90%, and F is below 45%.',
      'Use CGPA mode after multiple terms to see cumulative standing for probation or honours tracking.',
      'Compare with the official IUB portal before submitting internship or exchange applications.',
    ],
    gradingNote:
      'IUB assigns A (90–100) = 4.00 and steps down through plus/minus letters to F (0.00 below 45%). The gap between B+ (3.30) and A- (3.70) is only 0.40 points — small exam swings move semester GPA quickly in 3-credit cores like calculus or finance.',
    percentageNote:
      'IUB transcripts emphasise GPA rather than percentage. Informally, some students multiply CGPA by 25 for comparison with public universities — that is not an IUB-certified conversion. Contact the IUB registrar for official verification letters.',
    faqs: [
      {
        q: 'Is IUB\'s grading the same as NSU?',
        a: 'Both are private 4.0 systems but cut-offs differ. An 88% might be B+ at IUB and a different letter at NSU — always use IUB\'s table here.',
      },
      {
        q: 'How is IUB CGPA calculated?',
        a: 'Credit-weighted average of grade points across all attempted courses on your transcript, including failed grades per current policy.',
      },
      {
        q: 'What CGPA is needed for IUB academic honours?',
        a: 'Honours thresholds are listed in the IUB undergraduate bulletin — typically 3.50+ cumulative for Latin honours categories, subject to confirmation.',
      },
      {
        q: 'Can I exclude a failed course from CGPA?',
        a: 'Only if IUB\'s current academic policy allows grade replacement — otherwise F = 0.00 counts until resolved.',
      },
      {
        q: 'Does IUB use the UGC public scale?',
        a: 'No. IUB maintains its own letter-grade bands even though it operates under national accreditation frameworks.',
      },
      {
        q: 'Is this IUB calculator free?',
        a: 'Yes. No data is uploaded to our servers.',
      },
    ],
  },

  'national-university-bangladesh': {
    intro:
      'National University (NU) Bangladesh governs hundreds of affiliated colleges across the country — yet most honours programmes still grade on the UGC 4.0 national table. Whether you study at a Dhaka college or a district campus, your semester result sheet usually shows letter grades mapped to the same A+ through F boundaries. This calculator is built for NU honours and degree students who need GPA math without waiting for the NU results website to load.',
    context:
      'NU publishes results centrally but colleges administer exams locally — delays and re-scrutiny requests are common. Credits per paper depend on your honours subject (BA, BSc, BBA, etc.). If you have irregular papers or held results, include only the grades officially published on your NU transcript when calculating CGPA.',
    howTo: [
      'Select Semester GPA and enter each paper with its credit value from your honours registration.',
      'Use the UGC grade table — NU affiliated colleges typically map 80%+ to A+ (4.00) and below 40% to F (0.00).',
      'Switch to CGPA when combining Year 1, Year 2, and final-year semesters — weight by credits, not by year alone.',
      'For government job applications citing "NU CGPA," attach the official NU marksheet — this tool is for planning only.',
    ],
    gradingNote:
      'NU honours programmes generally follow the UGC Standard Grading System on a 4.0 scale. Because NU serves many colleges, occasional programme-specific notices appear — if your marksheet footnote lists different boundaries, trust the official letter on your sheet over generic tables.',
    percentageNote:
      'NU students often estimate percentage as CGPA × 25, especially when comparing with public university peers. NU\'s official documents may not show percentage at all — use letter grades and CGPA on forms unless a circular specifies otherwise.',
    faqs: [
      {
        q: 'Do all NU colleges use the same GPA scale?',
        a: 'Most honours programmes follow the national UGC 4.0 table. Professional programmes with separate accreditation may differ — check your marksheet footnotes.',
      },
      {
        q: 'How do I calculate NU honours CGPA?',
        a: 'Multiply each paper\'s grade point by its credits, sum, then divide by total credits completed across all published semesters.',
      },
      {
        q: 'Why is my NU result delayed compared to public universities?',
        a: 'NU centralises exams for affiliated colleges — processing time varies. This calculator works once letter grades are published.',
      },
      {
        q: 'Can I improve NU CGPA after a poor year?',
        a: 'Strong grades in later semesters with equal or higher credits can raise CGPA — model scenarios here before registration.',
      },
      {
        q: 'Is NU CGPA accepted for BCS or government jobs?',
        a: 'Eligible if your degree is recognised and meets circular requirements — submit official NU transcripts, not self-calculated sheets.',
      },
      {
        q: 'Is this NU CGPA calculator free?',
        a: 'Yes — completely free with no registration.',
      },
    ],
  },
};

export const UNIVERSITY_CONTENT_OVERRIDES = {
  ...CORE_OVERRIDES,
  ...bangladeshOverrides,
  ...indiaOverrides,
  ...pakistanOverrides,
  ...europeOverrides,
  ...malaysiaOverrides,
};

export function getUniversityContentOverride(slug) {
  return UNIVERSITY_CONTENT_OVERRIDES[slug] ?? null;
}
