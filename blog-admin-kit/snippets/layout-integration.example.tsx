// Wrap your root layout children with SiteChrome (hides site header on /admin)

import SiteChrome from "@/components/SiteChrome";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}

// In globals.css (or separate file), import admin styles:
// @import "./admin-panel.css";
