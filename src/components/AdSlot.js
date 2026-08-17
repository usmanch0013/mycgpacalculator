/**
 * AdSense-ready ad placement slot.
 * Replace the inner placeholder with your AdSense ad unit code after approval.
 */
export default function AdSlot({
  id,
  label = "Advertisement",
  size = "leaderboard",
  className = "",
}) {
  const sizeClass = {
    leaderboard: "ad-slot--leaderboard",
    rectangle: "ad-slot--rectangle",
    banner: "ad-slot--banner",
    sidebar: "ad-slot--sidebar",
  }[size];

  return (
    <aside
      id={id}
      className={`ad-slot ${sizeClass} ${className}`.trim()}
      aria-label={label}
      data-ad-slot={id}
    >
      <div className="ad-slot-inner">
        <span className="ad-slot-label">{label}</span>
        {/* Paste AdSense code here, e.g.:
        <ins className="adsbygoogle" ...></ins>
        */}
      </div>
    </aside>
  );
}
