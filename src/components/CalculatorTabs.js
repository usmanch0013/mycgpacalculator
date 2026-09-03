"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GRADING_SYSTEMS, getMaxGradePoint } from '@/lib/gradingSystems';
import { SITE_NAME } from '@/lib/seo';

function getHonoursClass(gpa, maxScore) {
  const pct = (parseFloat(gpa) / parseFloat(maxScore)) * 100;
  if (isNaN(pct) || pct === 0) return '—';
  if (pct >= 70) return 'First Class Honours (1st)';
  if (pct >= 60) return 'Upper Second (2:1)';
  if (pct >= 50) return 'Lower Second (2:2)';
  if (pct >= 40) return 'Third Class (3rd)';
  return 'Below honours threshold';
}

export default function CalculatorTabs({
  initialSystem,
  lockSystem = false,
  university = null,
  openGradingTable = false,
}) {
  const searchParams = useSearchParams();
  const defaultSystem = initialSystem || 'UGC Bangladesh';
  const [isPro, setIsPro] = useState(false);
  const [activeTab, setActiveTab] = useState('semester');
  const [gradingSystem, setGradingSystem] = useState(defaultSystem);
  const [courses, setCourses] = useState([
    { id: 1, name: '', credits: '', grade: '' },
    { id: 2, name: '', credits: '', grade: '' },
  ]);
  const [semesters, setSemesters] = useState([{ id: 1, name: '', gpa: '', credits: '' }]);
  const [percentage, setPercentage] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('');
  const [currentCgpa, setCurrentCgpa] = useState('');
  const [completedCredits, setCompletedCredits] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lockSystem && initialSystem) {
      setGradingSystem(initialSystem);
      return;
    }
    const system = searchParams.get('system');
    if (system && GRADING_SYSTEMS[system]) {
      setGradingSystem(system);
    }
  }, [searchParams, lockSystem, initialSystem]);

  const maxScore = getMaxGradePoint(gradingSystem);
  const grades = GRADING_SYSTEMS[gradingSystem].grades;

  const handleSystemChange = (e) => {
    setGradingSystem(e.target.value);
    setCourses((prev) => prev.map((c) => ({ ...c, grade: '' })));
  };

  const addCourse = () => {
    const newId = courses.length ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    setCourses([...courses, { id: newId, name: '', credits: '', grade: '' }]);
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeCourse = (id) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const addSemester = () => {
    const newId = semesters.length ? Math.max(...semesters.map((s) => s.id)) + 1 : 1;
    setSemesters([...semesters, { id: newId, name: '', gpa: '', credits: '' }]);
  };

  const updateSemester = (id, field, value) => {
    setSemesters(semesters.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeSemester = (id) => {
    if (semesters.length <= 1) return;
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  const clearAll = () => {
    setCourses([
      { id: 1, name: '', credits: '', grade: '' },
      { id: 2, name: '', credits: '', grade: '' },
    ]);
    setSemesters([{ id: 1, name: '', gpa: '', credits: '' }]);
    setPercentage('');
    setTargetCgpa('');
    setCurrentCgpa('');
    setCompletedCredits('');
    setRemainingCredits('');
  };

  const calculatedSemesterGPA = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      const gr = parseFloat(c.grade);
      if (!isNaN(cr) && cr > 0 && !isNaN(gr)) {
        totalCredits += cr;
        totalPoints += cr * gr;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  }, [courses]);

  const calculatedCGPA = useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    semesters.forEach((s) => {
      const cr = parseFloat(s.credits);
      const gpa = parseFloat(s.gpa);
      if (!isNaN(cr) && cr > 0 && !isNaN(gpa)) {
        totalCredits += cr;
        totalPoints += cr * gpa;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  }, [semesters]);

  const convertedPercentageCGPA = useMemo(() => {
    const p = parseFloat(percentage);
    if (!isNaN(p) && p > 0) return (p / 9.5).toFixed(2);
    return '—';
  }, [percentage]);

  const proStats = useMemo(() => {
    let credits = 0;
    let filled = 0;
    courses.forEach((c) => {
      const cr = parseFloat(c.credits);
      if (!isNaN(cr) && cr > 0) credits += cr;
      if (c.name || c.credits || c.grade) filled += 1;
    });
    return { credits, filled, courses: courses.length };
  }, [courses]);

  const requiredGpa = useMemo(() => {
    const target = parseFloat(targetCgpa);
    const current = parseFloat(currentCgpa);
    const done = parseFloat(completedCredits);
    const remaining = parseFloat(remainingCredits);
    if ([target, current, done, remaining].some(isNaN) || remaining <= 0) return null;
    const needed = (target * (done + remaining) - current * done) / remaining;
    return needed.toFixed(2);
  }, [targetCgpa, currentCgpa, completedCredits, remainingCredits]);

  const activeResult = activeTab === 'semester' ? calculatedSemesterGPA : activeTab === 'cgpa' ? calculatedCGPA : convertedPercentageCGPA;
  const honoursClass = getHonoursClass(calculatedSemesterGPA, maxScore);

  const copyResult = async () => {
    const uniLabel = university ? `${university.shortName} — ` : '';
    const text = `${uniLabel}${SITE_NAME} Result\nGrading: ${gradingSystem}\nGPA/CGPA: ${activeResult} / ${maxScore}\nCalculated at ${SITE_NAME}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const selectStyle = {
    appearance: 'none',
    backgroundImage:
      'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 1rem center',
  };

  const calculatorContent = (
    <>
      {university ? (
        <div className="uni-calc-bar">
          <span className="uni-calc-bar-label">
            Grading system locked to <strong>{GRADING_SYSTEMS[gradingSystem]?.name ?? gradingSystem}</strong>
          </span>
        </div>
      ) : (
        <div className="section-header">
          <div className="badge badge-glow">Calculator</div>
          <h2 className="section-title">CGPA Calculator</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Add your courses, pick a grading system, and see semester GPA or cumulative CGPA straight away.
          </p>
          <p className="section-subtitle">
            Switch to <strong>Pro</strong> if you want target-GPA planning or a printable summary.
          </p>
        </div>
      )}

      <div className={`calc-main-card ${isPro ? 'calc-main-card--pro' : ''}`}>
          <div className="calc-header">
            <div className="calc-header-left">
              <div className="tab-group">
                <button type="button" className={`tab-btn ${activeTab === 'semester' ? 'active' : ''}`} onClick={() => setActiveTab('semester')}>Semester GPA</button>
                <button type="button" className={`tab-btn ${activeTab === 'cgpa' ? 'active' : ''}`} onClick={() => setActiveTab('cgpa')}>CGPA</button>
                <button type="button" className={`tab-btn ${activeTab === 'percentage' ? 'active' : ''}`} onClick={() => setActiveTab('percentage')}>Percentage</button>
              </div>
            </div>
            <div className="calc-header-right">
              {(activeTab === 'semester' || activeTab === 'cgpa') && !lockSystem && (
                <div className="system-select">
                  <span>Grading</span>
                  <select value={gradingSystem} onChange={handleSystemChange}>
                    {Object.keys(GRADING_SYSTEMS).map((sys) => (
                      <option key={sys} value={sys}>{sys}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="pro-toggle-wrap">
                <span className={`pro-toggle-label ${!isPro ? 'active' : ''}`}>Standard</span>
                <button
                  type="button"
                  className={`pro-toggle ${isPro ? 'pro-toggle--on' : ''}`}
                  onClick={() => setIsPro(!isPro)}
                  aria-pressed={isPro}
                  aria-label="Toggle Pro Calculator"
                >
                  <span className="pro-toggle-knob" />
                </button>
                <span className={`pro-toggle-label pro-toggle-label--pro ${isPro ? 'active' : ''}`}>
                  Pro <span className="pro-star">✦</span>
                </span>
              </div>
            </div>
          </div>

          <div className={`calc-layout ${isPro ? 'calc-layout--pro' : ''}`}>
            <div className="calc-body">
              {activeTab === 'semester' && (
                <>
                  <div className="grid-row-header">
                    <div>Course Name</div>
                    <div>Credits</div>
                    <div>Grade</div>
                    <div />
                  </div>
                  {courses.map((course) => (
                    <div key={course.id} className="grid-row">
                      <input type="text" className="field-input" placeholder="e.g. Data Structures" value={course.name} onChange={(e) => updateCourse(course.id, 'name', e.target.value)} />
                      <input type="number" className="field-input" placeholder="3" min="0" step="0.5" value={course.credits} onChange={(e) => updateCourse(course.id, 'credits', e.target.value)} />
                      <select className="field-input field-select" value={course.grade} onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}>
                        <option value="">Select grade</option>
                        {grades.map((g) => (
                          <option key={g.label} value={g.value}>{g.label} ({g.value.toFixed(2)})</option>
                        ))}
                      </select>
                      <button type="button" className="btn-del" onClick={() => removeCourse(course.id)} aria-label="Remove course">✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={addCourse}>+ Add Course</button>
                </>
              )}

              {activeTab === 'cgpa' && (
                <>
                  <div className="grid-row-header" style={{ gridTemplateColumns: '2.5fr 1.5fr 1fr 40px' }}>
                    <div>Semester</div>
                    <div>GPA</div>
                    <div>Credits</div>
                    <div />
                  </div>
                  {semesters.map((sem) => (
                    <div key={sem.id} className="grid-row" style={{ gridTemplateColumns: '2.5fr 1.5fr 1fr 40px' }}>
                      <input type="text" className="field-input" placeholder="e.g. Semester 3" value={sem.name} onChange={(e) => updateSemester(sem.id, 'name', e.target.value)} />
                      <input type="number" step="0.01" className="field-input" placeholder="3.50" value={sem.gpa} onChange={(e) => updateSemester(sem.id, 'gpa', e.target.value)} />
                      <input type="number" className="field-input" placeholder="15" value={sem.credits} onChange={(e) => updateSemester(sem.id, 'credits', e.target.value)} />
                      <button type="button" className="btn-del" onClick={() => removeSemester(sem.id)} aria-label="Remove semester">✕</button>
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={addSemester}>+ Add Semester</button>
                </>
              )}

              {activeTab === 'percentage' && (
                <div className="pct-layout">
                  <div>
                    <div className="pct-form-group">
                      <label className="pct-label">Percentage (%)</label>
                      <input type="number" className="field-input" placeholder="e.g. 75" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
                    </div>
                    <p className="pct-hint">Uses standard CBSE / UGC formula: CGPA = Percentage ÷ 9.5</p>
                  </div>
                  <div className="pct-result-card">
                    <div className="pct-label">Converted CGPA</div>
                    <div className="pct-converted-score">
                      <span className="pct-score-val">{convertedPercentageCGPA}</span>
                      <span className="result-max">/ 10.00</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="result-box">
                <div>
                  <div className="result-label">
                    {activeTab === 'semester' ? 'Semester GPA' : activeTab === 'cgpa' ? 'Cumulative CGPA' : 'Converted CGPA'}
                  </div>
                  {isPro && activeTab === 'semester' && gradingSystem === 'UK Honours' && (
                    <div className="result-honours">{honoursClass}</div>
                  )}
                </div>
                <div className="result-value-wrap">
                  <span className="result-score">{activeResult}</span>
                  <span className="result-max">/ {maxScore}</span>
                </div>
              </div>

              {isPro && (
                <div className="calc-actions-row">
                  <button type="button" className="btn-text" onClick={copyResult}>{copied ? 'Copied!' : 'Copy result'}</button>
                  <button type="button" className="btn-text" onClick={() => window.print()}>Print / PDF</button>
                  <button type="button" className="btn-text btn-text--danger" onClick={clearAll}>Clear all</button>
                </div>
              )}
            </div>

            {isPro && (
              <aside className="pro-panel">
                <div className="pro-panel-header">
                  <span className="pro-panel-badge">Pro ✦</span>
                  <h3>Advanced Tools</h3>
                </div>

                <div className="pro-stat-grid">
                  <div className="pro-stat">
                    <span className="pro-stat-val">{proStats.credits || '—'}</span>
                    <span className="pro-stat-label">Total credits</span>
                  </div>
                  <div className="pro-stat">
                    <span className="pro-stat-val">{proStats.filled}/{proStats.courses}</span>
                    <span className="pro-stat-label">Courses filled</span>
                  </div>
                  <div className="pro-stat">
                    <span className="pro-stat-val">{honoursClass.split(' ')[0] === '—' ? '—' : honoursClass.split('(')[0].trim()}</span>
                    <span className="pro-stat-label">Class standing</span>
                  </div>
                </div>

                <div className="pro-tool">
                  <h4>Target CGPA Planner</h4>
                  <p className="pro-tool-desc">Find the GPA you need next semester to hit your goal.</p>
                  <div className="pro-tool-fields">
                    <input type="number" step="0.01" className="field-input field-input--sm" placeholder="Target CGPA" value={targetCgpa} onChange={(e) => setTargetCgpa(e.target.value)} />
                    <input type="number" step="0.01" className="field-input field-input--sm" placeholder="Current CGPA" value={currentCgpa} onChange={(e) => setCurrentCgpa(e.target.value)} />
                    <input type="number" className="field-input field-input--sm" placeholder="Credits done" value={completedCredits} onChange={(e) => setCompletedCredits(e.target.value)} />
                    <input type="number" className="field-input field-input--sm" placeholder="Credits left" value={remainingCredits} onChange={(e) => setRemainingCredits(e.target.value)} />
                  </div>
                  {requiredGpa !== null && (
                    <div className="pro-tool-result">
                      You need <strong>{requiredGpa}</strong> GPA next term
                      {parseFloat(requiredGpa) > parseFloat(maxScore) && (
                        <span className="pro-tool-warn"> — may not be achievable on this scale</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pro-tool">
                  <h4>Quick tips</h4>
                  <ul className="pro-tips">
                    <li>High-credit courses affect CGPA the most — prioritise them.</li>
                    <li>Retaking a failed course can replace 0-grade points.</li>
                    <li>UK students: 2:1 (60%+) opens most grad schemes.</li>
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>

        <details className="grading-accordion" open={openGradingTable || undefined}>
          <summary>View full grading table for {gradingSystem}</summary>
          <div className="grading-table-wrap">
            <p className="grading-table-name">{GRADING_SYSTEMS[gradingSystem].name}</p>
            <table className="data-table">
              <thead>
                <tr><th>Marks</th><th>Grade</th><th>Points</th></tr>
              </thead>
              <tbody>
                {grades.map((g, i) => (
                  <tr key={i}><td>{g.range}</td><td><strong>{g.label}</strong></td><td>{g.value.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
    </>
  );

  if (university) {
    return (
      <div className="uni-calc-tool" id="calculator">
        {calculatorContent}
      </div>
    );
  }

  return (
    <section className="calc-section" id="calculator">
      <div className="container calc-wrapper">
        {calculatorContent}
      </div>
    </section>
  );
}
