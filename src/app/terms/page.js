import PageLayout from '@/components/PageLayout';
import { getLegalPageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Terms of Service',
  description: 'Simple, fair terms for using CGPA Calculator Pro — a free CGPA and GPA calculator for students worldwide.',
  path: '/terms',
});

const toc = (
  <>
    <a href="#agreement">Agreement</a>
    <a href="#service">What we provide</a>
    <a href="#acceptable">Acceptable use</a>
    <a href="#ip">Intellectual property</a>
    <a href="#ads">Ads &amp; links</a>
    <a href="#disclaimer">Disclaimers</a>
    <a href="#liability">Liability</a>
    <a href="#changes">Changes</a>
    <a href="#contact">Contact</a>
  </>
);

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms of Service"
      subtitle="Nothing complicated here. Just ground rules so we can keep CGPA Calculator Pro free, accurate, and useful for students everywhere."
      toc={toc}
      linkGroups={getLegalPageLinkGroups()}
    >
      <h2 id="agreement">By using CGPA Calculator Pro, you agree to these terms</h2>
      <p>
        That sounds formal, but it basically means: use the site responsibly, do not try to break it, and understand
        that our calculator gives estimates — not official academic records. If that works for you, you are good to go.
      </p>
      <p>
        These terms apply to all visitors — whether you are calculating CGPA for Dhaka University, checking honours
        classification for Oxford, or converting percentages for an IIT application.
      </p>

      <h2 id="service">What CGPA Calculator Pro is (and is not)</h2>
      <p>
        CGPA Calculator Pro is a free online tool that helps students calculate semester GPA, cumulative CGPA, and rough
        percentage conversions using publicly documented grading scales — mainly in South Asia, Malaysia,
        the UK, and Europe.
      </p>
      <p><strong>We provide:</strong></p>
      <ul>
        <li>Free CGPA, GPA, and percentage calculators</li>
        <li>University-specific grading scale references</li>
        <li>Educational guides about academic grading systems</li>
        <li>Pro calculator tools for planning and insights</li>
      </ul>
      <p><strong>We do not provide:</strong></p>
      <ul>
        <li>Official transcripts or certified grade conversions</li>
        <li>Legal, immigration, or scholarship advice</li>
        <li>Guaranteed accuracy for every institution in every year</li>
        <li>Any affiliation with universities, boards, or government bodies</li>
      </ul>
      <p>
        Always verify results with your official transcript or registrar before submitting grades to employers,
        scholarship boards, or visa offices. Universities update grading policies without always announcing it publicly.
      </p>

      <h2 id="acceptable">Acceptable use</h2>
      <p>You are welcome to use CGPA Calculator Pro for personal, educational, and non-commercial purposes. Please do not:</p>
      <ul>
        <li>Scrape, copy, or republish large portions of the site without permission</li>
        <li>Attempt to hack, overload, reverse-engineer, or disrupt our servers</li>
        <li>Use automated bots to send excessive requests</li>
        <li>Pass off our calculators as an official university tool</li>
        <li>Use the site for anything illegal or harmful</li>
        <li>Misrepresent calculated results as official certified documents</li>
      </ul>

      <h2 id="ip">Intellectual property</h2>
      <p>
        The CGPA Calculator Pro name, design, written content, calculator logic, and branding belong to us. You may link to our site,
        share it with classmates, and use the calculators freely for personal academic purposes. You may not clone the
        entire site and sell it as your own product without written consent.
      </p>

      <h2 id="ads">Ads and third-party links</h2>
      <p>
        CGPA Calculator Pro may display advertising to remain free. Clicking an ad takes you to a third-party site — we are not
        responsible for their content or practices. External links are provided for convenience, not endorsement.
      </p>

      <h2 id="disclaimer">Disclaimer of warranties</h2>
      <p>
        We work hard to keep CGPA Calculator Pro accurate and available, but the site is provided &quot;as is&quot; without warranties
        of any kind. We do not guarantee uninterrupted access, error-free calculations, or compatibility with every device.
        Use results as a helpful guide, not as an official document.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, CGPA Calculator Pro and its creators are not liable for any loss or damage arising
        from your use of the site — including missed deadlines, incorrect applications, or decisions made based on
        calculator results. Your academic decisions remain yours to make.
      </p>

      <h2 id="changes">Changes to these terms</h2>
      <p>
        We may update these terms as the site evolves. The date at the top shows when we last changed them.
        Continued use after an update means you accept the new terms.
      </p>

      <h2 id="contact">Questions?</h2>
      <p>
        Terms should not feel intimidating. If something is unclear, <a href="/contact">send us a message</a> and
        we will explain it in plain language.
      </p>
    </PageLayout>
  );
}
