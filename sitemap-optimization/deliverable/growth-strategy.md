# Mosh JD — SEO Improvement Strategy (post-audit)

**Prepared for:** Wellington Coelho / Mosh JD · **Date:** July 23, 2026
**Baseline (clean audit):** Site Health **84%** · 201 pages · 22 errors · 330 warnings · AI Search Health 86%

> Key insight from the full Semrush report: **almost every issue is template-level, not per-page.** The site is WordPress + Elementor + All in One SEO. A handful of fixes in the post template, the `/freedownloads/` template, the schema block, and the footer cascade across 20–190 pages each. That makes this cheap to execute and high-leverage.

---

## Tier 1 — Technical quick wins (template-level, ~1 week)
Projected: Site Health **84% → ~92%+**, errors 22 → ~2, warnings 330 → ~120.

| Fix | Root cause (from report) | Pages fixed | Where |
|---|---|---|---|
| **Structured-data errors** | `SoftwareApplication` schema emits `aggregateRating`, `review`, `offers` with no valid values on product/feature pages (+ 1 FAQ `name`, Pricing 2 fields) | **20** | AIOSEO Schema / theme schema block — one template |
| **Poor heading hierarchy** | Blog post template skips heading levels (starts H2, jumps levels) | **~80** (the bulk of "89 content not optimized") | Post template (Elementor) |
| **Duplicate H1 = title** | Post template sets `<h1>` identical to SEO title | **62** | Post template + AIOSEO title formula |
| **Missing H1** | `/freedownloads/` lead-magnet template (13) + legal pages + low-value pages have no `<h1>` | **21** | `/freedownloads/` template + page-level |
| **Titles too long (>70)** | Blog titles + `" - Mosh JD®"` suffix pushing over limit | **23** | AIOSEO title formula / per-post |
| **HTTP links on HTTPS site** | `http://www.moshjd.com` hard-coded in post template/footer | **9** | Template link |
| **Broken external links** | dead outbound links in older posts | **7** | Per-post |
| **Multiple H1** | jdxpert comparison post has 2 H1s | 1 | Per-post |

## Tier 2 — Index & sitemap hygiene
- Drop `sitemap.rss` from `robots.txt` and fix the one non-canonical URL the sitemap exposes (the `mosh-jd-vs-payscale-jdm-bundle` post) → clears the "2 incorrect pages in sitemap.xml" error.
- `noindex` + remove from sitemap the low-value/duplicate pages: `old-faqs-content`, `job-description-management-new`, `phone-popup` (38 words), `thank-you`, `roi-calculator-2`, `job-description-accuracy-audit` (186 words / thin).
- `app.moshjd.com` → `noindex` (dev-agency change; also `old-faqs-content` links to `app.moshjd.com/user/signup`).

## Tier 3 — On-page SEO & growth (the revenue lever)
The clean site is content-rich (131 posts) — this is where rankings/traffic grow:
- **Internal linking:** 34 pages have only 1 incoming internal link (mostly `/freedownloads/` + newer posts). Build a hub-and-spoke internal-linking pass so authority reaches money pages and new posts.
- **Descriptive anchors:** 30 non-descriptive (`Learn More →`, `Read More →`, `click here`, `here`) + 24 empty anchors. The homepage and `/freedownloads/` use generic "Learn More/Read More" — replace with keyword-rich anchors (template fix + editorial pass).
- **Content optimization:** ~89 pages flagged for readability / heading structure / long paragraphs. Prioritize the commercial/comparison posts (Mosh JD vs. JDxpert / SHRM / Payscale, pricing, ROI) — these convert.
- **Topical authority:** cluster the 131 posts around core themes (job description management, governance, compliance, AI for JDs, pay transparency) with interlinking → compounding rankings in the "job description" niche.

## Tier 4 — Ongoing
- Monthly Semrush audit (scope locked to `www.moshjd.com`), position tracking on target keywords, content calendar, quarterly technical re-check.

---

## The pitch to the client
The sitemap task is done and the "2,490 scare" is fully explained. This audit — now clean — is a ready-made, prioritized roadmap. Because the problems are **template-level**, Tier 1 is a fast, high-visibility win (Health 84% → 92%+) that proves the team's expertise, and Tiers 3–4 are the ongoing retainer that actually grows organic traffic.
