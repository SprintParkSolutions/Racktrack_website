import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();

// A) Desktop must be pixel-identical to committed HEAD across the whole page
const offsets = [0, 1500, 4000, 7000, 10000, 13000, 16000];
const shots = {};
for (const [tag, port] of [['head',8098],['work',8099]]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('[class*=cookie]')?.remove());
  await p.waitForTimeout(2500);
  shots[tag] = [];
  for (const y of offsets) { await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(900); shots[tag].push(await p.screenshot()); }
  console.log(`desktop ${tag}: height=${await p.evaluate(()=>document.documentElement.scrollHeight)} errors=${errs.join(';')||'none'}`);
  await p.close();
}
let same = true;
offsets.forEach((y,i) => { const s = shots.head[i].equals(shots.work[i]); if(!s) same=false; });
console.log('>>> DESKTOP PIXEL-IDENTICAL TO HEAD:', same);

// B) Mobile + tablet must be fully static
for (const [name,w,h] of [['mobile',390,844],['tablet',820,1180]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; const frames = [];
  p.on('pageerror', e => errs.push(e.message));
  p.on('request', r => { if (/frames-webp|hero-animation/.test(r.url())) frames.push(r.url()); });
  await p.goto('http://localhost:8099/index.html', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('[class*=cookie]')?.remove());
  const info = await p.evaluate(() => {
    const cs = s => { const e=document.querySelector(s); return e?getComputedStyle(e):null; };
    return {
      seqPin: cs('.sequence-pin').position,
      bridgePin: cs('.bridge-pin').position,
      worldPin: cs('.world-pin').position,
      canvas: cs('.sequence-canvas').display,
      worldVisual: cs('.world-visual').display,
      beatPoster: cs('.world-beat-poster').display,
      beats: document.querySelectorAll('.world-beat').length,
      notes: document.querySelectorAll('.world-note').length,
      visibleNotes: [...document.querySelectorAll('.world-note')].filter(n=>n.getBoundingClientRect().height>0).length,
      cards: [...document.querySelectorAll('.evidence-card')].filter(n=>getComputedStyle(n).opacity==='1').length,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  console.log(name, 'animFrames=', frames.length, 'errors=', errs.join(';')||'none', JSON.stringify(info));
  await p.screenshot({ path: `${out}/${name}-final.png` });
  await p.close();
}
await b.close();
