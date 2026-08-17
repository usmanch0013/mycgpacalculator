import Link from 'next/link';
import { GUIDE_CALCULATOR_LINKS } from '@/lib/internalLinks';

export default function SEOArticle() {
  return (
    <section className="seo-section" id="guide">
      <div className="container">
        <div className="section-header">
          <div className="badge">Educational Guide</div>
          <h2 className="section-title">CGPA explained (without the headache)</h2>
          <p className="section-subtitle">
            How semester GPA differs from cumulative CGPA, why percentage conversion is never universal, and what changes by country.
          </p>
        </div>

        <div className="seo-layout">
          <aside>
            <div className="seo-sidebar">
              <div className="seo-nav-title">On this page</div>
              <nav className="seo-nav" aria-label="Article sections">
                <a href="#how-to-calculate">How to Calculate CGPA</a>
                <a href="#cgpa-to-percentage">CGPA to Percentage</a>
                <a href="#decoding">SGPA vs CGPA</a>
                <a href="#regional">Regional Grading Nuances</a>
                <a href="#uk-europe">UK &amp; Europe</a>
                <a href="#converting">Converting CGPA to Percentages</a>
                <a href="#improving">How to Improve Your CGPA</a>
              </nav>
              <div className="seo-sidebar-links">
                <p className="seo-nav-title">Popular calculators</p>
                <nav aria-label="Related calculators">
                  <Link href="/calculator/srm-university">SRM CGPA Calculator</Link>
                  <Link href={GUIDE_CALCULATOR_LINKS.nsu.href}>{GUIDE_CALCULATOR_LINKS.nsu.label}</Link>
                  <Link href={GUIDE_CALCULATOR_LINKS.bracu.href}>{GUIDE_CALCULATOR_LINKS.bracu.label}</Link>
                  <Link href={GUIDE_CALCULATOR_LINKS.vit.href}>{GUIDE_CALCULATOR_LINKS.vit.label}</Link>
                  <Link href="/universities">View all universities →</Link>
                </nav>
              </div>
            </div>
          </aside>

          <article className="seo-content">
            <h3 id="how-to-calculate">How to calculate CGPA</h3>
            <p>
              The formula every registrar uses is boring but simple: grade point × credit hours for each course,
              add them, divide by total credits.
            </p>
            <p>
              <strong>CGPA = Σ (Credits × Grade Points) ÷ Σ (Total Credits)</strong>
            </p>
            <p>
              One semester? That is SGPA — same math, one term only. Several semesters? Weight each term by its
              credits. Our <Link href="/#calculator">main calculator</Link> handles both, or jump straight to{' '}
              <Link href="/calculator/srm-university">SRM</Link>,{' '}
              <Link href="/calculator/north-south-university">NSU</Link>, or{' '}
              <Link href="/calculator/brac-university">BRACU</Link> if your scale is already listed.
            </p>

            <h3 id="cgpa-to-percentage">CGPA to percentage</h3>
            <p>
              This is where students argue in group chats. Some multiply by 9.5, others by 10, Bangladesh often
              uses × 25 as a rough guess. None of those is automatically correct for your faculty.
            </p>
            <p>
              Use the Percentage tab here for a quick estimate, or open a dedicated page like{' '}
              <Link href="/calculator/vit-vellore">VIT</Link> or{' '}
              <Link href="/calculator/national-university-bangladesh">NU</Link> if we have your school. When it
              matters for a job or visa, use the number on your transcript.
            </p>

            <h3 id="decoding">SGPA vs CGPA — what is the difference?</h3>
            <p>
              <strong>SGPA</strong> is one semester. <strong>CGPA</strong> is everything so far, weighted by credits.
              Mess up first year and you will feel it — later A grades move the needle less because old credits still count.
            </p>
            <p>
              The <Link href="/#calculator">Pro tab</Link> lets you plug in a target CGPA and see what you would need next term. Handy before registration week.
            </p>

            <h3 id="regional">Grading by country (quick version)</h3>
            <p>
              Bangladesh mostly runs on a 4.0 UGC-style scale, but BRACU, NSU, UIU, and IUB all tweak the cut-offs slightly.
              Public DU and National University paths follow UGC more closely — see{' '}
              <Link href="/universities/bangladesh">Bangladesh calculators</Link>.
            </p>
            <p>
              India is often a 10-point scale (VIT, SRM, KTU, GGSIPU, Saveetha, etc.) —{' '}
              <Link href="/universities/india">full India list</Link>.
            </p>
            <p>
              Pakistan (NUST, UAF, LUMS…) under HEC norms —{' '}
              <Link href="/universities/pakistan">Pakistan hub</Link>.
            </p>
            <p>
              Malaysia: IPTA schools like UTM and UiTM, private UTAR, plus STPM before uni —{' '}
              <Link href="/universities/malaysia">Malaysia hub</Link> has the lot.
            </p>

            <div className="seo-callout">
              <h4 className="seo-callout-title">UK &amp; Australia</h4>
              <p>
                No classic GPA — you get classifications (First, 2:1, 2:2…). We have pages for Oxford, TUM, ECTS, and more on the{' '}
                <Link href="/universities/uk-europe">UK &amp; Europe hub</Link>.
              </p>
            </div>

            <h3 id="uk-europe">UK &amp; European grading</h3>
            <p>
              UK undergrad: <strong>First (70%+)</strong>, <strong>2:1 (60–69%)</strong>, <strong>2:2 (50–59%)</strong>, <strong>Third (40–49%)</strong>.
              Most grad jobs want a 2:1 minimum.
            </p>
            <p>
              Continental Europe uses ECTS (A = excellent, E = pass). Germany flips the scale — 1.0 is best, not 4.0.
            </p>
            <p>
              Pick your school on the{' '}
              <Link href="/universities/uk-europe">UK &amp; Europe directory</Link> or try the{' '}
              <Link href="/calculator/university-of-oxford">Oxford calculator</Link>.
            </p>

            <h3 id="converting">Turning CGPA into a percentage</h3>
            <p>
              Three common approaches — and your uni might use none of them:
            </p>
            <ul>
              <li><strong>Fixed multiplier</strong> — e.g. CGPA × 9.5 (common in CBSE-style docs).</li>
              <li><strong>Grade slabs</strong> — A = 75%, B+ = 70%, with interpolation in between.</li>
              <li><strong>Transcript only</strong> — for visas and serious applications, attach the official document; do not invent a number.</li>
            </ul>
            <p>
              Safer picks: <Link href={GUIDE_CALCULATOR_LINKS.iit.href}>IIT Delhi</Link> or{' '}
              <Link href={GUIDE_CALCULATOR_LINKS.nust.href}>NUST</Link> pages instead of a random online converter.
            </p>

            <h3 id="improving">Raising your CGPA</h3>
            <p>
              Prioritise high-credit courses — one B in a 4-credit lab hurts more than an A in a 1-credit elective.
              If retakes are allowed, they can help, but check whether your uni averages both attempts or replaces the grade.
            </p>
            <p>
              Before finals, use the <Link href="/#calculator">Pro calculator</Link> to see how many points you actually need. Less panic, more planning.
            </p>

            <p className="seo-disclaimer">
              This is a student tool, not official advice. When in doubt, ask your registrar or read the handbook on your portal.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
