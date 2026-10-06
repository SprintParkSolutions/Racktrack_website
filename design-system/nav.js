/* ─────────────────────────────────────────────────────────────────────────
   Mobile sidebar.

   The drawer is built from the page's own <nav class="nav"> rather than being
   duplicated into every page's markup, so each page's link list and its
   aria-current marker carry over automatically and can never drift out of
   sync with the bar above it.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;                           // sign-in has no primary nav
  const list = nav.querySelector('ul');
  if (!list || document.querySelector('.sidebar')) return;
  const cta = nav.querySelector(':scope > .btn');

  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'sidebar');
  burger.innerHTML = '<span></span>';
  nav.appendChild(burger);

  const veil = document.createElement('div');
  veil.className = 'sb-veil';

  const side = document.createElement('aside');
  side.className = 'sidebar';
  side.id = 'sidebar';
  side.setAttribute('aria-label', 'Menu');
  side.innerHTML =
    '<div class="sidebar-head">' +
    '<button type="button" class="sb-close" aria-label="Close menu">×</button></div>' +
    '<div class="sb-links"></div>';

  /* these read as account actions, not site sections — they sit below the rule */
  const TAIL = ['/pages/sign-in/'];


  const links = side.querySelector('.sb-links');
  const tail = document.createElement('div');
  tail.className = 'sb-tail';

  list.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    const link = a.cloneNode(true);
    (TAIL.includes(href) ? tail : links).appendChild(link);
  });

  if (tail.children.length) side.appendChild(tail);
  if (cta) {
    const c = cta.cloneNode(true);
    c.classList.add('solid');
    (tail.children.length ? tail : side).appendChild(c);
  }
  document.body.append(veil, side);

  const close = side.querySelector('.sb-close');
  let open = false, lastFocus = null;

  function setOpen(v) {
    if (v === open) return;
    open = v;
    side.classList.toggle('open', v);
    veil.classList.toggle('open', v);
    burger.setAttribute('aria-expanded', String(v));
    document.body.classList.toggle('sb-lock', v);
    if (v) { lastFocus = document.activeElement; close.focus(); }
    else if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  burger.addEventListener('click', () => setOpen(!open));
  close.addEventListener('click', () => setOpen(false));
  veil.addEventListener('click', () => setOpen(false));
  links.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });

  addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    // keep focus inside the drawer while it is open
    const f = side.querySelectorAll('a[href],button:not([disabled])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // the drawer only exists below the nav's breakpoint; never leave it stranded
  addEventListener('resize', () => { if (open && innerWidth > 1024) setOpen(false); });
})();
