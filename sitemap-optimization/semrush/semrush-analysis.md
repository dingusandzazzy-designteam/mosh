# Semrush export analysis — GROUND TRUTH for the 2,490

_Source: `www.moshjd.com_pages_20260723.xlsx` (Semrush Site Audit → Crawled Pages, 2,671 rows) + `Semrush-Site_Audit__Overview...pdf`. Parsed 2026-07-23._

## The answer, in one line

**~90% of Semrush's crawled URLs are the `newsletter.moshjd.com` (beehiiv) subdomain, not the website.** The Site Audit is scoped to crawl the whole domain including subdomains; the beehiiv newsletter generates a URL per post + archive pagination + tracking params. The website itself has ~204 real pages. This is a **crawl-scope artifact, not a backend bug and not an indexability issue.**

## Numbers

**Total crawled URLs: 2,671**

By hostname:
| Hostname | URLs | Share | What it is |
|---|---|---|---|
| `newsletter.moshjd.com` | **2,402** | **90%** | beehiiv newsletter (separate platform, own sitemap, fully crawlable) |
| `www.moshjd.com` | 252 | 9% | the actual WordPress site |
| `moshjd.com` (non-www) | 14 | <1% | non-www variants (301 → www) |
| `app.moshjd.com` | 3 | <1% | product SPA (no crawlable links) |

HTTP status: 2,633 × `200`, 36 × `301`, 2 × error.

Canonicalization (Semrush's own signal — proves Google collapses the bloat):
| Value | URLs | Meaning |
|---|---|---|
| Self-canonical | **204** | unique real pages (≈ the 193 sitemap URLs) |
| Canonical to other page | **2,412** | duplicates that declare canonical to the real page → Google consolidates, won't index |
| `-` | 55 | redirects / non-HTML |

"In sitemap" = 1: **165** URLs.

## Why this happens

1. **Semrush Site Audit scope includes subdomains.** So it crawled `newsletter.moshjd.com` (beehiiv) — 2,402 URLs — as if they were site pages. beehiiv robots.txt allows crawlers and exposes its own sitemap, so Semrush swept the whole newsletter archive plus per-post/tracking variants.
2. **Google does NOT roll these into the moshjd.com index the same way** — beehiiv is a separate property, and 2,412 of the crawled URLs are canonical-to-other duplicates. Hence GSC shows ~100 real pages.
3. The gap (2,671 Semrush vs ~100 Google) = **different scope**, not a site defect.

## What actually fixes the client's confusion

1. **Reconfigure the Semrush Site Audit to crawl only `www.moshjd.com`** (exclude subdomains, or set the crawl source to the sitemap). The reported page count then drops to ~250, matching reality. This is the single change that resolves the "2,490 vs 100" discrepancy the client flagged.
2. **Sitemap: no change required** — it is already clean and correct (193 real URLs, valid XML, AIOSEO-managed).
3. **Minor hygiene:** `app.moshjd.com` should be `noindex` (SPA returns 200 for any path). Dev-agency change → flag to Wellington.
4. **GSC:** confirm indexed count (~100–193) in the Pages report, resubmit the sitemap, screenshot — needs Full Permission access.

## Site Audit Overview PDF corroborates this

From `Semrush-Site_Audit__Overview...pdf` (2,670 pages crawled):
- Site Health **76%**, AI Search Health **86%**, **0 pages blocked** from any AI/search bot.
- Distribution: 5 healthy · 2,620 have issues · 36 redirects · 9 blocked · 2 broken.
- Warnings spiked **+5,120 to 7,730**, driven by three warnings that each jumped **by exactly +1,710**:
  - 2,378 pages missing meta descriptions (+1,710)
  - 2,383 pages missing an H1 (+1,710)
  - 2,609 pages with low text-HTML ratio (+1,710)
- **The identical +1,710 on all three = one batch of ~1,710 same-type pages entering the crawl at once — the beehiiv newsletter posts.** beehiiv pages don't carry the meta description / H1 / text ratio Semrush expects, so they mass-triggered warnings. These "issues" are on the newsletter subdomain, **not on the website.**
- Genuine website-level items are small and normal: 9 duplicate title tags, 66 invalid structured-data items — worth a separate cleanup pass but unrelated to the page-count question.

**Takeaway for the client:** the alarming "7.73K warnings / 2,378 pages missing X" figures are ~90% the beehiiv newsletter, not moshjd.com. Restrict the audit scope to `www.moshjd.com` and the health picture reflects the real ~250-page site.

## RESULT after reconfiguring the audit (re-run 2026-07-23)

Changed: Scope = `www.moshjd.com` with **"Crawl all subdomains" OFF**; Pages to crawl = **Robots.txt sitemap**. Re-ran. Sources: `Semrush-Site_Audit__Overview...(1).pdf` + `www.moshjd.com_mega_export_20260723.xlsx` (201 rows).

| Metric | Before | After |
|---|---|---|
| Pages crawled | 2,670 | **201** (200 www + 1 non-www; 0 beehiiv, 0 app, 0 params) |
| Warnings | 7,730 | **330** (−7,400) |
| Errors | 115 | **22** (−93) |
| Site Health | 76% | **84%** (+8%) |
| AI Search Health | 86% | 86% (unchanged) |

The report now measures the real website. Remaining issues are genuine and small: 20 invalid structured-data items, 191 low text-HTML ratio, 62 duplicate H1/title, 23 titles too long, 21 missing H1. This **confirms the diagnosis** — the 2,490 was crawl scope (beehiiv subdomain), not a site defect.

## Corrects the earlier crawl-only guess

My independent www crawl (see `../audit/crawl-breakdown.txt`) found www-side crawl noise (wp-json, `?p=` shortlinks, feeds). That noise is real but **minor** — Semrush's actual 2,490 is dominated by the beehiiv subdomain, which my www-only crawl did not traverse. The Semrush export is ground truth and supersedes that estimate. Both agree on the conclusion: **the website is healthy; the number is inflated by crawl scope.**
