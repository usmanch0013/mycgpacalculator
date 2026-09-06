"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const ADSENSE_CLIENTS = [
  "ca-pub-9075508302481936",
  "ca-pub-7927497286558052",
];

export default function AdSenseScript() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return ADSENSE_CLIENTS.map((client) => (
    <Script
      key={client}
      id={`adsense-script-${client}`}
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  ));
}
