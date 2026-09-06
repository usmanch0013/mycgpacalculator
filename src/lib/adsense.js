/** Google AdSense publisher client IDs for cgpacalculatorpro.com */
export const ADSENSE_CLIENTS = [
  "ca-pub-7927497286558052",
  "ca-pub-9075508302481936",
];

export function adsenseScriptSrc(client) {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
}
