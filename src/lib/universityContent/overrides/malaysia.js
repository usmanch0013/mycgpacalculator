/**
 * Hand-written SEO guide overrides — Malaysia universities (excluding UTM in main overrides file).
 */

export const OVERRIDES = {
  uitm: {
    intro:
      'Universiti Teknologi MARA (UiTM) is Malaysia\'s largest public university, serving hundreds of thousands of students across campuses from Shah Alam to every state. UiTM grades on the standard Malaysian IPTA 4.0 scale — A = 4.00 down to F below 40% = 0.00. Whether you study business, engineering, or health sciences under UiTM, semester PNGS and cumulative PNGK follow credit-weighted grade point math. This calculator loads UiTM\'s IPTA table for accurate results.',
    context:
      'UiTM\'s bumiputera-focused mission shapes a vast programme catalogue with different credit loads per faculty. Continuous assessment, final exams, and practicum components combine into one letter grade per course on i-Student. Students aiming for Dean\'s List, MARA loan renewal, or public-sector scholarships should monitor PNGK each semester — early weak grades are hard to offset later.',
    howTo: [
      'Choose Semester GPA and add each subject with SKS (credit hours) from your UiTM course registration on i-Student.',
      'Pick letter grades matching IPTA table — A (80–100) = 4.00, A- (75–79) = 3.67, F below 40 = 0.00.',
      'Switch to CGPA to combine semesters into PNGK — weight by total SKS per semester.',
      'For MARA, JPA, or PTPTN forms, attach official UiTM transcripts rather than calculator screenshots.',
    ],
    gradingNote:
      'UiTM follows the Malaysian IPTA 4.0 grading system. An A- (75–79) earns 3.67 grade points — slightly different from some private universities. Failing grades score 0.00 and remain on record until you repeat the course under current UiTM academic regulations.',
    percentageNote:
      'Many UiTM faculties estimate marks as PNGK × 25 (so 3.60 ≈ 90%). UiTM official documents may use different wording — check your faculty\'s academic guide before citing percentage on government forms.',
    faqs: [
      {
        q: 'What is the difference between PNGS and PNGK at UiTM?',
        a: 'PNGS is semester GPA; PNGK is cumulative CGPA across all semesters. This calculator supports both modes.',
      },
      {
        q: 'How many SKS does UiTM use per semester?',
        a: 'Typical loads range from 14–18 SKS depending on programme and diploma/degree level. Enter exact credits from registration.',
      },
      {
        q: 'What PNGK do I need for UiTM Dean\'s List?',
        a: 'Dean\'s List criteria are published each session — often PNGK 3.50+ with no repeat grades. Verify in the academic calendar.',
      },
      {
        q: 'Does UiTM use the same scale as UTM?',
        a: 'Both IPTA universities use similar 4.0 frameworks with A at 80%+. Use the UiTM table on this page for UiTM results.',
      },
      {
        q: 'Can I convert UiTM PNGK to WAM for Australia applications?',
        a: 'Australian universities apply their own conversion tools. Provide UiTM\'s official transcript and let the admitting institution convert.',
      },
      {
        q: 'Is this UiTM CGPA calculator free?',
        a: 'Yes — no login required, runs entirely in your browser.',
      },
    ],
  },

  utar: {
    intro:
      'Universiti Tunku Abdul Rahman (UTAR) is one of Malaysia\'s largest private universities, with campuses in Kampar and Sungai Long offering programmes from accounting to engineering. UTAR publishes its own grade boundaries on a 4.0 scale — similar to IPTA but with a 45% fail line instead of 40%. This calculator uses UTAR\'s exact letter-to-point mapping so your CGPA matches the MYUTAR portal.',
    context:
      'UTAR runs tri-semester or semester schedules depending on faculty — credit totals vary between Foundation, degree, and postgraduate levels. Continuous assessment feeds final letters on student result slips. Students comparing UTAR CGPA with public IPTA peers should remember UTAR\'s D grade spans 45–49% at 1.0 points, and F starts below 45%.',
    howTo: [
      'Select Semester GPA and list subjects with credit hours from your UTAR course registration.',
      'Choose UTAR letter grades — A = 4.00 (80–100), A- = 3.70 (75–79), F below 45 = 0.00.',
      'Use CGPA mode to track cumulative standing across semesters for honours or scholarship eligibility.',
      'Cross-check with MYUTAR before submitting internship or bank guarantee forms.',
    ],
    gradingNote:
      'UTAR assigns A = 4.00 (80–100), A- = 3.70 (75–79), B+ = 3.30 (70–74), down to D = 1.00 (45–49), and F = 0.00 below 45%. The 45% failure boundary differs from IPTA\'s 40% — a 42% might fail at UTAR but earn D points at some public universities.',
    percentageNote:
      'UTAR transcripts show CGPA and letter grades. Informal PNGK × 25 estimates are common but not UTAR-certified — request verification from the examination unit for official forms.',
    faqs: [
      {
        q: 'Is UTAR grading the same as UiTM?',
        a: 'Both use 4.0 scales but cut-offs differ — UTAR fails below 45%, many IPTA programmes below 40%. Use UTAR\'s table here.',
      },
      {
        q: 'How is UTAR semester GPA calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester per UTAR academic regulations.',
      },
      {
        q: 'What CGPA is needed for UTAR graduation with honours?',
        a: 'Honours thresholds are in the UTAR academic handbook — typically 3.50+ cumulative but confirm current rules.',
      },
      {
        q: 'Do UTAR Kampar and Sungai Long use the same scale?',
        a: 'Yes — grading is university-wide. Enter grades from your campus transcript.',
      },
      {
        q: 'Can I improve UTAR CGPA after retaking a failed course?',
        a: 'Retake policies determine how improved grades appear. An F (0.00) hurts until resolved — model recovery in CGPA mode.',
      },
      {
        q: 'Is this UTAR calculator free?',
        a: 'Yes. Calculations happen locally in your browser.',
      },
    ],
  },

  upm: {
    intro:
      'Universiti Putra Malaysia (UPM) in Serdang is a research-intensive public university strong in agriculture, forestry, engineering, and veterinary medicine. UPM grades on the Malaysian IPTA 4.0 scale — A through F with plus/minus variants. Students tracking PNGS and PNGK for JPA scholarships, Dean\'s List, or mobility programmes can use this calculator with UPM\'s standard grade boundaries.',
    context:
      'UPM\'s campus combines field work, laboratories, and lecture courses — agriculture and vet programmes carry practicum credits that count in GPA if graded. Faculty of Engineering and Faculty of Computer Science share the IPTA table but differ in credit loads. Students comparing UPM with UM or USM should use each institution\'s official letters — scales align but programme difficulty varies.',
    howTo: [
      'Open Semester GPA and enter each subject with SKS from your UPM UPMePortal registration.',
      'Map letter grades to IPTA table — A (80–100) = 4.00, F below 40 = 0.00.',
      'Switch to CGPA for PNGK across semesters — weight by SKS per term.',
      'For scholarship or civil-service forms, attach official UPM transcripts.',
    ],
    gradingNote:
      'UPM follows Malaysian IPTA 4.0 grading: A = 4.00, A- = 3.67 (75–79), B+ = 3.33 (70–74), and F = 0.00 below 40%. Research programmes may set higher CGPA bars for thesis continuation beyond minimum pass.',
    percentageNote:
      'UPM students often use PNGK × 25 for rough percentage estimates. Faculty offices may publish different multipliers — verify before submitting MARA or JPA documentation.',
    faqs: [
      {
        q: 'What PNGK do I need for UPM Dean\'s List?',
        a: 'Criteria are published each session — often 3.50+ with full credit load. Check the current academic calendar.',
      },
      {
        q: 'How is UPM semester PNGS calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester per UPM academic rules.',
      },
      {
        q: 'Do UPM field practicum courses count in CGPA?',
        a: 'If they appear as graded credit-bearing courses on your transcript, include them with their letter grades.',
      },
      {
        q: 'Is UPM grading the same as Universiti Malaya?',
        a: 'Both IPTA universities use the standard 4.0 framework with similar boundaries. Always enter UPM portal letters.',
      },
      {
        q: 'Can I convert UPM CGPA for UK postgraduate applications?',
        a: 'Provide UPM\'s official transcript — admitting universities apply their own conversion tables.',
      },
      {
        q: 'Is this UPM calculator free?',
        a: 'Yes — no signup required.',
      },
    ],
  },

  'universiti-malaya': {
    intro:
      'Universiti Malaya (UM) in Kuala Lumpur is Malaysia\'s oldest university and consistently tops national rankings. UM grades on the IPTA 4.0 scale where A = 4.00 and F below 40% = 0.00 — the benchmark many other public universities follow. Whether you study medicine, law, or engineering at UM, PNGK drives Dean\'s List, scholarship renewal, and competitive graduate admission.',
    context:
      'UM\'s valley campus hosts high-demand programmes with strict entry and continuation requirements. Some faculties publish minimum PNGK for programme progression — especially professional courses. Students on PTPTN or JPA sponsorship should track PNGK each semester because sponsors often set continuing eligibility thresholds.',
    howTo: [
      'Choose Semester GPA and list subjects with SKS from your UM student portal (UM Portal).',
      'Select IPTA letter grades exactly as UM publishes — A (80–100) = 4.00 down to F = 0.00.',
      'Use CGPA mode to combine semesters into PNGK — weight by SKS, never simple-average semester GPAs.',
      'Download official UM transcripts for employer or embassy verification.',
    ],
    gradingNote:
      'UM applies the Malaysian IPTA 4.0 system: A = 4.00 (80–100), A- = 3.67 (75–79), B+ = 3.33 (70–74), F = 0.00 below 40%. Because UM cohorts are academically strong, PNGK distributions are compressed — a 3.30 may still reflect solid performance.',
    percentageNote:
      'UM students commonly estimate percentage as PNGK × 25. UM examination section may provide official conversion for specific forms — do not self-certify for scholarship appeals.',
    faqs: [
      {
        q: 'What PNGK is considered good at Universiti Malaya?',
        a: 'Competitive programmes often see top students above 3.70 PNGK. Employer and scholarship cut-offs vary — check specific requirements.',
      },
      {
        q: 'How is UM PNGK calculated?',
        a: 'Total grade points (grade point × SKS) divided by total SKS attempted across all semesters on your transcript.',
      },
      {
        q: 'Does UM use the same scale as private universities?',
        a: 'UM follows IPTA 4.0. Private universities like UTAR may differ in fail boundaries — use UM\'s table for UM results.',
      },
      {
        q: 'What PNGK do I need for UM Dean\'s List?',
        a: 'Published each session — typically 3.50+ with minimum SKS and no repeats. Verify current faculty notices.',
      },
      {
        q: 'Can I improve UM PNGK after a weak first year?',
        a: 'Later semesters with higher SKS can pull PNGK up with strong grades — model scenarios before course registration.',
      },
      {
        q: 'Is this UM calculator free?',
        a: 'Yes. Your grades stay on your device.',
      },
    ],
  },

  usm: {
    intro:
      'Universiti Sains Malaysia (USM) in Penang is Malaysia\'s APEX university, known for research, medicine, and sustainable technology programmes. USM grades on the standard IPTA 4.0 scale shared across Malaysian public universities. Students at the main Minden campus or health campus in Kubang Kerian use the same A through F letter table for PNGS and PNGK calculations.',
    context:
      'USM emphasises interdisciplinary research — many programmes include project credits and industrial training with graded components. Main campus engineering and pure sciences carry different SKS patterns than health sciences. Students applying for USM internal scholarships or exchange programmes should export official transcripts; self-calculated PNGK helps planning only.',
    howTo: [
      'Select Semester GPA and enter each course with SKS from your USM student portal (AIMS).',
      'Pick IPTA letter grades — A = 4.00 (80–100), F below 40 = 0.00.',
      'Switch to CGPA to track PNGK across semesters for APEX mobility or honours eligibility.',
      'Cross-check with USM results before submitting JPA or private scholarship forms.',
    ],
    gradingNote:
      'USM follows Malaysian IPTA 4.0 grading where A- (75–79) = 3.67 and F below 40% = 0.00. APEX status means USM participates in international rankings — accurate PNGK matters for foreign graduate applications alongside research output.',
    percentageNote:
      'USM faculties often cite PNGK × 25 as informal percentage. Official USM documents may word conversions differently — check your faculty examination office for certified figures.',
    faqs: [
      {
        q: 'What is APEX status and does it affect grading?',
        a: 'APEX is a federal research excellence label — grading still follows standard IPTA 4.0 rules.',
      },
      {
        q: 'How is USM semester PNGS calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester per USM academic regulations.',
      },
      {
        q: 'Do USM industrial training credits count in PNGK?',
        a: 'If industrial training appears as a graded credit course on your transcript, include it with its letter grade.',
      },
      {
        q: 'Is USM grading the same as UPM?',
        a: 'Both use IPTA 4.0 with aligned boundaries. Enter grades from your USM official result slip.',
      },
      {
        q: 'What PNGK do I need for USM postgraduate entry?',
        a: 'Programme-specific — competitive research programmes often expect 3.00+ minimum. Check faculty admission pages.',
      },
      {
        q: 'Is this USM calculator free?',
        a: 'Yes — entirely browser-based.',
      },
    ],
  },

  utem: {
    intro:
      'Universiti Teknikal Malaysia Melaka (UTeM) is a public technical university specialising in engineering, technology, and ICT — grading on the Malaysian IPTA 4.0 scale. UTeM students in Melaka track PNGS and PNGK for co-curricular awards, industry placements, and PTPTN compliance. This calculator loads the standard A through F IPTA table used on UTeM transcripts.',
    context:
      'UTeM\'s curriculum emphasises hands-on engineering labs and industry-linked projects — credit loads can exceed 18 SKS in peak semesters. Faculty of Engineering Technology and Faculty of Information Science share grading rules but differ in course structures. Students comparing UTeM with UTHM or UTM should remember all use IPTA 4.0 but programme reputations vary by field.',
    howTo: [
      'Open Semester GPA and list subjects with SKS from your UTeM student information system.',
      'Choose IPTA letter grades matching UTeM results — A (80–100) = 4.00, F below 40 = 0.00.',
      'Use CGPA mode for cumulative PNGK — weight each semester by total SKS.',
      'Attach official UTeM transcripts for internship or scholarship applications.',
    ],
    gradingNote:
      'UTeM applies IPTA 4.0 grading: A = 4.00, A- = 3.67 (75–79), B+ = 3.33 (70–74), F = 0.00 below 40%. Technical programmes with heavy lab SKS mean one weak practical grade can affect PNGK disproportionally.',
    percentageNote:
      'UTeM students often estimate percentage as PNGK × 25. Request official conversion from the examination unit when forms require certified percentage rather than CGPA.',
    faqs: [
      {
        q: 'How is UTeM PNGK calculated?',
        a: 'Sum of (grade point × SKS) divided by total SKS attempted across all semesters on your transcript.',
      },
      {
        q: 'What PNGK is needed for UTeM Dean\'s List?',
        a: 'Criteria published each session — often 3.50+ PNGK. Verify in the current academic calendar.',
      },
      {
        q: 'Do UTeM lab courses count the same as lectures?',
        a: 'If labs appear as separate graded courses with SKS on your transcript, include each with its letter grade.',
      },
      {
        q: 'Is UTeM grading the same as UTM?',
        a: 'Both IPTA technical universities use the standard 4.0 framework. Enter UTeM portal letters here.',
      },
      {
        q: 'Can I improve UTeM PNGK after supplementary exams?',
        a: 'Updated grades after supp exams change PNGK — recalculate with new letters from the portal.',
      },
      {
        q: 'Is this UTeM calculator free?',
        a: 'Yes. No data uploaded to servers.',
      },
    ],
  },

  uthm: {
    intro:
      'Universiti Tun Hussein Onn Malaysia (UTHM) in Parit Raja, Johor, is an engineering-focused public university grading on the IPTA 4.0 scale. UTHM programmes in civil, mechanical, electrical, and technology education combine lecture SKS with workshop and industrial training credits. This calculator helps UTHM students compute PNGS and PNGK before results publish on the student portal.',
    context:
      'UTHM\'s industry partnerships mean many programmes include latihan industri (industrial training) with graded outcomes. Faculty of Civil Engineering and Built Environment stacks project-heavy semesters — monitor PNGK if you target Dean\'s List or JPA scholarships. Students from Johor often compare UTHM with UTM; both use IPTA grading but campus culture and programme mix differ.',
    howTo: [
      'Choose Semester GPA and enter each subject with SKS from your UTHM course registration.',
      'Select IPTA letter grades as published — A = 4.00 down to F below 40 = 0.00.',
      'Switch to CGPA to combine semesters into PNGK — weight by SKS per term.',
      'For government scholarship or employment forms, attach official UTHM transcripts.',
    ],
    gradingNote:
      'UTHM follows Malaysian IPTA 4.0 grading where A (80–100) = 4.00 and F below 40% = 0.00. Industrial training and final-year projects often carry higher SKS — strong performance there can significantly lift PNGK.',
    percentageNote:
      'UTHM students commonly use PNGK × 25 for informal percentage. Faculty examination offices may provide official multipliers for specific sponsor forms.',
    faqs: [
      {
        q: 'Does UTHM industrial training count in PNGK?',
        a: 'If latihan industri appears as a graded credit course on your transcript, include it with its letter grade.',
      },
      {
        q: 'How is UTHM semester PNGS calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester per UTHM academic rules.',
      },
      {
        q: 'What PNGK do I need for UTHM graduation honours?',
        a: 'Honours categories depend on cumulative PNGK thresholds in the academic ordinance — confirm current rules.',
      },
      {
        q: 'Is UTHM near UTM — same grading?',
        a: 'Both Johor IPTA universities use IPTA 4.0. They are separate institutions — enter UTHM grades from your portal.',
      },
      {
        q: 'Can supplementary exams change my UTHM PNGK?',
        a: 'Yes — recalculate when improved grades publish after supp or repeat exams.',
      },
      {
        q: 'Is this UTHM calculator free?',
        a: 'Yes — no login required.',
      },
    ],
  },

  iium: {
    intro:
      'International Islamic University Malaysia (IIUM) in Gombak integrates academic programmes with Islamic values across campuses in Kuantan and Pagoh. IIUM grades on the standard Malaysian IPTA 4.0 scale — A through F with plus/minus bands identical to peer public universities. Students tracking PNGK for IIUM internal awards, JPA, or international mobility can use this calculator with IPTA boundaries.',
    context:
      'IIUM\'s kulliyyah (faculty) structure spans Islamic studies, law, engineering, and medicine — credit patterns differ widely. Arabic and revealed-knowledge courses sit alongside conventional majors on transcripts. International students comparing IIUM PNGK with home-country GPA should provide official IIUM transcripts for credential evaluation.',
    howTo: [
      'Select Semester GPA and list courses with SKS from your IIUM EDMS / student portal.',
      'Map letter grades to IPTA table — A (80–100) = 4.00, F below 40 = 0.00.',
      'Use CGPA mode for PNGK across semesters — weight by SKS completed each term.',
      'Request official IIUM transcripts from the registry for scholarship or visa applications.',
    ],
    gradingNote:
      'IIUM applies Malaysian IPTA 4.0 grading: A = 4.00, A- = 3.67 (75–79), B+ = 3.33 (70–74), F = 0.00 below 40%. Kulliyyah-specific progression rules may set PNGK minimums beyond general university pass thresholds.',
    percentageNote:
      'IIUM transcripts emphasise PNGK and letter grades. Informal × 25 percentage estimates are not IIUM-certified — contact the examination section for official conversion letters.',
    faqs: [
      {
        q: 'Does IIUM use a different scale because of its Islamic focus?',
        a: 'No — academic grading follows standard IPTA 4.0. Islamic studies courses use the same letter table if credit-bearing and graded.',
      },
      {
        q: 'How is IIUM PNGK calculated?',
        a: 'Total grade points divided by total SKS attempted across all semesters on your official transcript.',
      },
      {
        q: 'What PNGK do I need for IIUM Dean\'s List?',
        a: 'Published each session by kulliyyah — often 3.50+ PNGK. Verify current academic notices.',
      },
      {
        q: 'Do IIUM medical programmes use the same IPTA scale?',
        a: 'Pre-clinical graded modules typically follow IPTA 4.0. Clinical progression may add separate assessment rules — check your handbook.',
      },
      {
        q: 'Can IIUM PNGK convert to US GPA?',
        a: 'Use credential evaluators with official IIUM transcripts — do not apply simple linear formulas.',
      },
      {
        q: 'Is this IIUM calculator free?',
        a: 'Yes. Calculations run locally in your browser.',
      },
    ],
  },

  'monash-university-malaysia': {
    intro:
      'Monash University Malaysia is the Malaysian campus of Australia\'s Monash University, offering degrees that align with Australian quality standards while grading on a local 4.0 CGPA scale similar to IPTA. Business, engineering, and medicine students at Sunway City track semester GPA and cumulative CGPA for Monash Malaysia transcripts used worldwide. This calculator applies the 4.0 grade boundaries configured for this campus.',
    context:
      'Monash Malaysia students receive Monash-branded degrees with credit structures mirroring Australian counterparts — but local grading follows Malaysian-aligned 4.0 tables on this site. Transfer to Clayton or Caulfield campuses requires credit mapping, not GPA copying. Students should use official Monash Malaysia transcripts for WES or employer verification rather than self-calculated figures.',
    howTo: [
      'Open Semester GPA and enter each unit with credit points from your Monash Malaysia enrolment record.',
      'Select letter grades matching the 4.0 IPTA-aligned table — A = 4.00 (80–100), F below 40 = 0.00.',
      'Switch to CGPA for cumulative standing across semesters — weight by credit points per term.',
      'Download official Monash Malaysia transcripts from the student portal for verified CGPA.',
    ],
    gradingNote:
      'Monash Malaysia uses a 4.0 CGPA scale aligned with Malaysian IPTA conventions: A = 4.00, A- = 3.67, B+ = 3.33, F = 0.00 below 40%. Australian HD/D/C grading on exchange semesters may appear separately — include only Monash Malaysia campus grades unless credited on your local transcript.',
    percentageNote:
      'Monash Malaysia transcripts show CGPA. Australian Monash uses different grading descriptors — do not mix Clayton HD marks into Malaysia CGPA without official credit approval.',
    faqs: [
      {
        q: 'Is Monash Malaysia CGPA the same as Monash Australia WAM?',
        a: 'No. Malaysia campus uses 4.0 CGPA on this scale; Australian campuses use WAM/HD grading. Transcripts are campus-specific.',
      },
      {
        q: 'How is Monash Malaysia semester GPA calculated?',
        a: 'Credit-weighted average of grade points for all units in the semester per Monash Malaysia academic policies.',
      },
      {
        q: 'Can I transfer to Monash Australia with my Malaysia CGPA?',
        a: 'Transfer uses credit mapping and programme rules — provide official transcripts; CGPA alone does not guarantee transfer.',
      },
      {
        q: 'What CGPA is needed for Monash Malaysia honours?',
        a: 'Honours thresholds are in the Monash Malaysia handbook — typically high 3.50+ cumulative but confirm your programme.',
      },
      {
        q: 'Do Monash Malaysia units use IPTA fail at 40%?',
        a: 'This calculator reflects IPTA-aligned boundaries on the Monash Malaysia page. Verify against your official result slip.',
      },
      {
        q: 'Is this Monash Malaysia calculator free?',
        a: 'Yes — no signup required.',
      },
    ],
  },

  'stpm-malaysia': {
    intro:
      'STPM (Sijil Tinggi Persekolahan Malaysia) is Malaysia\'s sixth-form pre-university qualification — not a university degree, but millions of students need STPM CGPA calculations for UPU placement, matriculation comparisons, and scholarship applications. STPM uses its own 4.0 grade point scale with wider mark bands than IPTA university grading. This calculator loads the official STPM table for accurate cumulative GPA.',
    context:
      'STPM candidates take three to five subjects over 18 months with school-based assessment (SBA) and centralised exams contributing to final grades. Grade points differ from university IPTA — an A at STPM requires 90–100% for 4.0 points, but C spans 30–39% at 2.0 points. Students comparing STPM CGPA with matriculation GPA should never mix tables.',
    howTo: [
      'Select Semester GPA (or cumulative mode) and enter each STPM subject with its grade point from your result slip.',
      'Use STPM letter grades — A = 4.0 (90–100), A- = 3.67 (80–89), down to F below 20 = 0.0.',
      'For UPU applications, calculate overall CGPA across all STPM subjects using equal or policy-weighted subjects per MPM rules.',
      'Cross-check with your school\'s counsellor and official MPM results before submitting UPU or scholarship forms.',
    ],
    gradingNote:
      'STPM assigns A = 4.0 (90–100), A- = 3.67 (80–89), B+ = 3.33 (70–79), B = 3.0 (60–69), B- = 2.67 (50–59), C+ = 2.33 (40–49), C = 2.0 (30–39), D = 1.0 (20–29), F = 0.0 below 20%. The wide C band differs sharply from university grading where below 40% often fails.',
    percentageNote:
      'STPM results show grades and CGPA, not a simple percentage average. UPU uses STPM CGPA and subject grades directly — do not convert STPM CGPA × 25 for university placement; follow MPM and UPU guidelines.',
    faqs: [
      {
        q: 'Is STPM grading the same as IPTA university grading?',
        a: 'No. STPM has its own pre-university scale with different bands (e.g., C at 30–39%). Use the STPM table on this page.',
      },
      {
        q: 'How is STPM CGPA calculated for UPU?',
        a: 'Based on grade points across STPM subjects per MPM rules — typically average of subject grade points. Confirm current UPU circulars.',
      },
      {
        q: 'Can I compare STPM CGPA with matriculation GPA?',
        a: 'Both feed UPU but use different scales. UPU converts internally — enter each qualification\'s official grades separately.',
      },
      {
        q: 'What STPM CGPA is competitive for medicine at UM?',
        a: 'Cut-offs change yearly and vary by race/quota categories. UPU publishes minimum ranks — STPM CGPA is one factor among several.',
      },
      {
        q: 'Do STPM school-based assessment (SBA) marks affect GPA?',
        a: 'SBA contributes to final subject grades on your MPM result slip. Enter the final published letter grade per subject.',
      },
      {
        q: 'Is this STPM calculator free?',
        a: 'Yes. No login required; runs entirely in your browser.',
      },
    ],
  },
};
