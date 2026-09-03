/**
 * Hand-written SEO guide overrides — UK, Germany, and ECTS European universities.
 */

export const OVERRIDES = {
  'university-of-oxford': {
    intro:
      'University of Oxford does not award a simple cumulative CGPA like American or South Asian universities. Final degree class — First, Upper Second (2:1), Lower Second (2:2), or Third — comes from weighted averages of exam and coursework marks across your programme, often with prelims and finals counted differently. This calculator helps you estimate where your percentage average sits against UK honours boundaries, not multiply a fictional CGPA by 25.',
    context:
      'Oxford\'s collegiate system means your grade profile combines college tutorials with university-wide exams. History, PPE, and STEM courses use different assessment mixes — some are exam-heavy, others include dissertations worth large mark shares. If you are an international student comparing Oxford marks to a 4.0 GPA, use official conversion guidance from your college or the university registry, not informal online formulas.',
    howTo: [
      'Gather percentage marks (or class equivalents) for each assessed component from your Oxford student record or tutor reports.',
      'Enter credit-weighted modules if your programme publishes credit values — otherwise weight by the examination regulations for your course.',
      'Compare your weighted average against UK class boundaries: First (70%+), 2:1 (60–69%), 2:2 (50–59%), Third (40–49%).',
      'For US graduate school or employer forms, request an official Oxford transcript with degree class — self-calculated averages are planning tools only.',
    ],
    gradingNote:
      'Oxford follows UK honours classification where First Class requires 70% or above, Upper Second (2:1) is 60–69%, Lower Second (2:2) is 50–59%, Third Class is 40–49%, and below 40% is fail. There is no universal "Oxford CGPA" — your degree class or module percentages are the official record.',
    percentageNote:
      'UK degrees are expressed as classification bands, not CGPA × 25. A 68% average typically yields a 2:1 — do not apply Bangladesh-style percentage shortcuts. Oxford transcripts show marks and final class; use those for official applications.',
    faqs: [
      {
        q: 'Does Oxford use a 4.0 GPA scale?',
        a: 'No. Oxford uses percentage marks and UK honours degree classification. This calculator maps averages to class bands, not American GPA.',
      },
      {
        q: 'What average do I need for a First at Oxford?',
        a: 'Generally 70% or above across weighted assessments. Some programmes apply borderline rules — check your examination conventions.',
      },
      {
        q: 'How is Oxford final class calculated?',
        a: 'Programme-specific weighting of exams, coursework, and dissertation marks. Consult your course handbook for exact rules.',
      },
      {
        q: 'Can I convert Oxford 2:1 to US GPA?',
        a: 'Conversion tables vary by evaluator (WES, employers, graduate schools). Provide your official transcript and let them convert.',
      },
      {
        q: 'Do Oxford college tutorials affect my class?',
        a: 'If tutorial work counts toward published assessment weightings, include those marks. Rules differ by subject — check your handbook.',
      },
      {
        q: 'Is this Oxford calculator free?',
        a: 'Yes. Calculations run locally in your browser.',
      },
    ],
  },

  'university-of-cambridge': {
    intro:
      'University of Cambridge assesses undergraduates through Tripos exams, coursework, and college supervisions — culminating in a UK honours degree class rather than a rolling CGPA. A First requires sustained 70%+ performance, often across multiple exam sittings. This page helps Cambridge students map weighted percentage averages to First / 2:1 / 2:2 / Third boundaries instead of misapplying South Asian CGPA formulas.',
    context:
      'Cambridge programmes differ sharply: Natural Sciences, Engineering, and HSPS each publish their own assessment weightings. Part IA, IB, and II marks may combine with different weights for final class. International applicants comparing Cambridge results to IIT CPI or US GPA should rely on official transcript notes, not self-invented multipliers.',
    howTo: [
      'Collect percentage marks for each Tripos component from your Cambridge student portal or supervisor feedback.',
      'Weight modules according to your Tripos regulations — prelims and finals rarely count equally.',
      'Check your weighted average against UK class bands loaded in this calculator.',
      'For graduate applications, order an official Cambridge transcript showing degree class from the Student Registry.',
    ],
    gradingNote:
      'Cambridge uses UK honours classification: First (70%+), Upper Second / 2:1 (60–69%), Lower Second / 2:2 (50–59%), Third (40–49%), Fail (below 40%). College supervisions may feed into coursework marks but final class follows faculty examination conventions.',
    percentageNote:
      'Cambridge transcripts show marks and classification, not CGPA. Do not multiply averages by 25 — UK and Bangladesh percentage cultures differ. Use official documents for scholarships and visas.',
    faqs: [
      {
        q: 'Does Cambridge publish a CGPA?',
        a: 'Cambridge records percentage marks and degree class. There is no standard cumulative GPA like American universities.',
      },
      {
        q: 'What is a 2:1 at Cambridge worth internationally?',
        a: 'A 2:1 is the common threshold for UK graduate programmes and many employers. Foreign evaluators apply their own conversion tables.',
      },
      {
        q: 'How are Tripos marks weighted?',
        a: 'Each Tripos publishes weightings in the examination regulations. Part II often counts more than Part IA — read your handbook.',
      },
      {
        q: 'Can I estimate my class before final results?',
        a: 'Use weighted averages of known marks — but borderline rules and exam board discretion can shift final class. This is an estimate only.',
      },
      {
        q: 'Do Cambridge colleges use different grading scales?',
        a: 'Degree class is set at university level using faculty exam results. Colleges support teaching but do not issue separate GPA scales.',
      },
      {
        q: 'Is this Cambridge calculator free?',
        a: 'Yes — no login required.',
      },
    ],
  },

  'imperial-college-london': {
    intro:
      'Imperial College London is a STEM-focused Russell Group university where undergraduate degrees are classified as First, 2:1, 2:2, or Third based on weighted percentage averages — not on a 4.0 CGPA scale. Engineering, medicine, and natural sciences programmes at Imperial use rigorous exam and coursework mixes. This calculator helps Imperial students see how module marks aggregate toward UK honours boundaries.',
    context:
      'Imperial year-by-year marks often feed into final class with increasing weight on later years — especially MEng programmes. Failed modules can trigger resits that cap marks at pass level, affecting averages differently than a simple F = 0.0 GPA rule. Students targeting finance or consulting graduate schemes should know many UK employers cite 2:1 minimum — track your weighted average, not a converted GPA.',
    howTo: [
      'List each module with its credit value and percentage mark from Imperial\'s Student e-Service.',
      'Apply weightings from your programme handbook — later years may count double toward classification.',
      'Compare your cumulative weighted average to UK bands: First 70%+, 2:1 60–69%, 2:2 50–59%.',
      'For international applications, download official Imperial transcripts with degree classification.',
    ],
    gradingNote:
      'Imperial follows UK honours standards: First Class (70%+), Upper Second (2:1, 60–69%), Lower Second (2:2, 50–59%), Third (40–49%), Fail (below 40%). STEM programmes may apply compensation rules across failed modules — check your department examination conventions.',
    percentageNote:
      'Imperial transcripts show module percentages and final degree class. There is no Imperial-certified "CGPA × 25" formula — UK classification replaces that concept entirely.',
    faqs: [
      {
        q: 'Does Imperial use GPA or UK classification?',
        a: 'UK honours classification based on percentage averages. Imperial does not issue a standard American-style cumulative GPA on undergraduate transcripts.',
      },
      {
        q: 'What average do I need for a First at Imperial?',
        a: 'Typically 70%+ weighted across contributing modules. MEng and integrated masters may have additional rules.',
      },
      {
        q: 'How do resits affect Imperial classification?',
        a: 'Resit marks are often capped (commonly at 40% pass). This differs from GPA systems where retakes replace grades — check your programme rules.',
      },
      {
        q: 'Can Imperial marks convert to ECTS grades?',
        a: 'Imperial provides ECTS transcripts for mobility students. Use official conversion notes on those documents.',
      },
      {
        q: 'Is a 2:1 enough for Imperial postgraduate entry?',
        a: 'Many Imperial MSc programmes require 2:1 or First in a relevant degree — verify specific course entry requirements.',
      },
      {
        q: 'Is this Imperial calculator free?',
        a: 'Yes. Your data stays on your device.',
      },
    ],
  },

  ucl: {
    intro:
      'University College London (UCL) is one of London\'s largest Russell Group universities, awarding UK honours degrees classified as First, 2:1, 2:2, or Third from weighted module averages. UCL\'s diverse faculties — from laws and arts to engineering and medicine — share broad classification boundaries but differ in assessment structure. This calculator maps your percentage marks to UK class bands rather than inventing a CGPA.',
    context:
      'UCL modules carry credit values under the European Credit Transfer System for many programmes. Coursework, exams, and dissertations combine into module marks that roll up to year and final averages. Students on exchange or dual-degree tracks should use marks as recorded on UCL transcripts, not grades from partner universities converted informally.',
    howTo: [
      'Export module marks and credits from UCL\'s Portico student system.',
      'Calculate credit-weighted averages for each year, then apply final-degree weightings from your programme handbook.',
      'Compare totals to UK classification thresholds shown in this calculator.',
      'Order official UCL transcripts from the registry for employer or graduate-school verification.',
    ],
    gradingNote:
      'UCL applies UK honours classification: First (70%+), 2:1 (60–69%), 2:2 (50–59%), Third (40–49%), Fail (below 40%). Some programmes use pass/fail modules that do not enter the classification average — exclude them unless your handbook says otherwise.',
    percentageNote:
      'UCL degree certificates state classification, not CGPA. Percentage averages appear on transcripts but UK employers ask for class (e.g., "2:1") rather than a multiplied CGPA figure.',
    faqs: [
      {
        q: 'Does UCL calculate GPA?',
        a: 'UCL uses UK degree classification from percentage module marks. American-style GPA is not the standard undergraduate output.',
      },
      {
        q: 'What is a 2:1 at UCL in percentage terms?',
        a: 'Upper Second Class generally requires a weighted average of 60–69% across contributing modules.',
      },
      {
        q: 'How does UCL treat failed modules?',
        a: 'Failed modules may require resits with capped marks or compensation rules. This differs from 0.00 GPA point systems — read your programme regulations.',
      },
      {
        q: 'Can I use this for UCL postgraduate taught programmes?',
        a: 'Postgraduate programmes often use merit/distinction bands — different from undergraduate classification. Check your programme handbook.',
      },
      {
        q: 'Do UCL study-abroad marks count toward class?',
        a: 'Only if they appear as graded UCL credit on your transcript per mobility agreement rules.',
      },
      {
        q: 'Is this UCL calculator free?',
        a: 'Yes — entirely browser-based.',
      },
    ],
  },

  'university-of-manchester': {
    intro:
      'University of Manchester — one of the UK\'s largest campuses — awards honours degrees using standard British classification: First, Upper Second (2:1), Lower Second (2:2), and Third. Your final class comes from weighted averages across years and modules, not from a semester GPA multiplied each term. Manchester students in engineering, humanities, and life sciences all reference these boundaries on official transcripts.',
    context:
      'Manchester\'s credit framework aligns with UK national standards — most modules are 10, 15, or 20 credits. Year 2 and Year 3 marks often weigh more heavily toward final class than Year 1. Students comparing Manchester results with European ECTS partners should use transcript conversion notes, not guesswork.',
    howTo: [
      'Download module marks and credit values from Manchester\'s Student Portal.',
      'Weight each year according to your programme\'s classification rules — check the faculty handbook.',
      'Map your overall average to UK honours bands in this calculator.',
      'Request an official Manchester transcript for graduate schemes citing "minimum 2:1 degree."',
    ],
    gradingNote:
      'Manchester follows UK honours: First (70%+), 2:1 (60–69%), 2:2 (50–59%), Third (40–49%), Fail (below 40%). Professional programmes like medicine or pharmacy may use separate progression rules alongside classification.',
    percentageNote:
      'Manchester transcripts show percentages and final class. Do not apply CGPA × 25 — that formula belongs to different national systems. Use degree class on CVs for UK applications.',
    faqs: [
      {
        q: 'What average is a 2:1 at Manchester?',
        a: 'Upper Second Class typically means 60–69% weighted average across classification-contributing modules.',
      },
      {
        q: 'Does Manchester use American GPA?',
        a: 'Undergraduate degrees use UK classification, not US 4.0 GPA. Study-abroad transcripts may show partner institution grades separately.',
      },
      {
        q: 'How is Manchester final degree class calculated?',
        a: 'Programme-specific weighting of year marks — commonly Year 3 counts most. See your school examination conventions.',
      },
      {
        q: 'Can I improve my class with strong final-year marks?',
        a: 'Because later years often carry higher weight, strong final-year performance can pull classification up — model scenarios with weighted averages.',
      },
      {
        q: 'Do failed credits affect classification the same as GPA systems?',
        a: 'Fails may trigger resits or compensation. Manchester rules differ from "F = 0.00 grade points" — consult your advisor.',
      },
      {
        q: 'Is this Manchester calculator free?',
        a: 'Yes. No data uploaded to servers.',
      },
    ],
  },

  'university-of-edinburgh': {
    intro:
      'University of Edinburgh — Scotland\'s ancient research university — classifies honours degrees using UK-wide bands: First, 2:1, 2:2, and Third. Scottish degree structures often run four years for honours, with different year weightings than English three-year programmes. This calculator helps Edinburgh students translate credit-weighted percentage averages into classification estimates.',
    context:
      'Edinburgh\'s semester system uses SCQF credit points — typically 20 credits per standard module. Honours years (Years 3 and 4) usually dominate final classification. Students in informatics, medicine, or MA humanities should read school-specific examination regulations because dissertation weightings vary widely.',
    howTo: [
      'Collect module marks and SCQF credits from Edinburgh\'s EUCLID student system.',
      'Apply year weightings from your degree programme table — honours years typically outweigh pre-honours.',
      'Compare your weighted average to UK class boundaries loaded here.',
      'For US or Commonwealth applications, order official Edinburgh transcripts with stated degree class.',
    ],
    gradingNote:
      'Edinburgh applies UK honours classification: First (70%+), 2:1 (60–69%), 2:2 (50–59%), Third (40–49%), Fail (below 40%). Scottish General degrees (non-honours) follow different exit qualifications — this page focuses on honours classification math.',
    percentageNote:
      'Edinburgh degree transcripts state classification. Scottish and English UK universities share the same percentage bands for class — there is no separate "Scottish CGPA" multiplier.',
    faqs: [
      {
        q: 'Is Edinburgh grading different from English universities?',
        a: 'Honours classification bands (70/60/50/40) are UK-standard. Degree length and credit frameworks differ, not the class boundaries themselves.',
      },
      {
        q: 'How many credits is a full Edinburgh honours year?',
        a: 'Typically 120 SCQF credits per academic year. Enter actual credits from your transcript for weighted averages.',
      },
      {
        q: 'What is a 2:1 at Edinburgh?',
        a: 'Upper Second Class — generally 60–69% weighted average across honours-contributing modules.',
      },
      {
        q: 'Do Edinburgh study-abroad grades count toward class?',
        a: 'Only if credited as Edinburgh modules on your transcript under approved exchange rules.',
      },
      {
        q: 'Can I estimate class before final dissertation marks?',
        a: 'Use known marks and handbook weightings — dissertation results can shift borderline cases significantly.',
      },
      {
        q: 'Is this Edinburgh calculator free?',
        a: 'Yes — runs in your browser only.',
      },
    ],
  },

  'kings-college-london': {
    intro:
      'King\'s College London (KCL) is a central London Russell Group university where undergraduate honours degrees are classified as First, 2:1, 2:2, or Third from weighted module percentages. Law, nursing, war studies, and STEM programmes at King\'s share the same broad UK boundaries but use different assessment mixes. This page helps KCL students estimate classification — not a fictional semester CGPA.',
    context:
      'King\'s modules are credit-rated under the UK framework — many programmes use 15-credit units. Clinical programmes may include pass/fail placements that sit outside honours classification averages. Students applying to the Bar, NHS bands, or City graduate schemes should cite official KCL degree class on transcripts.',
    howTo: [
      'Pull module marks and credits from King\'s Student Records (KEATS/Student Records).',
      'Weight years and modules per your faculty classification scheme — later years often dominate.',
      'Check your cumulative average against UK honours thresholds in this calculator.',
      'Request official KCL transcripts from Student Records for verified classification.',
    ],
    gradingNote:
      'King\'s follows UK honours: First (70%+), 2:1 (60–69%), 2:2 (50–59%), Third (40–49%), Fail (below 40%). Some programmes apply borderline uplift rules — a 69.5% might be reviewed upward depending on examination board policy.',
    percentageNote:
      'KCL certificates and transcripts show degree class. UK employers expect "2:1 in [subject]" rather than a percentage derived from CGPA multiplication.',
    faqs: [
      {
        q: 'Does King\'s College London use GPA?',
        a: 'Standard UK undergraduate honours classification from percentage marks — not American cumulative GPA.',
      },
      {
        q: 'What do I need for a First at King\'s?',
        a: 'Typically 70%+ weighted average. Competitive programmes may require strong dissertation marks as well.',
      },
      {
        q: 'How are King\'s failed modules handled?',
        a: 'Resits and compensation rules vary by faculty. Unlike 4.0 GPA systems, capped resit marks may apply — check your handbook.',
      },
      {
        q: 'Is KCL classification recognised abroad?',
        a: 'Yes — with official transcripts. Evaluators like WES apply their own conversion; provide sealed KCL documents.',
      },
      {
        q: 'Do King\'s intercalated degrees affect classification?',
        a: 'Medical and dental intercalated years follow programme-specific rules — consult your school examination office.',
      },
      {
        q: 'Is this KCL calculator free?',
        a: 'Yes. No login required.',
      },
    ],
  },

  'tu-munich': {
    intro:
      'Technical University of Munich (TUM) grades on the German numeric scale where 1.0 is excellent and 4.0 is a narrow pass — higher numbers mean worse performance, opposite to American GPA. A TUM grade of 2.3 is genuinely good, not a weak mark. This calculator helps you track module grades and estimate degree averages using the inverted 1.0–5.0 system, not a 4.0 CGPA multiplied by 25.',
    context:
      'TUM engineering and natural science programmes use credits under the European Credit Transfer System (ECTS). Module grades combine exams, labs, and project work into single German marks (often one decimal place). Your final degree grade is typically a credit-weighted average of module marks — lower is better. International students comparing TUM results to US or South Asian GPAs need official conversion tables from TUM or evaluators like WES.',
    howTo: [
      'List each module with ECTS credits and German grade (1.0–5.0) from TUM TUMonline.',
      'Calculate the credit-weighted average — remember lower numbers are better on the German scale.',
      'Marks above 4.0 are fail (nicht bestanden) and usually must be repeated.',
      'For abroad applications, request an official TUM transcript with degree grade (Gesamtnote) from the student office.',
    ],
    gradingNote:
      'TUM uses the German 1.0–5.0 scale: 1.0–1.5 sehr gut (very good), 1.6–2.5 gut (good), 2.6–3.5 befriedigend (satisfactory), 3.6–4.0 ausreichend (sufficient pass), above 4.0 nicht bestanden (fail). A 2.0 average represents solid performance — do not read it like a 2.0 American GPA.',
    percentageNote:
      'German universities do not express degrees as CGPA × 25 percentages. TUM transcripts show numeric German grades and ECTS credits. Use official conversion documents for employers expecting percentage or 4.0 GPA.',
    faqs: [
      {
        q: 'Is a lower or higher number better at TUM?',
        a: 'Lower is better. 1.0 is excellent; 4.0 is minimum pass; above 4.0 is fail. This is opposite to US GPA.',
      },
      {
        q: 'How is TUM final degree grade calculated?',
        a: 'Credit-weighted average of module grades (ECTS-weighted). Thesis grade often carries significant weight — check Prüfungsordnung.',
      },
      {
        q: 'Can I convert TUM 2.3 to US GPA?',
        a: 'Use official conversion tables from TUM or credential evaluators — do not apply simple linear formulas.',
      },
      {
        q: 'What TUM average is competitive for PhD programmes?',
        a: 'STEM fields often expect gut (roughly 2.5 or better) or stronger — requirements vary by chair and programme.',
      },
      {
        q: 'Do failed modules count as 5.0 in averages?',
        a: 'Failed attempts must usually be repeated and passed. Until passed, they block progression — check your examination regulations.',
      },
      {
        q: 'Is this TUM calculator free?',
        a: 'Yes. Calculations stay on your device.',
      },
    ],
  },

  'lmu-munich': {
    intro:
      'Ludwig Maximilian University of Munich (LMU) is one of Germany\'s oldest research universities, grading on the standard German 1.0 (best) to 5.0 (fail) numeric scale. Humanities, medicine, and sciences at LMU all publish module marks where lower numbers indicate stronger performance. This calculator respects that inverted logic — essential for anyone used to American or South Asian GPA systems.',
    context:
      'LMU programmes span Staatsexamen, bachelor\'s, and master\'s tracks with different examination offices (Prüfungsämter). ECTS credits weight module contributions to degree averages. Medical students follow separate clinical assessment rules — this page suits standard graded modules with numeric German marks.',
    howTo: [
      'Collect module grades and ECTS credits from LMU LSF / student portal printouts.',
      'Compute credit-weighted averages — lower results are better on the German scale.',
      'Flag any grade above 4.0 as fail requiring retake under Prüfungsordnung.',
      'Order official LMU transcripts (Zeugnis) for applications requiring certified degree grades.',
    ],
    gradingNote:
      'LMU applies German grading: 1.0–1.5 sehr gut, 1.6–2.5 gut, 2.6–3.5 befriedigend, 3.6–4.0 ausreichend, above 4.0 nicht bestanden. Bachelor and master thesis grades often weigh heavily in the final Gesamtnote.',
    percentageNote:
      'LMU does not issue CGPA or simple percentage equivalents on standard transcripts. Numeric German grades with ECTS credits are the official record — conversion is evaluator-specific.',
    faqs: [
      {
        q: 'Is LMU grading the same as TUM?',
        a: 'Both use the standard German 1.0–5.0 system with lower-is-better logic. Programme-specific examination rules differ.',
      },
      {
        q: 'What LMU grade is considered good?',
        a: 'Gut (roughly 1.6–2.5) or better is strong for most programmes. Exact expectations vary by faculty.',
      },
      {
        q: 'How do ECTS credits affect LMU averages?',
        a: 'Module grades are weighted by ECTS credits when computing degree averages — same principle as GPA credit weighting but inverted scale.',
      },
      {
        q: 'Can I compare LMU marks to UK 2:1?',
        a: 'Rough informal comparisons exist but official equivalency requires credential evaluation services — provide LMU transcripts.',
      },
      {
        q: 'Do Staatsexamen programmes use this scale?',
        a: 'State examination programmes may report pass/fail and separate assessments — confirm with your Prüfungsamt.',
      },
      {
        q: 'Is this LMU calculator free?',
        a: 'Yes — no registration required.',
      },
    ],
  },

  'heidelberg-university': {
    intro:
      'Heidelberg University — Germany\'s oldest university — uses the national 1.0 to 5.0 grading scale where 1.0 marks excellent work and 4.0 is the minimum pass. Nestled in Baden-Württemberg\'s research hub, Heidelberg programmes in medicine, law, and sciences all report numeric module grades, not American-style semester GPAs. This calculator helps you weight ECTS credits correctly on the inverted German scale.',
    context:
      'Heidelberg\'s research reputation draws international students who often misread a 2.7 as "bad" because it looks like a US C+. In Germany, 2.7 falls in befriedigend — a respectable pass. Degree final grades combine module marks with thesis weightings defined in each programme\'s Prüfungsordnung.',
    howTo: [
      'Export module list with ECTS credits and grades from Heidelberg\'s heiCO platform.',
      'Calculate weighted averages remembering lower numbers are better.',
      'Treat grades above 4.0 as failed modules requiring repetition.',
      'Request official Heidelberg transcripts from the student administration for certified degree grades.',
    ],
    gradingNote:
      'Heidelberg follows German grading bands: sehr gut (1.0–1.5), gut (1.6–2.5), befriedigend (2.6–3.5), ausreichend (3.6–4.0), nicht bestanden (above 4.0). Law and medicine programmes may add state examination components with separate reporting.',
    percentageNote:
      'Heidelberg transcripts show numeric grades, not percentage CGPA. Do not apply CGPA × 25 — use official documents or evaluator conversion for international forms.',
    faqs: [
      {
        q: 'What does 2.0 mean at Heidelberg?',
        a: 'A 2.0 is gut (good) — strong performance on the German scale. It is not equivalent to a 2.0 American GPA.',
      },
      {
        q: 'How is Heidelberg degree grade computed?',
        a: 'ECTS-weighted average of module grades plus thesis per programme regulations — lower average is better.',
      },
      {
        q: 'Is Heidelberg grading ECTS-compatible?',
        a: 'Yes — ECTS credits appear on transcripts for mobility. Letter ECTS grades may appear on mobility sheets separately from numeric German marks.',
      },
      {
        q: 'Can I improve my final grade with a strong thesis?',
        a: 'Thesis weight varies — often 15–30% of final grade. Check your Fachprüfungsordnung for exact weighting.',
      },
      {
        q: 'Do failed exams count as 5.0?',
        a: 'Fails must be retaken. They block credit until passed — handling differs from averaging 0.0 GPA points.',
      },
      {
        q: 'Is this Heidelberg calculator free?',
        a: 'Yes. Your entries never leave your browser.',
      },
    ],
  },

  'sorbonne-university': {
    intro:
      'Sorbonne University in Paris aligns with the European Credit Transfer and Accumulation System (ECTS), reporting grades on the A–F scale where A means excellent (roughly 90%+) and E is the minimum pass. French undergraduate programmes combine continuous assessment (contrôle continu) with exams — your transcript shows ECTS grades and credits, not a US-style 4.0 CGPA. This calculator maps ECTS letter performance for semester and cumulative tracking.',
    context:
      'Sorbonne merges arts, sciences, and medicine faculties with research-intensive curricula. ECTS credits (typically 30 per semester) weight module contributions. International mobility students often receive both French numeric marks and ECTS letters — use the grade recorded for GPA-style estimates on this page.',
    howTo: [
      'List each module with ECTS credits and ECTS letter grade (A through F) from Sorbonne student records.',
      'Map letters to grade points using the ECTS table — A = 4.0 equivalent, F = fail at 0.0.',
      'Compute credit-weighted averages across semesters for cumulative standing.',
      'For applications outside Europe, request official Sorbonne transcripts with ECTS appendix from the registrar.',
    ],
    gradingNote:
      'Sorbonne uses ECTS grading: A (90–100, excellent), B (80–89, very good), C (70–79, good), D (60–69, satisfactory), E (50–59, sufficient pass), F (below 50, fail). French national marks may appear separately — ECTS letters standardise cross-border comparison.',
    percentageNote:
      'ECTS grades describe performance bands, not a single national percentage formula. Sorbonne transcripts include ECTS credits and grades — avoid multiplying by arbitrary factors; use diploma supplement notes for conversions.',
    faqs: [
      {
        q: 'What is ECTS grading at Sorbonne?',
        a: 'Letters A–F with defined percentage bands, designed for European credit mobility. F below 50% fails the module.',
      },
      {
        q: 'How many ECTS credits per semester at Sorbonne?',
        a: 'Typically 30 ECTS per semester in full-time bachelor programmes — verify on your learning agreement.',
      },
      {
        q: 'Can I convert Sorbonne ECTS to US GPA?',
        a: 'Credential evaluators apply proprietary tables. Provide official transcripts with ECTS appendix.',
      },
      {
        q: 'Does contrôle continu affect ECTS grades?',
        a: 'Continuous assessment feeds final module marks that map to ECTS letters on your transcript.',
      },
      {
        q: 'Is E the same as a pass?',
        a: 'E (50–59%) is minimum pass — sufficient but weak for competitive master\'s applications.',
      },
      {
        q: 'Is this Sorbonne calculator free?',
        a: 'Yes — browser-based, no signup.',
      },
    ],
  },

  'tu-delft': {
    intro:
      'Delft University of Technology (TU Delft) is the Netherlands\' top engineering school, grading on the European ECTS A–F scale with credits weighted across semesters. Dutch programmes emphasise project work and design — module grades reflect exams plus team projects. This calculator uses ECTS letter-to-point mapping so TU Delft students can track semester averages without misapplying American GPA rules.',
    context:
      'TU Delft bachelor programmes typically require 180 ECTS over three years — intensive project credits in aerospace, civil, and computer science. Binding study advice (BSA) uses first-year credit thresholds separate from letter averages — pass enough credits first, then optimise grades. International students comparing TU Delft to German 1.0–5.0 or UK classification need ECTS transcripts.',
    howTo: [
      'Export module grades and ECTS credits from TU Delft Osiris student portal.',
      'Select ECTS letter grades — A (excellent) through E (pass), F (fail).',
      'Calculate credit-weighted semester and cumulative averages using ECTS points.',
      'Download official TU Delft transcripts with ECTS diploma supplement for abroad applications.',
    ],
    gradingNote:
      'TU Delft applies ECTS grading: A (90–100), B (80–89), C (70–79), D (60–69), E (50–59), F (below 50 fail). Dutch numerus clausus master\'s programmes may set minimum C or B averages — check programme entry rules.',
    percentageNote:
      'TU Delft transcripts show ECTS grades and credits. There is no Dutch universal "CGPA × 25" — use diploma supplement conversion notes for employers outside Europe.',
    faqs: [
      {
        q: 'What ECTS grade is good at TU Delft?',
        a: 'B or A indicates strong performance. C is satisfactory — common for demanding engineering courses.',
      },
      {
        q: 'How does TU Delft BSA relate to GPA?',
        a: 'BSA checks first-year credit completion (often 45+ ECTS). Letter averages are separate — meet BSA to continue.',
      },
      {
        q: 'Is TU Delft grading the same as University of Amsterdam?',
        a: 'Both Dutch universities use ECTS-compatible frameworks — letter bands align broadly but programme rules differ.',
      },
      {
        q: 'Do project modules count like exam modules?',
        a: 'If they carry ECTS credits and letter grades on your transcript, include them in weighted averages.',
      },
      {
        q: 'Can I convert TU Delft ECTS to German 1.0 scale?',
        a: 'No simple universal formula — use official mobility conversion documents or credential evaluators.',
      },
      {
        q: 'Is this TU Delft calculator free?',
        a: 'Yes. No data uploaded.',
      },
    ],
  },

  'university-of-amsterdam': {
    intro:
      'University of Amsterdam (UvA) is a major Dutch research university using ECTS credits and A–F letter grades across economics, humanities, and science faculties. UvA bachelor programmes track 180 ECTS over three years with semester workloads around 30 ECTS. This calculator helps UvA students compute credit-weighted averages on the European scale — not a fictional 4.0 CGPA.',
    context:
      'UvA\'s grading culture can feel lenient to students from strict curve systems — a C (70–79%) represents good work in Dutch context. First-year BSA rules require minimum credits passed to continue. Students in PPLE, econometrics, or psychology should enter grades exactly as Osiris displays them.',
    howTo: [
      'Pull module list with ECTS credits and grades from UvA SIS / Osiris.',
      'Map each module to ECTS letters A through F using the table on this page.',
      'Weight by ECTS credits for semester and cumulative averages.',
      'Order official UvA transcripts with diploma supplement for international graduate applications.',
    ],
    gradingNote:
      'UvA uses ECTS grading: A (90–100 excellent), B (80–89 very good), C (70–79 good), D (60–69 satisfactory), E (50–59 sufficient), F (below 50 fail). Honours programmes may require B+ averages for continuation.',
    percentageNote:
      'UvA transcripts emphasise ECTS grades and credits. Percentage conversion for non-European employers should come from official diploma supplement text, not online multipliers.',
    faqs: [
      {
        q: 'Is a C grade bad at UvA?',
        a: 'C (70–79%) is "good" on the ECTS scale — respectable performance, especially in quantitative programmes.',
      },
      {
        q: 'How many ECTS is a UvA bachelor?',
        a: '180 ECTS total — typically 60 ECTS per year if studying full-time without delays.',
      },
      {
        q: 'Does UvA use GPA?',
        a: 'UvA reports ECTS letter grades and credits. American-style cumulative GPA is not the standard Dutch output.',
      },
      {
        q: 'What happens if I fail a module at UvA?',
        a: 'F (below 50%) requires retake. Resit rules and BSA credit counts are in your programme regulations.',
      },
      {
        q: 'Can UvA ECTS convert to UK 2:1?',
        a: 'Rough comparisons exist but official equivalency needs credential evaluation — provide UvA transcripts.',
      },
      {
        q: 'Is this UvA calculator free?',
        a: 'Yes — runs entirely in your browser.',
      },
    ],
  },

  'trinity-college-dublin': {
    intro:
      'Trinity College Dublin (TCD) — Ireland\'s oldest university — uses ECTS-compatible grading with A–F letters on module transcripts, alongside traditional Irish percentage marks for many programmes. Final honours degrees may still reference UK-style classification (First, 2:1, etc.) depending on programme. This calculator supports ECTS letter credit-weighted averages for modules graded on the European A–F scale.',
    context:
      'Trinity\'s historic campus hosts programmes from liberal arts to engineering with varying assessment styles. ECTS credits facilitate Erasmus mobility — exchange grades appear on transcripts with ECTS letters. Students applying to UK or EU graduate schools should provide Trinity\'s official transcript and diploma supplement rather than self-converted GPAs.',
    howTo: [
      'Download module marks, ECTS credits, and letter grades from Trinity\'s my.tcd.ie portal.',
      'Enter ECTS letter grades (A–F) with corresponding credits for each module.',
      'Compute weighted semester and cumulative averages using the ECTS table.',
      'For US applications, order official Trinity transcripts — WES and similar services handle conversion.',
    ],
    gradingNote:
      'Trinity modules on ECTS scale use: A (90–100 excellent), B (80–89 very good), C (70–79 good), D (60–69 satisfactory), E (50–59 sufficient), F (below 50 fail). Some programmes also report percentage marks mapping to I–IV honours class boundaries — check your school handbook.',
    percentageNote:
      'Irish and UK-linked programmes may show both percentages and class. ECTS letters do not convert via CGPA × 25 — use Trinity\'s diploma supplement for official equivalency statements.',
    faqs: [
      {
        q: 'Does Trinity use GPA or ECTS grades?',
        a: 'Modules show ECTS-compatible letters and credits. Final degree may also state I/II.i/II.ii class depending on programme.',
      },
      {
        q: 'How many ECTS credits per year at Trinity?',
        a: 'Typically 60 ECTS per academic year in standard full-time undergraduate load — confirm your programme schedule.',
      },
      {
        q: 'Is Trinity grading similar to UK universities?',
        a: 'Classification boundaries align broadly with UK norms for many honours degrees. ECTS letters standardise European mobility.',
      },
      {
        q: 'What ECTS grade do I need for Trinity postgraduate entry?',
        a: 'Programme-specific — competitive courses often expect B average or better. Check course entry requirements.',
      },
      {
        q: 'Do Erasmus modules count in Trinity averages?',
        a: 'If credited on your Trinity transcript with ECTS grades, include them in weighted calculations.',
      },
      {
        q: 'Is this Trinity calculator free?',
        a: 'Yes. No login required.',
      },
    ],
  },
};
