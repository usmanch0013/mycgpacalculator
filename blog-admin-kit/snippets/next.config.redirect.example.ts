// Optional: redirect old /blog/slug URLs to root-level articles
// Merge into your next.config.ts redirects():

{
  source: "/blog/:slug",
  destination: "/:slug",
  permanent: true,
}
