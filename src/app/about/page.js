import PageLayout from '@/components/PageLayout';
import { getLegalPageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'About Us',
  description:
    'Who runs CGPA Calculator Pro, why we built a free CGPA calculator, and how we keep grading scales accurate for students in Bangladesh, India, Pakistan, Malaysia, and beyond.',
  path: '/about',
});

const toc = (
  <>
    <a href="#why">Why we exist</a>
    <a href="#different">What makes us different</a>
    <a href="#who">Who we are</a>
    <a href="#funding">How we stay free</a>
    <a href="#accuracy">Accuracy</a>
    <a href="#next">What is next</a>
  </>
);

export default function AboutPage() {
  return (
    <PageLayout
      title="About CGPA Calculator Pro"
      subtitle="We got tired of CGPA calculators that ask for your email before showing a number. So we built one that does not."
      toc={toc}
      linkGroups={getLegalPageLinkGroups()}
    >
      <h2 id="why">Why this site exists</h2>
      <p>
        Every semester someone opens a spreadsheet at 1 a.m. trying to figure out if they can still graduate with honours.
        Maybe they need a percentage for a scholarship form. Maybe they just want to know what happens if they pass one
        more course with a B instead of an A. The math is not hard — but finding the right grade scale is annoying.
      </p>
      <p>
        Most calculator sites we tried were either stuck on one country, covered in pop-ups, or wanted a sign-up before
        you could see anything. CGPA Calculator Pro started as a weekend project to fix that: one clean page, correct grading tables,
        no account. It grew from there because students kept asking for their specific university.
      </p>

      <h2 id="different">What makes us different</h2>
      <ul>
        <li><strong>60+ universities</strong> — from NSU and SRM to UTM and Oxford, each with its own scale where it matters.</li>
        <li><strong>Your grades stay on your device</strong> — we are not building a database of student records. That would be weird.</li>
        <li><strong>Pro mode when you need it</strong> — target CGPA planning, copy results, print-friendly layout.</li>
        <li><strong>Actually free</strong> — basic calculations will not go behind a paywall.</li>
        <li><strong>Written for students</strong> — guides and FAQs in plain English, not copy-pasted policy text.</li>
      </ul>

      <h2 id="who">Who we are</h2>
      <p>
        A small team of developers and former students who remember result-day stress. We are not a university office,
        not a government body, and not a funded ed-tech startup. When we list BRAC, UTM, IIT, or NUST, it is because
        we mapped their grading scales — not because they officially partnered with us.
      </p>
      <p>
        If you spot a wrong grade boundary, tell us. Students who actually use these scales are our best reviewers.
      </p>

      <h2 id="funding">How we keep the lights on</h2>
      <p>
        Hosting and domains cost money. We plan to cover that with display advertising (Google AdSense and similar).
        Ads may appear on the site; they will not affect how the calculator works, and they will never see the grades
        you type in. We will not sell your data or charge students for basic CGPA math. That line is not moving.
      </p>

      <h2 id="accuracy">Our commitment to accuracy</h2>
      <p>
        Grading tables change. Faculties publish updates in PDFs nobody reads until something breaks. We check handbooks,
        student feedback, and official pages when we can. Still, always treat your registrar&apos;s transcript as the final word —
        use CGPA Calculator Pro to plan and double-check, not as an official certificate.
      </p>

      <h2 id="next">What is next</h2>
      <p>
        More universities, better Pro tools, clearer guides. Missing yours? Send the grading table link through our{' '}
        <a href="/contact">contact page</a> and we will look at adding it.
      </p>
      <p>
        Good luck with your results — whichever country you are studying in.
      </p>
    </PageLayout>
  );
}
