export function GET() {
	return new Response(
		`User-agent: *
        Allow: /
        Sitemap: https://ton-site.com/sitemap.xml`,
		{ headers: { 'Content-Type': 'text/plain' } }
	);
}
