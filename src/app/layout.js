import "./globals.css";
import JsonLd from "@/components/JsonLd";
import CookieConsent from "@/components/CookieConsent";
import {
  SITE_NAME,
  SITE_URL,
  SITE_TAGLINE,
  DEFAULT_OG_IMAGE,
  GLOBAL_JSON_LD,
} from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `CGPA Calculator — Free GPA to Percentage Converter Online | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free CGPA calculator online — calculate semester GPA, cumulative CGPA, and convert CGPA to percentage. UTM, UiTM, SRM, NSU, VIT, NUST & 60+ university grading scales.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "education",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "CGPA Calculator — Free GPA & Percentage Converter",
    description:
      "Instant, accurate CGPA calculation for 60+ university grading systems. Free and private.",
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 180,
        height: 48,
        alt: `${SITE_NAME} — CGPA Calculator`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Calculator — Free GPA & Percentage Converter",
    description: SITE_TAGLINE,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={GLOBAL_JSON_LD} />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
