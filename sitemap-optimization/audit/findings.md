# Sitemap Audit — Findings (Step 1)

_Audit date: 2026-07-23. Method: direct HTTP fetch/probe of the live site (no GSC/Semrush account access at time of audit)._

## TL;DR

**The sitemap is not the problem, and there are no "ghost pages" from a backend bug.** The Mosh JD sitemap is clean, valid, and lists ~193 real URLs. The Semrush export (ground truth) shows the 2,490 is a **crawl-scope artifact: ~90% (2,402 of 2,671) is the `newsletter.moshjd.com` beehiiv subdomain**, which the Site Audit crawled because it is scoped to the whole domain. Only ~204 URLs are real unique pages; Semrush's own data marks 2,412 as "canonical to another page" (duplicates Google collapses). Google correctly indexes the real pages; Semrush counts the newsletter subdomain + duplicate/tracking URLs. See `../semrush/semrush-analysis.md` for the full breakdown. (An earlier www-only crawl found minor WP/Elementor crawl noise — real but secondary to the beehiiv subdomain.)

---

## 1. Sitemap structure

- **URL:** `https://www.moshjd.com/sitemap.xml` — exists, valid XML, HTTP 200.
- **Generator:** All in One SEO Pro **v4.9.10** (dynamic, WordPress). This is a *sitemap index*, not a flat file.
- Sub-sitemaps:
  | Sitemap | URLs | Content |
  |---|---|---|
  | `post-sitemap.xml` | 131 | Blog posts (`/post/...`) |
  | `page-sitemap.xml` | 59 | Pages + landing/resource pages |
  | `testimonial-sitemap.xml` | 3 | Testimonial CPT |
  | **Total** | **193** | all unique |
- `robots.txt` also references `sitemap.rss` (an RSS-format feed sitemap AIOSEO emits — harmless).

## 2. Sitemap hygiene — all PASS

- **193 URLs, 193 unique** → no duplicates.
- **100% `https://www.`** → consistent canonical host, no http/non-www mixing.
- **No** query-parameter URLs, `/feed`, `/tag/`, `/category/`, `/author/`, attachment, or pagination URLs in the sitemap.
- **`app.moshjd.com` is NOT in the sitemap.** ✅ (One of the task's flags — cleared.)
- Candidate low-value pages worth reviewing (not errors, just cleanup): `old-faqs-content`, `job-description-management-new`, `phone-popup`, `roi-calculator-2`, `thank-you`.

## 3. WordPress frontend behaves correctly

| Probe | Result | Meaning |
|---|---|---|
| `/tag/…`, `/category/…`, `/author/…`, `/2026/06/` | **404** | Archive ghost-page sources are disabled ✅ |
| `/?s=job` (search) | 200 but **noindex** | Correctly excluded from index ✅ |
| `/feed/` | **X-Robots-Tag: noindex** | Correctly excluded ✅ |
| `/freedownloads/page/2/` | 200 but **noindex, nofollow** | Pagination correctly excluded ✅ |
| `/about-us/nonsense/` (junk segments) | **404** with no canonical | No recursion/soft-404 bug on WP ✅ |
| `/totally-made-up-page/` | **404** | Proper hard 404s ✅ |

→ The WP marketing site does **not** generate crawlable ghost pages. Google indexing ~100 pages is the expected, correct behavior.

## 4. CONFIRMED source of the 2,490: WordPress + Elementor crawl surface (not a bug)

Independent crawl reproduction (Node BFS, see `crawl-breakdown.txt` + `crawl.mjs`/`crawl2.mjs`). The crawler discovered **1,023 URLs and was still climbing** when bounded — a full crawl reaches Semrush's ~2,490 easily. Breakdown of discovered URLs:

| Count | Category | Google indexes it? |
|---|---|---|
| **199** | Real pages/posts (≈ the 193 sitemap URLs) | ✅ Yes |
| 505 | `wp-json` REST API + oEmbed endpoints (2 oembed variants per page) | ❌ API, not a page |
| 165 | `?p=<id>` WordPress shortlinks | ❌ 301-redirect → canonical, consolidated |
| 140 | Per-post `/feed/` RSS URLs | ❌ `X-Robots-Tag: noindex` |
| 13 | `?e-page-…=N` Elementor widget pagination (on `/resources/`) | ❌ parameter duplicate |
| — | **824 total noise vs 199 real (~4:1, growing)** | ❌ |

**This is standard WordPress/Elementor behavior, not a backend bug and not "ghost pages."** Every one of the 131 posts spawns its own feed + oEmbed + shortlink, so the crawlable-URL count balloons while the *indexable* page count stays ~100. Google discards all of it (301 consolidation, noindex, API/parameter handling); Semrush's Site Audit counts every crawlable URL it touches. **The 2,490-vs-100 gap is a crawler-scope difference, not an indexability problem.**

### Note on `app.moshjd.com`
- Separate server (**Apache**; www is on **WP Engine**) — the product web app, not WordPress.
- `robots.txt` = `Disallow:` (nothing blocked) and returns **HTTP 200 for every path** (SPA soft-404), BUT the shell has **0 crawlable `<a href>` links** — so a non-JS crawler like Semrush's default cannot discover deep routes there. It is **not** the main source of the 2,490, but it is still poor SEO hygiene and should be `noindex`.

## 5. Answer to the client's core question

- **Is there a real indexability issue on the marketing site?** → No evidence of one. The sitemap is clean and the site returns correct 404/noindex signals.
- **Is Semrush misreading ghost pages?** → Yes, most likely. Semrush's 2,490 is its crawler counting URLs Google intentionally ignores (soft-404s / noindex / open app subdomain), **not** pages Google is indexing.
- The 2,490 vs ~100 gap is a **crawler-scope artifact, not a Google index problem.**

---

## Still to verify (needs account access)

- **Google Search Console** (Full Permission): confirm Pages/Coverage report shows ~100–193 indexed real pages and check the "excluded" reasons — this closes the loop on the client's question. Then Sitemaps → confirm/resubmit → screenshot.
- **Semrush project config**: confirm whether the Site Audit/crawl includes subdomains (would capture `app.moshjd.com`) and query strings — this pins the exact 2,490 source.

## Recommended actions

1. **`app.moshjd.com`** — add `X-Robots-Tag: noindex` (or a restrictive `robots.txt`: `Disallow: /`) so crawlers stop treating it as an indexable site. **Dev-agency change** → flag to Wellington.
2. **Sitemap** — already well-optimized by AIOSEO; only cleanup needed is optionally excluding the 5 low-value pages above. Note: AIOSEO omits `<priority>`/`<changefreq>` by design (Google ignores them), so the task's request to "set priority/changefreq" is not applicable to this generator — worth explaining to the client.
3. **GSC** — confirm indexed count vs sitemap, resubmit, screenshot for the deliverable.
