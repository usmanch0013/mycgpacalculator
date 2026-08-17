import Link from 'next/link';
import { HOMEPAGE_FAQS } from '@/lib/seo';

function renderAnswer(faq) {
  switch (faq.question) {
    case 'How to calculate CGPA?':
      return (
        <>
          {faq.answer}{' '}
          Try our <Link href="/#calculator">free CGPA calculator</Link> or read the{' '}
          <Link href="/#guide">complete CGPA guide</Link>.
        </>
      );
    case 'How to convert CGPA to percentage?':
      return (
        <>
          {faq.answer}{' '}
          Use university calculators —{' '}
          <Link href="/calculator/srm-university">SRM</Link>,{' '}
          <Link href="/calculator/vit-vellore">VIT</Link>,{' '}
          <Link href="/calculator/north-south-university">NSU</Link>, or{' '}
          <Link href="/calculator/nust">NUST</Link>.
        </>
      );
    case 'How to calculate CGPA from SGPA?':
      return (
        <>
          {faq.answer}{' '}
          Open <Link href="/#calculator">CGPA mode</Link> in our calculator and enter each semester.
        </>
      );
    case 'How can I convert my CGPA to a percentage?':
      return (
        <>
          The conversion formula varies by university. Try —{' '}
          <Link href="/calculator/vit-vellore">VIT CGPA Calculator</Link>,{' '}
          <Link href="/calculator/university-of-dhaka">DU</Link>, or{' '}
          <Link href="/calculator/nust">NUST</Link> — or see the{' '}
          <Link href="/#formula">CGPA formula section</Link>.
        </>
      );
    case 'Is a 3.5 CGPA considered good?':
      return (
        <>
          On a 4.0 scale, 3.5 is typically excellent. Use our{' '}
          <Link href="/#calculator">CGPA calculator</Link> with your university grading system.
        </>
      );
    case 'Which grading system should I select?':
      return (
        <>
          Pick the system matching your transcript. Browse{' '}
          <Link href="/universities/bangladesh">Bangladesh</Link>,{' '}
          <Link href="/universities/india">India</Link>, or{' '}
          <Link href="/universities/pakistan">Pakistan</Link> — including{' '}
          <Link href="/calculator/srm-university">SRM</Link>,{' '}
          <Link href="/calculator/brac-university">BRACU</Link>, and{' '}
          <Link href="/calculator/nust">NUST</Link> calculators.
        </>
      );
    case 'Is this CGPA calculator free to use?':
      return (
        <>
          Yes — completely free. See our <Link href="/privacy">privacy policy</Link>.
        </>
      );
    default:
      return faq.answer;
  }
}

export default function FAQ() {
  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <header className="section-header">
          <div className="badge" style={{ marginBottom: '0.875rem' }}>Support & Help</div>
          <h2 className="section-title" id="faq-heading">Questions students actually ask</h2>
          <p className="section-subtitle">
            CGPA math, percentage conversion, and picking the right grading system — answered without the jargon.
          </p>
        </header>

        <div className="faq-container">
          {HOMEPAGE_FAQS.map((faq) => (
            <details key={faq.question} className="faq-item">
              <summary className="faq-summary">{faq.question}</summary>
              <div className="faq-content">{renderAnswer(faq)}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
