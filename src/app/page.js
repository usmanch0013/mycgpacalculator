import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CalculatorTabs from '@/components/CalculatorTabs';
import FeaturesSection from '@/components/FeaturesSection';
import FormulaSection from '@/components/FormulaSection';
import UniversityGrid from '@/components/UniversityGrid';
import RegionBanner from '@/components/RegionBanner';
import MalaysiaBanner from '@/components/MalaysiaBanner';
import SEOArticle from '@/components/SEOArticle';
import FAQ from '@/components/FAQ';
import InternalLinkHub from '@/components/InternalLinkHub';
import JsonLd from '@/components/JsonLd';
import Footer from '@/components/Footer';
import { getHomepageLinkGroups } from '@/lib/internalLinks';
import { buildPageMetadata, HOMEPAGE_JSON_LD } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'CGPA Calculator — Free GPA to Percentage Converter Online',
  description:
    'Free CGPA calculator online — calculate semester GPA, cumulative CGPA, and convert CGPA to percentage. UTM, UiTM, SRM, NSU, VIT, NUST & 60+ university grading scales. No signup.',
  path: '/',
  openGraph: {
    title: 'CGPA Calculator — Free GPA & Percentage Converter',
    description:
      'Calculate CGPA, semester GPA, and CGPA to percentage instantly. University-specific calculators for Bangladesh, India, Pakistan, UK & Europe.',
  },
});

export default function Home() {
  return (
    <>
      <JsonLd data={HOMEPAGE_JSON_LD} />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Suspense fallback={<div className="calc-section"><div className="container text-center" style={{ padding: '4rem 0', color: 'var(--text-tertiary)' }}>Loading calculator…</div></div>}>
          <CalculatorTabs />
        </Suspense>
        <FeaturesSection />
        <FormulaSection />
        <UniversityGrid />
        <MalaysiaBanner />
        <RegionBanner />
        <SEOArticle />
        <InternalLinkHub
          title="Explore calculators & guides"
          subtitle="Jump to popular university pages, country directories, and help resources."
          groups={getHomepageLinkGroups()}
          variant="muted"
        />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
