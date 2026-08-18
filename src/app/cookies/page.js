import PageLayout from '@/components/PageLayout';
import { getLegalPageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Cookie Policy',
  description: 'What cookies CGPA Calculator Pro uses, why they exist, and how you can control them.',
  path: '/cookies',
});

const toc = (
  <>
    <a href="#what">What is a cookie?</a>
    <a href="#use">Cookies we use</a>
    <a href="#third-party">Third-party cookies</a>
    <a href="#control">How to control cookies</a>
    <a href="#dnt">Do Not Track</a>
    <a href="#changes">Updates</a>
  </>
);

export default function CookiesPage() {
  return (
    <PageLayout
      title="Cookie Policy"
      subtitle="Cookies sound technical, but they are really just small files that help websites work. Here is exactly how we use them — no hidden surprises."
      toc={toc}
      linkGroups={getLegalPageLinkGroups()}
    >
      <h2 id="what">What is a cookie?</h2>
      <p>
        A cookie is a tiny text file stored in your browser when you visit a website. It might remember your language
        preference, keep a session active, or help a site understand how people use it. Cookies cannot access your files,
        install software, or read the grades you type into our calculator.
      </p>
      <p>
        There are two main types: <strong>session cookies</strong> (deleted when you close the browser) and{' '}
        <strong>persistent cookies</strong> (stay until they expire or you delete them).
      </p>

      <h2 id="use">Does CGPA Calculator Pro use cookies?</h2>
      <p>
        Yes, but sparingly. Because we may show ads to keep the site free, some cookies come from advertising partners.
        We never use cookies to track your academic data — your calculator inputs stay in your browser and are never
        written to advertising cookies.
      </p>

      <h3>Essential cookies</h3>
      <p>
        These keep basic site functions working — like remembering if you toggled Pro Calculator mode during your session.
        Without them, some features may not work correctly.
      </p>

      <h3>Analytics cookies</h3>
      <p>
        We may use Google Analytics or similar tools to see how many people visit each page and which calculators are
        most popular. This data is aggregated — we see trends like &quot;500 people used the BRAC calculator today,&quot;
        not &quot;student X got a 3.5 CGPA.&quot;
      </p>

      <h3>Advertising cookies</h3>
      <p>
        Google AdSense and similar services may set cookies to show ads relevant to your general interests based on
        sites you have visited elsewhere. These cookies do not know your CGPA, your name, or your university.
      </p>

      <h2 id="third-party">Third-party cookies</h2>
      <p>
        When you see an ad on CGPA Calculator Pro, that ad may set its own cookies governed by the advertiser&apos;s policy.
        Google&apos;s advertising cookie policy is at{' '}
        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
          policies.google.com/technologies/ads
        </a>.
      </p>

      <h2 id="control">How to control or disable cookies</h2>
      <ul>
        <li><strong>Browser settings:</strong> Chrome, Firefox, Safari, and Edge all let you block or delete cookies in privacy settings.</li>
        <li><strong>Google ad settings:</strong> Visit <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a> to opt out of personalised Google ads.</li>
        <li><strong>Industry opt-out:</strong> Visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">aboutads.info/choices</a> for broader ad network opt-outs.</li>
      </ul>
      <p>
        Blocking all cookies will not break our calculator — you can still calculate your CGPA. You may see less relevant
        ads, but the core tool stays fully functional.
      </p>

      <h2 id="dnt">Do Not Track</h2>
      <p>
        Some browsers send a &quot;Do Not Track&quot; signal. There is no universal standard for how sites respond, but we
        respect your privacy choices through the cookie controls above.
      </p>

      <h2 id="changes">Updates to this policy</h2>
      <p>
        If we add new tools or ad partners, we will update this page and change the date at the top.
        Questions? <a href="/contact">Contact us</a>.
      </p>
    </PageLayout>
  );
}
