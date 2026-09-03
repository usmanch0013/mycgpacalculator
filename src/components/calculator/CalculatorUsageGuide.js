import CalculatorUsagePreview from './CalculatorUsagePreview';

export default function CalculatorUsageGuide({ guide }) {
  return (
    <section className="calc-usage-guide" aria-labelledby="calc-usage-title">
      <div className="container">
        <div className="calc-usage-guide__card">
          <div className="calc-usage-guide__head">
            <p className="calc-usage-guide__eyebrow">Step-by-step walkthrough</p>
            <h2 id="calc-usage-title">{guide.title}</h2>
            <p className="calc-usage-guide__lead">{guide.lead}</p>
          </div>

          <div className="calc-usage-guide__grid">
            <figure className="calc-usage-guide__figure">
              <CalculatorUsagePreview
                preview={{ ...guide.preview, ariaLabel: guide.imageAlt }}
              />
              <figcaption className="calc-usage-guide__caption">
                {guide.preview.shortName} calculator preview — your grades use{' '}
                {guide.preview.systemName}. Results update live in the tool above.
              </figcaption>
            </figure>

            <div className="calc-usage-guide__steps">
              <ol className="calc-usage-steps">
                {guide.steps.map((step, index) => (
                  <li key={step.title} className="calc-usage-step">
                    <span className="calc-usage-step__num">{index + 1}</span>
                    <div>
                      <h3 className="calc-usage-step__title">{step.title}</h3>
                      <p className="calc-usage-step__body">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="calc-usage-example">
                <p className="calc-usage-example__label">Worked example</p>
                <ul className="calc-usage-example__courses">
                  {guide.example.courses.map((course) => (
                    <li key={course.name}>
                      <strong>{course.name}</strong>
                      <span>
                        {course.credits} cr · {course.grade} ({course.points} pts)
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="calc-usage-example__formula">{guide.example.formula}</p>
                <p className="calc-usage-example__result">
                  Semester GPA: <strong>{guide.example.result}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="calc-usage-guide__privacy">
            <span className="calc-usage-guide__privacy-icon" aria-hidden>
              🔒
            </span>
            <p>{guide.collectionNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
