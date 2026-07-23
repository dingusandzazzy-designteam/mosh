// Bounded BFS crawler reproducing what a crawler (Semrush) discovers on www.moshjd.com.
const START = "https://www.moshjd.com/";
const HOST = "www.moshjd.com";
const UA = "Mozilla/5.0 (compatible; moshjd-audit/1.0)";
const MAX_FETCH = 800;
const HREF = /href=["']([^"'#]+)/gi;
const ASSET = /\.(png|jpe?g|gif|svg|webp|css|js|ico|woff2?|ttf|pdf|zip|mp4|webm)(\?|$)/i;

const norm = (u) => { try { const x = new URL(u); x.hash=""; return x.toString(); } catch { return null; } };

const seen = new Map();          // url -> status
const queued = new Set([START]);
const q = [START];
const status = {};
const paramUrls = new Set();
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
    if (code >= 300 && code < 400) { seen.set(url, code); status[code]=(status[code]||0)+1; continue; }
    if (ct.includes("html")) body = await r.text();
  } catch { code = "ERR"; }
  seen.set(url, code);
  status[code] = (status[code] || 0) + 1;
  if (url.includes("?")) paramUrls.add(url);
  let m;
  HREF.lastIndex = 0;
  while ((m = HREF.exec(body))) {
    const link = norm(new URL(m[1], url).toString());
    if (!link) continue;
    let lp; try { lp = new URL(link); } catch { continue; }
    if (lp.hostname === HOST && !queued.has(link) && !ASSET.test(link)) {
      queued.add(link); q.push(link);
    }
  }
  if (fetches % 50 === 0) process.stderr.write(`  ...${fetches} fetched, ${queued.size} discovered\n`);
}

const ghosts = [...seen.keys()].filter(u => /\/(tag|category|author|page)\/|attachment|\?/.test(u));
console.log(`\n=== CRAWL RESULT (start ${START}) ===`);
console.log(`Pages fetched:        ${fetches}`);
console.log(`Unique URLs seen:     ${seen.size}`);
console.log(`URLs discovered but not yet fetched (queue depth): ${queued.size - seen.size}`);
console.log(`Status distribution:  ${JSON.stringify(status)}`);
console.log(`URLs with query params: ${paramUrls.size}`);
[...paramUrls].sort().slice(0,30).forEach(u => console.log("   ?", u));
console.log(`\nGhost-pattern URLs discovered: ${ghosts.length}`);
ghosts.sort().slice(0,30).forEach(u => console.log("   *", seen.get(u), u));
