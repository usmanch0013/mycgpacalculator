export default function CalculatorUsagePreview({ preview }) {
  return (
    <div className="calc-usage-preview" role="img" aria-label={preview.ariaLabel}>
      <div className="uni-calc-bar calc-usage-preview__bar">
        <span className="uni-calc-bar-label">
          Grading system locked to <strong>{preview.systemName}</strong>
        </span>
      </div>

      <div className="calc-main-card calc-usage-preview__card">
        <div className="calc-header">
          <div className="calc-header-left">
            <div className="tab-group">
              <span className="tab-btn active">Semester GPA</span>
              <span className="tab-btn">CGPA</span>
              <span className="tab-btn">Percentage</span>
            </div>
          </div>
          <div className="calc-header-right">
            <div className="pro-toggle-wrap">
              <span className="pro-toggle-label active">Standard</span>
              <span className="pro-toggle" aria-hidden />
              <span className="pro-toggle-label pro-toggle-label--pro">
                Pro <span className="pro-star">✦</span>
              </span>
            </div>
          </div>
        </div>

        <div className="calc-body">
          <div className="grid-row-header">
            <div>Course Name</div>
            <div>Credits</div>
            <div>Grade</div>
            <div />
          </div>

          {preview.courses.map((course) => (
            <div key={course.name} className="grid-row calc-usage-preview__row">
              <div className="field-input calc-usage-preview__field">{course.name}</div>
              <div className="field-input calc-usage-preview__field calc-usage-preview__field--sm">
                {course.credits}
              </div>
              <div className="field-input calc-usage-preview__field">
                {course.gradeLabel} ({course.gradeValue})
              </div>
              <div className="btn-del calc-usage-preview__del" aria-hidden>
                ✕
              </div>
            </div>
          ))}

          <div className="btn-add calc-usage-preview__add">+ Add Course</div>

          <div className="result-box">
            <div>
              <div className="result-label">Semester GPA</div>
            </div>
            <div className="result-value-wrap">
              <span className="result-score">{preview.resultScore}</span>
              <span className="result-max">/ {preview.resultMax}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="calc-usage-preview__badge">{preview.shortName} example preview</p>
    </div>
  );
}
