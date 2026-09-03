/**
 * Hand-written SEO guide overrides — India universities.
 */

export const OVERRIDES = {
  'iit-delhi': {
    intro:
      'Indian Institute of Technology Delhi (IIT Delhi) ranks among the country\'s most selective engineering schools and grades on the standard 10-point absolute scale shared across most IITs. An O grade (10.0 points) requires roughly 90%+ — not to be confused with a 4.0-scale American A. Whether you study computer science, mechanical, or humanities electives under the IIT Delhi curriculum, this calculator applies the correct O/A+/A/B+ letter mapping for semester SPI and cumulative CPI.',
    context:
      'IIT Delhi splits the academic year into semesters with continuous evaluation feeding one final letter per course. Credits vary — core engineering courses often carry 3–4 credits while humanities may carry fewer. Relative grading in some batches can shift boundaries; your official grade sheet letter is authoritative. Students targeting GATE, placements, or MS abroad should track CPI alongside project work — many filters cite 8.0+ CPI for core product roles.',
    howTo: [
      'Select Semester GPA and enter each subject with credits from your IIT Delhi curriculum plan or ERP printout.',
      'Choose letter grades (O, A+, A, B+, B, C, F) exactly as published on your result — O = 10.0, A+ = 9.0, A = 8.0.',
      'Switch to CGPA/CPI mode to combine Fall and Spring semesters — weight by credits, never simple-average semester GPAs.',
      'Use the Percentage tab cautiously: IIT Delhi may use (CPI / 10) × 100 or department-specific formulas — confirm with the academic section.',
    ],
    gradingNote:
      'IIT Delhi follows the common 10-point IIT grading scale where O = 10.0 (90–100), A+ = 9.0 (80–89), A = 8.0 (70–79), and F = 0.0 below 40%. Because the scale tops out at 10, an 8.5 CPI is strong — do not compare directly with a US 4.0 GPA without official conversion.',
    percentageNote:
      'A rough estimate is (CPI / 10) × 100, so 8.50 CPI ≈ 85%. IIT Delhi transcripts and placement cells may cite different multipliers for specific recruiters — download your official grade sheet when a form asks for aggregate percentage.',
    faqs: [
      {
        q: 'Is IIT Delhi CPI out of 4 or 10?',
        a: 'IIT Delhi uses a 10-point CPI scale. This calculator is configured for that system — do not enter IIT grades into a 4.0-scale tool without converting.',
      },
      {
        q: 'How is IIT Delhi semester SPI calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester. Failed courses with F = 0.0 reduce the average until cleared.',
      },
      {
        q: 'What CPI is good for IIT Delhi placements?',
        a: 'Cut-offs vary by company — product firms often filter around 8.0+ CPI while research roles weigh projects heavily. Check your department placement report.',
      },
      {
        q: 'Does relative grading change my letter grade at IIT Delhi?',
        a: 'Some courses curve final letters. Enter the letter on your official result — that is what IIT Delhi records on your transcript.',
      },
      {
        q: 'Can I combine minors and major credits in one SPI?',
        a: 'If both appear on the same semester transcript with grades and credits, include all in one semester calculation.',
      },
      {
        q: 'Is this IIT Delhi calculator free?',
        a: 'Yes. No signup; grades stay on your device.',
      },
    ],
  },

  'iit-bombay': {
    intro:
      'Indian Institute of Technology Bombay (IIT Bombay) sits on the Powai campus and uses the IIT-wide 10-point grading system where top performers earn O (10.0) or A+ (9.0) grades. CPI — cumulative performance index — drives placement shortlists, higher-study applications, and institute awards. This calculator prevents the common mistake of treating IIT Bombay grades like CBSE percentages or US 4.0 GPAs.',
    context:
      'IIT Bombay\'s dense semester schedules mix lectures, tutorials, and labs — especially in engineering departments. Dual-degree and IDC programmes may have different credit patterns; pull credits from your ASC portal. Institute medals and Dean\'s List cut-offs reference CPI thresholds that change yearly — use this tool to track progress, not to guarantee an award.',
    howTo: [
      'Pick Semester GPA and list subjects with credits from your IIT Bombay registration.',
      'Map each final letter to the 10-point table — O = 10.0 down to F = 0.0 below 40%.',
      'Use CGPA mode for cumulative CPI across multiple semesters — weight each term by credits completed.',
      'Cross-check with the IIT Bombay ASC portal before submitting scholarship or visa application forms.',
    ],
    gradingNote:
      'IIT Bombay assigns O = 10.0 (90–100), A+ = 9.0 (80–89), A = 8.0 (70–79), B+ = 7.0 (60–69), and F = 0.0 below 40%. A C grade (5.0 points) still passes but weakens placement profiles. Never divide CPI by 4 to get a US GPA — conversion requires institute-approved tables.',
    percentageNote:
      'Many students estimate (CPI / 10) × 100 for informal percentage. IIT Bombay official documents and WES evaluations may apply different formulas — provide your sealed transcript for certified conversions.',
    faqs: [
      {
        q: 'What is the difference between SPI and CPI at IIT Bombay?',
        a: 'SPI is semester performance index; CPI is cumulative across all semesters. This calculator supports both modes.',
      },
      {
        q: 'How is IIT Bombay CPI calculated?',
        a: 'Credit-weighted average of grade points across all attempted courses on your transcript, including failed grades until cleared.',
      },
      {
        q: 'What CPI do I need for IIT Bombay institute medals?',
        a: 'Medal criteria are published annually — often 9.0+ CPI for top awards but verify current rules on the academic website.',
      },
      {
        q: 'Can I improve CPI after a weak first year at IIT Bombay?',
        a: 'Later semesters with higher credits can raise CPI if you earn strong grades — model scenarios before registration.',
      },
      {
        q: 'Are audit courses counted in IIT Bombay CPI?',
        a: 'Only credit-bearing graded courses on your transcript belong in CPI calculations unless your handbook states otherwise.',
      },
      {
        q: 'Is this IIT Bombay calculator free?',
        a: 'Yes — entirely browser-based with no account required.',
      },
    ],
  },

  'iit-madras': {
    intro:
      'Indian Institute of Technology Madras (IIT Madras) is the leading southern IIT, grading on the standard 10-point absolute scale with O, A+, A, and B+ letters. Whether you are in engineering, management, or humanities under IIT Madras, your semester GPA reflects credit-weighted grade points — not raw exam totals divided by subject count. Use this page to verify SPI and CPI before results appear on the IIT Madras portal.',
    context:
      'IIT Madras runs research-intensive programmes with strong industry links — many courses include project components that feed one final letter grade. Hostel students and day scholars use the same grading math; credits from exchange semesters count if they appear on your IIT Madras transcript. Students comparing CPI with Anna University affiliates should remember letter cut-offs differ even when both use 10-point terminology.',
    howTo: [
      'Open Semester GPA and enter each course with credits from your IIT Madras course registration.',
      'Select letter grades matching the IIT 10-point table loaded above.',
      'Switch to CGPA for cumulative CPI across odd and even semesters — weight by credits per term.',
      'For higher-study applications, attach official IIT Madras transcripts — self-calculated CPI is for planning only.',
    ],
    gradingNote:
      'IIT Madras follows the common IIT 10-point scale: O = 10.0 (90–100), A+ = 9.0 (80–89), A = 8.0 (70–79). Failed courses below 40% score 0.0 and must be cleared per IIT Madras academic regulations before they stop affecting CPI.',
    percentageNote:
      'Informal conversion often uses (CPI / 10) × 100. IIT Madras academic section may provide official percentage equivalents for specific forms — do not self-certify for embassy or employer submissions.',
    faqs: [
      {
        q: 'Is IIT Madras grading the same as IIT Delhi?',
        a: 'Both IITs typically use the same 10-point absolute scale, but always enter grades from your official IIT Madras result sheet.',
      },
      {
        q: 'How is IIT Madras semester SPI calculated?',
        a: 'Sum of (grade point × credits) divided by total semester credits. Include every graded course on your registration.',
      },
      {
        q: 'What CPI is competitive for IIT Madras placements?',
        a: 'Product companies often cite 8.0+ CPI; core engineering roles may accept lower with strong projects. Check your department placement statistics.',
      },
      {
        q: 'Do IIT Madras research credits count in CPI?',
        a: 'If they appear as graded credit-bearing courses on your transcript, include them. Non-graded research units may be excluded.',
      },
      {
        q: 'Can I use this for IIT Madras online degree programmes?',
        a: 'Online and regular programmes may share the same scale — confirm with your programme handbook if policies differ.',
      },
      {
        q: 'Is this IIT Madras calculator free?',
        a: 'Yes. Calculations happen locally in your browser.',
      },
    ],
  },

  'ktu-kerala': {
    intro:
      'APJ Abdul Kalam Technological University (KTU) governs engineering colleges across Kerala with a distinctive 10-point grading table — including S, A+, A, B+, B, C, P, and F letters where an A grade can equal 8.5 points, not 8.0. If you study at a KTU-affiliated college in Thiruvananthapuram, Kochi, or elsewhere, this calculator uses KTU\'s exact grade boundaries so your SGPA matches the university portal.',
    context:
      'KTU publishes results centrally while colleges conduct exams locally — arrear papers and supply exams are common. Credits per subject follow the KTU scheme; B.Tech and M.Tech programmes differ. Students comparing KTU SGPA with Kerala University or IIT scales should never mix tables — KTU\'s A at 80–84% is 8.5 points, unique among many Indian 10-point systems.',
    howTo: [
      'Choose Semester GPA and list each subject with credits from your KTU course registration printout.',
      'Pick KTU letter grades — S = 10.0 (90–100), A+ = 9.0, A = 8.5 (80–84), P = 5.0 (pass), F = 0.0.',
      'Use CGPA mode to track cumulative standing across semesters for placement or higher-study eligibility.',
      'Cross-check with the KTU student portal (APJAKTU) before submitting scholarship or bank loan forms.',
    ],
    gradingNote:
      'KTU assigns S = 10.0 (90–100), A+ = 9.0 (85–89), A = 8.5 (80–84), B+ = 8.0 (75–79), B = 7.0 (70–74), C = 6.0 (65–69), P = 5.0 (60–64), and F = 0.0 below 60%. The sub-60 failure boundary is stricter than some IIT scales — a 58% may fail outright.',
    percentageNote:
      'KTU students often estimate (CGPA / 10) × 100 or use college-specific circulars. KTU official documents may state different multipliers — verify with your college examination cell before citing percentage on forms.',
    faqs: [
      {
        q: 'Why is KTU\'s A grade 8.5 points, not 8.0?',
        a: 'KTU publishes its own table with finer bands. Always use the KTU scale on this page, not a generic IIT or Anna University sheet.',
      },
      {
        q: 'How is KTU SGPA calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester, including arrear papers listed on that term\'s result.',
      },
      {
        q: 'What CGPA is needed for KTU distinction?',
        a: 'Distinction rules are in the KTU academic regulations — typically high CGPA with no arrears. Confirm current ordinance text.',
      },
      {
        q: 'Do KTU internal marks affect SGPA before finals?',
        a: 'Your transcript shows final letter grades per course. Enter those letters — internal weighting is already reflected.',
      },
      {
        q: 'Can I improve KTU CGPA after multiple arrears?',
        a: 'Clearing arrears with strong grades helps, but failed courses with F = 0.0 hurt until passed — model recovery in CGPA mode.',
      },
      {
        q: 'Is this KTU calculator free?',
        a: 'Yes — no login required.',
      },
    ],
  },

  'anna-university': {
    intro:
      'Anna University in Chennai is Tamil Nadu\'s flagship technical university, affiliating hundreds of engineering colleges across the state. Most affiliated programmes grade on the standard 10-point scale with O, A+, A, B+, B, C, and F letters — but cut-offs and credit rules come from Anna University regulations, not from each college\'s local guesswork. This calculator helps you compute SGPA and CGPA before results appear on the COE portal.',
    context:
      'Anna University centralises examinations for affiliated colleges — results can arrive in batches during revaluation windows. Regulation versions (R2017, R2021, etc.) may differ slightly in credit structure; use credits from your official grade sheet. Students at CEG campus versus affiliated colleges follow the same grading table but may face different course offerings — enter only courses on your transcript.',
    howTo: [
      'Select Semester GPA and enter each subject with credits from your Anna University grade report.',
      'Map letter grades to the 10-point table — O = 10.0 (90–100), A+ = 9.0, A = 8.0, F = 0.0 below 40%.',
      'Switch to CGPA to combine semesters — weight by credits, not by simple average of semester GPAs.',
      'For TNPSC, bank, or campus placement forms, attach official Anna University transcripts.',
    ],
    gradingNote:
      'Anna University affiliated programmes typically use the 10-point scale: O = 10.0, A+ = 9.0, A = 8.0, B+ = 7.0, B = 6.0, C = 5.0 (40–49), F = 0.0 below 40%. Relative grading in some colleges can adjust boundaries — your official COE letter is what counts.',
    percentageNote:
      'Common estimates include (CGPA / 10) × 100 or Anna University circular multipliers. Affiliated colleges sometimes publish different conversion notes — check your college examination office for certified percentage.',
    faqs: [
      {
        q: 'Is Anna University CGPA the same as SRM or VIT?',
        a: 'All may use 10-point terminology but letter bands differ. Calculate with Anna University\'s table, not another institution\'s sheet.',
      },
      {
        q: 'How is Anna University SGPA calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester per Anna University regulations.',
      },
      {
        q: 'What CGPA is needed for Anna University first class with distinction?',
        a: 'Distinction rules are in the current regulation — often 8.50+ CGPA with no arrears. Verify the ordinance for your batch.',
      },
      {
        q: 'Do revaluation results change my SGPA?',
        a: 'Yes — if a grade improves after revaluation, recalculate with the updated letter from the COE portal.',
      },
      {
        q: 'Can affiliated college students use this calculator?',
        a: 'Yes. If your college is Anna University affiliated and uses the standard 10-point table, this tool applies.',
      },
      {
        q: 'Is this Anna University calculator free?',
        a: 'Yes. No data is uploaded to our servers.',
      },
    ],
  },

  'vtu-karnataka': {
    intro:
      'Visvesvaraya Technological University (VTU) in Belagavi governs more than 200 engineering colleges across Karnataka — one of India\'s largest affiliating technical universities. VTU programmes typically use the 10-point grading scale with O, A+, A, B+, B, C, and F grades. Whether you study in Bengaluru, Hubballi, or Mysuru under VTU, this calculator applies the correct letter-to-point mapping for SGPA and CGPA.',
    context:
      'VTU publishes results through its online portal while colleges conduct internal assessments locally. Credit schemes vary by scheme (CBCS) and regulation year — pull credits from your VTU grade card, not from outdated syllabus PDFs. Students transferring from autonomous colleges into VTU should recalculate using VTU letters only, not previous institution grades.',
    howTo: [
      'Open Semester GPA and list subjects with credits from your VTU grade card or college ERP.',
      'Choose letter grades matching the 10-point VTU table — O = 10.0 down to F = 0.0 below 40%.',
      'Use CGPA mode for cumulative standing across semesters — essential for VTU honours and placement eligibility.',
      'Cross-check with the VTU results portal before submitting forms to KEA counselling or employers.',
    ],
    gradingNote:
      'VTU affiliated colleges generally follow the 10-point scale: O = 10.0 (90–100), A+ = 9.0 (80–89), A = 8.0 (70–79), B+ = 7.0 (60–69), and F = 0.0 below 40%. Arrear clearance rules affect when failed grades stop penalising CGPA — check current VTU academic regulations.',
    percentageNote:
      'VTU students often use (CGPA / 10) × 100 for rough percentage. VTU and affiliated colleges may publish scheme-specific conversion circulars — use official documents for scholarship or government job applications.',
    faqs: [
      {
        q: 'Do all VTU colleges use the same grading scale?',
        a: 'Most VTU affiliated programmes follow the standard 10-point table. Autonomous colleges with separate grading must use their own scale.',
      },
      {
        q: 'How is VTU SGPA calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester per VTU CBCS guidelines.',
      },
      {
        q: 'What CGPA is needed for VTU class rank or honours?',
        a: 'Honours and rank rules depend on regulation year and college — typically high CGPA with no backlogs. Confirm with your examination section.',
      },
      {
        q: 'How do VTU arrear papers affect CGPA?',
        a: 'Failed courses score F = 0.0 until cleared. Include them in calculations for the semester where they appear on your grade card.',
      },
      {
        q: 'Can I compare VTU CGPA with IIT CPI directly?',
        a: 'Both use 10-point scales but grading culture and cut-offs differ. Provide official transcripts for formal comparisons.',
      },
      {
        q: 'Is this VTU calculator free?',
        a: 'Yes — runs entirely in your browser.',
      },
    ],
  },

  ggsipu: {
    intro:
      'Guru Gobind Singh Indraprastha University (GGSIPU) is Delhi\'s state university with a distinctive 10-point grading table — O, A+, A, B+, B, C, P, and F where P (pass) at 40–44% still earns 4.0 points. Engineering, law, and management colleges across Delhi NCR affiliate to IPU and share this scale. This calculator prevents the error of applying IIT or DU grade boundaries to IPU results.',
    context:
      'GGSIPU conducts centralised exams for many programmes while colleges handle internals locally. Credit totals differ between B.Tech, LLB, and MBA tracks — use your IPU grade sheet. Students comparing IPU CGPA with Delhi University or IIT peers should remember IPU\'s P grade and wider B+ band (55–64% = 7.0 points) create different GPA outcomes for similar marks.',
    howTo: [
      'Select Semester GPA and enter each subject with credits from your GGSIPU mark sheet.',
      'Pick IPU letter grades — O = 10.0 (90–100), A+ = 9.0 (75–89), P = 4.0 (40–44), F = 0.0 below 40%.',
      'Switch to CGPA for cumulative standing across semesters — weight by credits per term.',
      'For Delhi government scholarship or placement forms, attach official GGSIPU transcripts.',
    ],
    gradingNote:
      'GGSIPU assigns O = 10.0 (90–100), A+ = 9.0 (75–89), A = 8.0 (65–74), B+ = 7.0 (55–64), B = 6.0 (50–54), C = 5.0 (45–49), P = 4.0 (40–44), and F = 0.0 below 40%. The P grade lets marginal passes contribute points — unlike strict fail-below-40 IIT scales.',
    percentageNote:
      'IPU students often estimate (CGPA / 10) × 100. GGSIPU examination branch may issue official conversion for specific forms — do not self-certify for visa applications.',
    faqs: [
      {
        q: 'What is the P grade at GGSIPU?',
        a: 'P (pass) at 40–44% earns 4.0 grade points — still passing but weak for competitive placements. It differs from F = 0.0 below 40%.',
      },
      {
        q: 'How is GGSIPU SGPA calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester per IPU ordinances.',
      },
      {
        q: 'Is IPU grading the same as Delhi University?',
        a: 'Both may use 10-point terminology but cut-offs differ. Always use the GGSIPU table on this page for IPU results.',
      },
      {
        q: 'What CGPA is needed for GGSIPU merit certificates?',
        a: 'Merit criteria are published each session — often 8.0+ CGPA but verify with your college examination cell.',
      },
      {
        q: 'Do GGSIPU reappear exams change SGPA?',
        a: 'Yes — update your calculation when the improved grade publishes on the IPU portal.',
      },
      {
        q: 'Is this GGSIPU calculator free?',
        a: 'Yes. No signup required.',
      },
    ],
  },

  'saveetha-university': {
    intro:
      'Saveetha Institute of Medical and Technical Sciences in Chennai uses a compact 10-point grading scale with O, A+, A, B+, B, and RA (re-appear) letters — notably without separate C or P grades in the standard table. Medical, dental, engineering, and law students all reference this structure on Saveetha transcripts. This calculator maps Saveetha\'s exact grade points so your SGPA matches the institute portal.',
    context:
      'Saveetha emphasises clinical and practical training — health science programmes carry different credit patterns than B.Tech tracks. The RA grade (re-appear) scores 0.0 until you clear the paper. Students comparing Saveetha CGPA with Anna University or SRM should use institution-specific tables — Saveetha\'s B band spans 50–60% at 6.0 points.',
    howTo: [
      'Choose Semester GPA and list subjects with credits from your Saveetha grade report.',
      'Select Saveetha letters — O = 10.0 (91–100), A+ = 9.0 (81–90), RA = 0.0 (re-appear below 50%).',
      'Use CGPA mode to track cumulative standing for NMC, AICTE, or placement requirements.',
      'Cross-check with the Saveetha student portal before submitting internship or higher-study forms.',
    ],
    gradingNote:
      'Saveetha assigns O = 10.0 (91–100), A+ = 9.0 (81–90), A = 8.0 (71–80), B+ = 7.0 (61–70), B = 6.0 (50–60), and RA = 0.0 below 50%. There is no partial pass band — below 50% triggers re-appear with zero grade points until cleared.',
    percentageNote:
      'Saveetha transcripts emphasise letter grades and CGPA. Rough percentage estimates use (CGPA / 10) × 100 — request official conversion from the examination section for NRI quota or abroad applications.',
    faqs: [
      {
        q: 'What does RA mean on Saveetha results?',
        a: 'RA (re-appear) indicates failure below 50% with 0.0 grade points. You must clear the paper before it stops affecting CGPA.',
      },
      {
        q: 'How is Saveetha SGPA calculated?',
        a: 'Credit-weighted average of grade points for all courses in the semester, including RA grades at 0.0 until cleared.',
      },
      {
        q: 'Is Saveetha grading the same as SRM?',
        a: 'Both use 10-point scales but letter bands differ. Always calculate with Saveetha\'s table loaded on this page.',
      },
      {
        q: 'What CGPA is needed for Saveetha clinical postings?',
        a: 'Medical programmes may set minimum CGPA for progression — check your faculty handbook and NMC guidelines.',
      },
      {
        q: 'Can engineering and medical students use the same calculator?',
        a: 'Yes — both follow the Saveetha grading table on this page if your transcript uses these letter grades.',
      },
      {
        q: 'Is this Saveetha calculator free?',
        a: 'Yes. Calculations run locally in your browser.',
      },
    ],
  },

  'mumbai-university': {
    intro:
      'University of Mumbai (MU) is one of India\'s oldest universities, affiliating hundreds of colleges across Mumbai, Thane, and Raigad. Modern undergraduate programmes — especially engineering and commerce under CBCS — grade on the 10-point CGPA system with O, A+, A, B+, B, C, and F letters. This calculator helps MU students compute semester GPA before results appear on the mu.ac.in portal.',
    context:
      'Mumbai University publishes results in waves — revaluation and photocopy requests can delay final grades. Affiliated colleges under different faculties (Arts, Science, Commerce, Engineering) may transition to CBCS at different speeds; use credits from your official MU grade card. Students comparing MU CGPA with autonomous institutes like ICT should remember those colleges may use separate scales.',
    howTo: [
      'Open Semester GPA and enter each course with credits from your Mumbai University mark sheet.',
      'Map letter grades to the 10-point table — O = 10.0 (90–100), A+ = 9.0, F = 0.0 below 40%.',
      'Switch to CGPA to combine semesters — weight by credits, not by counting years equally.',
      'For MPSC, bank, or campus placement forms, attach official MU transcripts.',
    ],
    gradingNote:
      'Mumbai University CBCS programmes typically use the 10-point scale: O = 10.0, A+ = 9.0, A = 8.0, B+ = 7.0, B = 6.0, C = 5.0 (40–49), F = 0.0 below 40%. Legacy percentage-based programmes may not use this table — confirm your programme follows CBCS grading.',
    percentageNote:
      'MU students often estimate (CGPA / 10) × 100 or use university circular multipliers. Official percentage may appear on older marksheets — for CBCS programmes, request conversion guidance from your college examination cell.',
    faqs: [
      {
        q: 'Does Mumbai University still use percentage or CGPA?',
        a: 'Many newer programmes use 10-point CGPA under CBCS. Older batches may have percentage marks — use the scale on your official grade card.',
      },
      {
        q: 'How is MU semester SGPA calculated?',
        a: 'Sum of (grade point × credits) divided by total credits for the semester per MU CBCS regulations.',
      },
      {
        q: 'What CGPA is needed for Mumbai University distinction?',
        a: 'Distinction rules are in the current ordinance — often 7.50+ or 8.00+ CGPA depending on faculty. Verify for your batch.',
      },
      {
        q: 'Do MU affiliated colleges share the same grading?',
        a: 'Colleges under MU CBCS typically follow the standard 10-point table. Autonomous colleges may differ.',
      },
      {
        q: 'Can I improve MU CGPA after ATKT papers?',
        a: 'Clearing backlogs with strong grades helps raise CGPA — include F grades at 0.0 until passed when calculating.',
      },
      {
        q: 'Is this Mumbai University calculator free?',
        a: 'Yes — no registration required.',
      },
    ],
  },

  'delhi-university': {
    intro:
      'University of Delhi (DU) — India\'s central university with thousands of affiliated colleges — has moved most modern programmes to the 10-point grading scale under CBCS. Whether you study at St. Stephen\'s, Hindu College, or a south campus college, your semester GPA reflects credit-weighted grade points on the O/A+/A system. This calculator is for DU students who need SGPA or CGPA math without spreadsheet errors.',
    context:
      'DU\'s semester system varies by college and course — BA, BSc, BCom, and professional programmes carry different credit loads. North Campus and South Campus colleges share DU grading regulations but may publish results on different timelines. Students comparing DU CGPA with IIT or GGSIPU peers should never mix grade tables — DU\'s 10-point boundaries are specific to DU ordinances.',
    howTo: [
      'Select Semester GPA and list papers with credits from your DU grade sheet or college ERP.',
      'Choose letter grades matching the 10-point DU table — O = 10.0 down to F = 0.0 below 40%.',
      'Use CGPA mode for cumulative standing across semesters — weight each term by credits completed.',
      'For UPSC, SSC, or study-abroad forms, attach official DU transcripts from your college or the university.',
    ],
    gradingNote:
      'Delhi University CBCS programmes use the 10-point scale: O = 10.0 (90–100), A+ = 9.0 (80–89), A = 8.0 (70–79), B+ = 7.0 (60–69), and F = 0.0 below 40%. Honours programmes may weight core papers differently in degree classification — GPA math still uses standard credit weighting.',
    percentageNote:
      'DU students sometimes use (CGPA / 10) × 100 for informal percentage. DU examination branch and college offices may provide official conversion for specific recruiters — do not self-certify for government job forms.',
    faqs: [
      {
        q: 'Is Delhi University CGPA the same as University of Dhaka (DU)?',
        a: 'No — they share the abbreviation DU but use completely different systems. This page is for University of Delhi, India, on the 10-point scale.',
      },
      {
        q: 'How is DU semester SGPA calculated?',
        a: 'Multiply each paper grade point by its credits, sum, divide by total semester credits per DU CBCS rules.',
      },
      {
        q: 'What CGPA is needed for DU distinction or merit?',
        a: 'Merit and distinction cut-offs vary by faculty and year — check DU examination notifications for your session.',
      },
      {
        q: 'Do all DU colleges use CBCS grading?',
        a: 'Most newer programmes do. Legacy courses may still use percentage — follow the scale on your official mark sheet.',
      },
      {
        q: 'Can I combine DU semester GPAs by averaging?',
        a: 'No — use CGPA mode and weight each semester by credits. Simple averaging gives incorrect results.',
      },
      {
        q: 'Is this Delhi University calculator free?',
        a: 'Yes. Your grades stay on your device.',
      },
    ],
  },
};
