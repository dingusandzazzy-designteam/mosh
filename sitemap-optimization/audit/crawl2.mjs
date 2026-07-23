// Categorize the full discovered URL set to quantify the Semrush ghost-page inflation.
const START = "https://www.moshjd.com/";
const HOST = "www.moshjd.com";
const UA = "Mozilla/5.0 (compatible; moshjd-audit/1.0)";
const MAX_FETCH = 1200;
const HREF = /href=["']([^"'#]+)/gi;
const ASSET = /\.(png|jpe?g|gif|svg|webp|css|js|ico|woff2?|ttf|pdf|zip|mp4|webm)(\?|$)/i;
const norm = (u) => { try { const x = new URL(u); x.hash=""; return x.toString(); } catch { return null; } };

const seen = new Map(), queued = new Set([START]), q = [START];
let fetches = 0;
while (q.length && fetches < MAX_FETCH) {
  const url = q.shift();
  let p; try { p = new URL(url); } catch { continue; }
  if (p.hostname !== HOST) continue;
  fetches++;
  let code = "ERR", body = "";
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, redirect: "manual" });
    code = r.status;
    const ct = r.headers.get("content-type") || "";
    if (code >= 300 && code < 400) { seen.set(url, code); continue; }
    if (ct.includes("html")) body = await r.text();
  } catch { code = "ERR"; }
  seen.set(url, code);
  let m; HREF.lastIndex = 0;
  while ((m = HREF.exec(body))) {
    const link = norm(new URL(m[1], url).toString());
    if (!link) continue;
    let lp; try { lp = new URL(link); } catch { continue; }
    if (lp.hostname === HOST && !queued.has(link) && !ASSET.test(link)) { queued.add(link); q.push(link); }
  }
  if (fetches % 100 === 0) process.stderr.write(`  ...${fetches} fetched, ${queued.size} discovered\n`);
}

// Categorize ALL discovered URLs (fetched + still-queued)
const all = new Set([...seen.keys(), ...queued]);
const cat = { "real page/post": 0, "?p= shortlink (301)": 0, "wp-json REST/oembed": 0,
  "?e-page= Elementor pagination": 0, "other ?query": 0, "feed": 0, "other": 0 };
for (const u of all) {
  if (/\/wp-json\//.test(u)) cat["wp-json REST/oembed"]++;
  else if (/[?&]p=\d+/.test(u)) cat["?p= shortlink (301)"]++;
  else if (/[?&]e-page-/.test(u)) cat["?e-page= Elementor pagination"]++;
  else if (/\/feed\/?($|\?)/.test(u)) cat["feed"]++;
  else if (u.includes("?")) cat["other ?query"]++;
  else cat["real page/post"]++;
}
console.log(`\n=== DISCOVERED URL BREAKDOWN (fetched ${fetches}, total discovered ${all.size}) ===`);
for (const [k,v] of Object.entries(cat)) console.log(`  ${String(v).padStart(5)}  ${k}`);
const clean = [...all].filter(u => !u.includes("?") && !/\/wp-json\//.test(u) && !/\/feed\//.test(u));
console.log(`\n  Clean indexable-style URLs (no params/api/feed): ${clean.length}`);
console.log(`  Parameterized + API + redirect noise:           ${all.size - clean.length}`);
