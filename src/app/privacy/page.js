import PageLayout from '@/components/PageLayout';
import { getLegalPageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Privacy Policy',
  description:
    'How CGPA Calculator Pro handles your data. We do not collect grades or personal information — your calculations stay in your browser.',
  path: '/privacy',
});

const toc = (
  <>
    <a href="#short">The short version</a>
    <a href="#collect">What we collect</a>
    <a href="#cookies">Cookies &amp; ads</a>
    <a href="#use">How we use data</a>
    <a href="#third-party">Third-party services</a>
    <a href="#storage">Data storage &amp; security</a>
    <a href="#children">Children &amp; students</a>
    <a href="#rights">Your rights</a>
    <a href="#international">International users</a>
    <a href="#changes">Policy changes</a>
    <a href="#contact">Contact us</a>
  </>
);

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="We built CGPA Calculator Pro to help students, not to collect their data. Here is exactly what happens when you use our site — written in plain language, not legal jargon."
      toc={toc}
      linkGroups={getLegalPageLinkGroups()}
    >
      <h2 id="short">The short version</h2>
      <p>
        When you enter your grades into our calculator, that information stays on your device. We do not ask you to sign up,
        we do not store your CGPA on our servers, and we do not sell your data to anyone. That is the whole point — you should
        be able to check your grades without worrying about who might see them.
      </p>
      <p>
        We may collect basic, anonymous website analytics (like page views and country-level location) to improve the site.
        If we show ads in the future, ad networks may use their own cookies — but they never receive the grades you type into our calculator.
      </p>

      <h2 id="collect">What we collect (and what we do not)</h2>
      <p><strong>We do not collect or store:</strong></p>
      <ul>
        <li>Your name, email, student ID, or any account credentials (we have no accounts)</li>
        <li>Grades, CGPA, GPA, course names, or credit hours you enter in the calculator</li>
        <li>Your official transcripts or academic documents</li>
        <li>Precise GPS location or home address</li>
        <li>Contacts, photos, or files from your device</li>
      </ul>
      <p>
        Calculator inputs are processed entirely in your browser using JavaScript. Nothing you type is transmitted to our
        servers during normal calculator use. When you close the tab, that session data is gone unless you use Pro features
        that optionally save to your browser&apos;s local storage — and even then, it stays on your device only.
      </p>
      <p><strong>We may automatically collect:</strong></p>
      <ul>
        <li>Pages visited, time spent, and general navigation patterns</li>
        <li>Browser type, device type, screen size, and operating system</li>
        <li>Approximate geographic location (country or city level, derived from IP address)</li>
        <li>Referring website (e.g., if you arrived from Google search)</li>
        <li>Anonymous error logs if something breaks on the site</li>
      </ul>
      <p>
        This data is aggregated and cannot reasonably be used to identify you personally. We use it to understand which
        calculators are most popular, fix bugs, and decide which university grading scales to add next.
      </p>

      <h2 id="cookies">Cookies and advertising</h2>
      <p>
        We use cookies for basic site functionality. We also use or plan to use Google AdSense and similar
        services to show ads that help keep the site free. Those partners may set their own cookies to
        display relevant ads based on your general browsing history on other websites.
      </p>
      <p>
        Important: ad cookies do <strong>not</strong> receive your calculator inputs. Your CGPA never leaves your browser,
        so advertisers cannot target you based on your academic performance. That would be creepy, and we do not do it.
      </p>
      <p>
        You can control cookies through your browser settings, opt out of Google personalised ads at{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>,
        or read our full <a href="/cookies">Cookie Policy</a> for more detail.
      </p>

      <h2 id="use">How we use the information we have</h2>
      <ul>
        <li>Keep the website running smoothly and fix technical errors</li>
        <li>Understand which features and university scales students use most</li>
        <li>Improve calculator accuracy and add new grading systems</li>
        <li>Display advertising to help cover hosting and development costs</li>
        <li>Respond to messages you send through our contact form or email</li>
        <li>Protect against spam, abuse, and automated bot attacks</li>
      </ul>
      <p>
        We do not use your data to build marketing profiles, send promotional emails without consent, sell to data brokers,
        or share with third parties for their own marketing purposes.
      </p>

      <h2 id="third-party">Third-party services</h2>
      <p>CGPA Calculator Pro relies on external services to operate:</p>
      <ul>
        <li><strong>Hosting providers</strong> — serve website files to your browser</li>
        <li><strong>Analytics tools</strong> — may include Google Analytics for aggregated traffic stats</li>
        <li><strong>Advertising networks</strong> — may include Google AdSense for display ads</li>
        <li><strong>Font services</strong> — Google Fonts for typography</li>
      </ul>
      <p>
        Each provider has its own privacy policy governing how they handle data. We choose partners carefully and configure
        them to collect the minimum data necessary. We cannot fully control third-party practices, so we encourage you to
        review Google&apos;s privacy policy if you interact with ads on our site.
      </p>

      <h2 id="storage">Data storage and security</h2>
      <p>
        Because we do not collect your academic data, there is no central database of student grades to breach.
        Contact form submissions (name, email, message) are processed to reply to you and are not sold or shared.
      </p>
      <p>
        We use HTTPS encryption for all pages, keep software updated, and follow reasonable security practices.
        No online service is 100% secure, but we design CGPA Calculator Pro so that the most sensitive data — your grades — never
        reaches our servers in the first place.
      </p>

      <h2 id="children">Children and students</h2>
      <p>
        CGPA Calculator Pro is designed for students of all ages, including those under 13. We do not knowingly collect personal
        information from children. Since we do not require accounts and do not store calculator inputs on our servers,
        there is typically no personal data to collect from anyone, regardless of age.
      </p>
      <p>
        If you are a parent or guardian and believe your child has submitted personal information through our contact form,
        please contact us and we will delete it promptly.
      </p>

      <h2 id="rights">Your rights</h2>
      <p>Depending on where you live, you may have rights including:</p>
      <ul>
        <li><strong>Access</strong> — ask what personal data we hold about you</li>
        <li><strong>Correction</strong> — request correction of inaccurate data</li>
        <li><strong>Deletion</strong> — request deletion of your personal data</li>
        <li><strong>Objection</strong> — object to certain types of processing</li>
        <li><strong>Portability</strong> — receive your data in a portable format</li>
      </ul>
      <p>
        For most users, we hold very little personal data — typically only a contact form message if you wrote to us.
        To exercise any of these rights, email us via our <a href="/contact">Contact page</a>.
      </p>

      <h2 id="international">International users</h2>
      <p>
        CGPA Calculator Pro is used by students in Bangladesh, India, Pakistan, Malaysia, the UK, Europe, and elsewhere. If you access our site
        from the European Economic Area (EEA), UK, or other regions with data protection laws, you have additional rights
        under GDPR and similar regulations. We apply the same privacy principles to all users regardless of location.
      </p>
      <p>
        Our servers may be located in countries different from yours. By using CGPA Calculator Pro, you acknowledge that your
        anonymous analytics data may be processed in those locations with appropriate safeguards.
      </p>

      <h2 id="changes">Changes to this policy</h2>
      <p>
        We may update this page as the site grows — for example, if we add new features, ad partners, or analytics tools.
        When we do, we will change the &quot;Last updated&quot; date at the top. Significant changes will be noted in this section.
        Continuing to use CGPA Calculator Pro after an update means you accept the revised policy.
      </p>

      <h2 id="contact">Questions?</h2>
      <p>
        Privacy policies should not require a law degree to understand. If anything here is unclear, or you want to
        know something specific about your data, visit our <a href="/contact">Contact page</a> or email{' '}
        <a href="mailto:hello@cgpacalculatorpro.com">hello@cgpacalculatorpro.com</a>. We read every message and try to reply within a few days.
      </p>
    </PageLayout>
  );
}
