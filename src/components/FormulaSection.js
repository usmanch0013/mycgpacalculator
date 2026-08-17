export default function FormulaSection() {
  return (
    <section className="section bg-white" id="formula">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How your CGPA is calculated</h2>
          <p className="section-subtitle">
            Every university weights courses by credits. Here is the formula, plus a real UGC example if you study in Bangladesh.
          </p>
        </div>

        <div className="formula-grid">
          <div className="formula-card-dark">
            <div className="formula-dark-title">The Universal Formula</div>
            <div className="formula-math">
              <span className="white">CGPA = Σ (Credits × Grade Points)</span> <br/>
              <hr />
              <span className="white">Σ (Total Credits)</span>
            </div>
            <p className="formula-dark-desc">Every course is weighted by its credit hours. A 4-credit course impacts your score four times more than a 1-credit course.</p>
          </div>

          <div className="formula-card-light">
            <div className="table-title">Example Conversion (UGC Scale)</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Letter</th>
                  <th>Marks</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>A+</strong></td>
                  <td>80 - 100%</td>
                  <td className="text-green">4.00</td>
                </tr>
                <tr>
                  <td><strong>A</strong></td>
                  <td>75 - 79%</td>
                  <td className="text-green">3.75</td>
                </tr>
                <tr>
                  <td><strong>A-</strong></td>
                  <td>70 - 74%</td>
                  <td className="text-green">3.50</td>
                </tr>
                <tr>
                  <td><strong>B+</strong></td>
                  <td>65 - 69%</td>
                  <td className="text-blue">3.25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="formula-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <h4 className="step-title">List Your Subjects</h4>
            <p className="step-desc">Note down every course you have taken along with its assigned credit hours.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <h4 className="step-title">Determine Grade Points</h4>
            <p className="step-desc">Convert your letter grades (A, B+) into numerical grade points using your university scale.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <h4 className="step-title">Multiply & Aggregate</h4>
            <p className="step-desc">Multiply each course&apos;s credit by its grade point, then add them all together.</p>
          </div>
          <div className="step-card">
            <div className="step-num">04</div>
            <h4 className="step-title">Calculate Average</h4>
            <p className="step-desc">Divide the total aggregate points by your total earned credits. That&apos;s your CGPA.</p>
          </div>
        </div>

        <p className="formula-links-note">
          Your faculty might use a different table — open the calculator built for{' '}
          <a href="/calculator/brac-university">BRACU</a>,{' '}
          <a href="/calculator/utm">UTM</a>, or{' '}
          <a href="/calculator/vit-vellore">VIT</a> if it is on our list. Otherwise browse{' '}
          <a href="/universities">all universities</a> or read the longer{' '}
          <a href="/#guide">CGPA guide</a> below.
        </p>
      </div>
    </section>
  );
}
