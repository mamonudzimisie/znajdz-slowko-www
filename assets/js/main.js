/* ==========================================================================
   Znajdź słówko! — interakcje strony
   Dane książek: assets/js/books.js
   ========================================================================== */
(() => {
  'use strict';

  document.documentElement.classList.remove('no-js');

  const BOOKS = window.ZS_BOOKS || [];
  const UPCOMING = window.ZS_UPCOMING || [];
  const LEVELS = BOOKS.filter((b) => b.step > 0).sort((a, b) => a.step - b.step);
  const SPECIAL = BOOKS.filter((b) => b.step === 0);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const contrastInk = (b) => (b.ink === '#ffffff' ? '#fff' : '#1b2450');

  /* ---------- Nagłówek i menu ---------- */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('.nav-toggle');
  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#nav-links a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Podświetlenie aktywnej sekcji w menu
  const navMap = new Map($$('#nav-links a:not(.btn)').map((a) => [a.getAttribute('href').slice(1), a]));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navMap.forEach((a) => a.classList.remove('active'));
      navMap.get(en.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) sectionObserver.observe(s); });

  /* ---------- Hero: nieruchome pole liter w tle ---------- */
  const ALPHABET = 'AAAĄBCĆDEEEĘFGHIIIJKLŁMNŃOOOÓPRRSŚTTUWYZZŹŻ';
  const randLetter = () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  const field = $('[data-letter-field]');
  let fieldCols = 0;
  let fieldRows = 0;
  const buildField = () => {
    const w = field.clientWidth;
    const h = field.clientHeight;
    const cols = w < 600 ? 12 : w < 1000 ? 18 : 24;
    const rows = Math.ceil(h / (w / cols)) + 1;
    if (cols === fieldCols && rows === fieldRows) return;
    fieldCols = cols;
    fieldRows = rows;
    field.style.setProperty('--cols', cols);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < cols * rows; i++) {
      const s = document.createElement('span');
      s.textContent = randLetter();
      frag.appendChild(s);
    }
    field.replaceChildren(frag);
  };
  buildField();
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildField, 200); });

  /* ---------- Hero: okładka leżąca na stronie z zagadką ---------- */
  const heroBook = LEVELS[Math.floor(LEVELS.length / 2)];
  $('[data-hero-desk]').innerHTML = `
    <div class="desk-page"><img src="${heroBook.samples}3.webp" alt="" width="850" height="1100" loading="eager"></div>
    <a class="desk-cover" href="#ed-${heroBook.id}" aria-label="${esc(heroBook.title)} — ${esc(heroBook.level)}, ${esc(heroBook.age)}">
      <img src="${heroBook.cover}" alt="" width="850" height="1100" fetchpriority="high">
    </a>`;

  /* ---------- Seria: schody poziomów ---------- */
  $('[data-stairs]').innerHTML = LEVELS.map((b, i) => `
    <a class="stair reveal" href="#ed-${b.id}" style="--c:${b.color};--ci:${contrastInk(b)};--lift:${i * 18}px;--rd:${i * 0.08}s">
      <div class="stair-cover"><img src="${b.cover}" alt="Okładka: ${esc(b.title)} — ${esc(b.level)}" width="850" height="1100" loading="lazy"></div>
      <div class="stair-meta">
        <span class="stair-step"><b>${b.step}</b> stopień</span>
        <span class="stair-name">${esc(b.level.replace('Poziom ', ''))}</span>
        <span class="stair-age">${esc(b.age)}</span>
        <span class="stair-bar" aria-hidden="true"><i style="--w:${b.step * 20}%"></i></span>
      </div>
    </a>`).join('');

  const special = SPECIAL[0];
  const specialEl = $('[data-special]');
  if (special) {
    specialEl.innerHTML = `
      <img src="${special.cover}" alt="Okładka: ${esc(special.title)}" width="850" height="1100" loading="lazy">
      <div>
        <span class="tag">${esc(special.level)} · ${esc(special.age)}</span>
        <h3>${esc(special.title)}</h3>
        <p>${esc(special.description)}</p>
      </div>
      <a class="btn btn-primary btn-amazon" href="${special.amazon}" target="_blank" rel="noopener">Kup na Amazon</a>`;
  } else {
    specialEl.remove();
  }

  /* ---------- Wnętrze: przeglądarka rozkładówek ---------- */
  const SPREADS = [
    { pages: [3, 4], label: 'Plansze z zagadkami' },
    { pages: [5, 6], label: 'Plansze z zagadkami' },
    { pages: [7, 8], label: 'Rozwiązania na końcu książki' },
  ];
  const mqMobile = window.matchMedia('(max-width: 680px)');
  const viewer = {
    book: LEVELS[1] || BOOKS[0],
    index: 0,
    units() {
      if (!mqMobile.matches) return SPREADS;
      return SPREADS.flatMap((s) => s.pages.map((p) => ({ pages: [p], label: s.label })));
    },
  };
  const tabsEl = $('[data-viewer-tabs]');
  const spreadEl = $('[data-spread]');
  const imgL = $('[data-page-left]');
  const imgR = $('[data-page-right]');
  const dotsEl = $('[data-viewer-dots]');
  const prevBtn = $('[data-viewer-prev]');
  const nextBtn = $('[data-viewer-next]');
  const buyBtn = $('[data-viewer-buy]');
  const captionEl = $('[data-viewer-caption]');

  tabsEl.innerHTML = [...LEVELS, ...SPECIAL].map((b) => `
    <button class="viewer-tab" role="tab" data-book="${b.id}" style="--c:${b.color}" aria-selected="false">
      <i></i>${esc(b.step ? b.age : 'Święta')}
    </button>`).join('');

  const pageSrc = (b, n) => `${b.samples}${n}.webp`;
  const renderViewer = (animate = true) => {
    const units = viewer.units();
    viewer.index = Math.max(0, Math.min(viewer.index, units.length - 1));
    const u = units[viewer.index];
    const b = viewer.book;
    const apply = () => {
      imgL.src = pageSrc(b, u.pages[0]);
      imgL.alt = `${b.title} (${b.age}) — strona przykładowa ${u.pages[0]}`;
      if (u.pages[1]) {
        imgR.src = pageSrc(b, u.pages[1]);
        imgR.alt = `${b.title} (${b.age}) — strona przykładowa ${u.pages[1]}`;
      }
      spreadEl.classList.remove('switching');
    };
    if (animate && !reduceMotion) {
      spreadEl.classList.add('switching');
      setTimeout(apply, 220);
    } else {
      apply();
    }
    captionEl.innerHTML = `<strong>${esc(b.step ? b.level : b.title)} · ${esc(b.age)}</strong> — ${esc(u.label)}`;
    dotsEl.innerHTML = units.map((_, i) =>
      `<button aria-label="Rozkładówka ${i + 1}" ${i === viewer.index ? 'aria-current="true"' : ''} data-i="${i}"></button>`).join('');
    prevBtn.disabled = viewer.index === 0;
    nextBtn.disabled = viewer.index === units.length - 1;
    buyBtn.href = b.amazon;
    buyBtn.classList.add('btn-amazon');
    $$('.viewer-tab', tabsEl).forEach((t) => t.setAttribute('aria-selected', String(t.dataset.book === b.id)));

    // wstępne ładowanie kolejnej rozkładówki
    const next = units[viewer.index + 1];
    next?.pages.forEach((p) => { const i = new Image(); i.src = pageSrc(b, p); });
  };
  const selectBook = (id) => {
    const b = BOOKS.find((x) => x.id === id);
    if (!b) return;
    viewer.book = b;
    viewer.index = 0;
    renderViewer();
  };
  tabsEl.addEventListener('click', (e) => {
    const t = e.target.closest('.viewer-tab');
    if (!t) return;
    selectBook(t.dataset.book);
    t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  });
  dotsEl.addEventListener('click', (e) => {
    const d = e.target.closest('button');
    if (d) { viewer.index = +d.dataset.i; renderViewer(); }
  });
  const step = (d) => {
    const n = viewer.index + d;
    if (n < 0 || n >= viewer.units().length) return;
    viewer.index = n;
    renderViewer();
  };
  prevBtn.addEventListener('click', () => step(-1));
  nextBtn.addEventListener('click', () => step(1));
  mqMobile.addEventListener('change', () => { viewer.index = 0; renderViewer(false); });

  // przesuwanie palcem
  let swipeX = null;
  spreadEl.addEventListener('pointerdown', (e) => { swipeX = e.clientX; });
  spreadEl.addEventListener('pointerup', (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 40) { step(dx < 0 ? 1 : -1); return; }
    const img = e.target.closest('.page')?.querySelector('img');
    if (img?.src) openLightbox(img.src, img.alt);
  });

  renderViewer(false);

  /* ---------- Lightbox ---------- */
  const lb = $('[data-lightbox]');
  const lbImg = $('[data-lightbox-img]');
  let lastFocus = null;
  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-lightbox-close]').focus();
  }
  const closeLightbox = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) {
      if (e.target.closest?.('[data-viewer]') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) step(e.key === 'ArrowRight' ? 1 : -1);
      return;
    }
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Spróbuj sam: mini wykreślanka ---------- */
  const TRY_WORDS = ['KSIĄŻKA', 'ZAGADKA', 'OŁÓWEK', 'LITERA', 'SŁOWO', 'LUPA'];
  const TRY_COLORS = ['#f5c842', '#4fd6b0', '#ee5b3b', '#7c5cff', '#7cc383', '#ff8a3d'];
  const N = 10;
  const DIRS = [[0, 1], [1, 0], [1, 1]];
  const board = $('[data-try-board]');
  const wordsEl = $('[data-try-words]');
  const doneEl = $('[data-try-done]');
  let grid, placed, found, cells, strokes, anchor, sel;

  const buildPuzzle = () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      grid = Array.from({ length: N }, () => Array(N).fill(''));
      placed = [];
      let ok = true;
      for (const w of [...TRY_WORDS].sort((a, b) => b.length - a.length)) {
        let done = false;
        for (let t = 0; t < 300 && !done; t++) {
          const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
          const r0 = Math.floor(Math.random() * (N - (dr ? w.length - 1 : 0)));
          const c0 = Math.floor(Math.random() * (N - (dc ? w.length - 1 : 0)));
          const fits = [...w].every((ch, i) => { const g = grid[r0 + dr * i][c0 + dc * i]; return !g || g === ch; });
          if (!fits) continue;
          [...w].forEach((ch, i) => { grid[r0 + dr * i][c0 + dc * i] = ch; });
          placed.push({ w, r0, c0, dr, dc });
          done = true;
        }
        if (!done) { ok = false; break; }
      }
      if (ok) break;
    }
    grid = grid.map((row) => row.map((ch) => ch || randLetter()));
  };

  const renderTry = () => {
    buildPuzzle();
    found = new Set();
    anchor = null;
    sel = [];
    board.style.setProperty('--n', N);
    board.innerHTML = '';
    strokes = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    strokes.setAttribute('class', 'strokes');
    strokes.setAttribute('viewBox', `0 0 ${N} ${N}`);
    strokes.setAttribute('preserveAspectRatio', 'none');
    board.appendChild(strokes);
    cells = [];
    grid.forEach((row, r) => row.forEach((ch, c) => {
      const d = document.createElement('div');
      d.className = 'cell';
      d.setAttribute('role', 'gridcell');
      d.textContent = ch;
      d.dataset.r = r;
      d.dataset.c = c;
      board.appendChild(d);
      cells.push(d);
    }));
    wordsEl.innerHTML = TRY_WORDS.map((w, i) => `<li data-w="${w}" style="--c:${TRY_COLORS[i]}">${w}</li>`).join('');
    doneEl.hidden = true;
  };

  const cellAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    return el?.classList.contains('cell') && board.contains(el) ? el : null;
  };
  const linePath = (a, b) => {
    const r0 = +a.dataset.r, c0 = +a.dataset.c;
    let dr = +b.dataset.r - r0, dc = +b.dataset.c - c0;
    // przyciąganie do najbliższego kierunku (poziomo, pionowo, po skosie)
    if (dr && dc && Math.abs(dr) !== Math.abs(dc)) {
      if (Math.abs(dr) > 2 * Math.abs(dc)) dc = 0;
      else if (Math.abs(dc) > 2 * Math.abs(dr)) dr = 0;
      else { const m = Math.max(Math.abs(dr), Math.abs(dc)); dr = Math.sign(dr) * m; dc = Math.sign(dc) * m; }
    }
    const len = Math.max(Math.abs(dr), Math.abs(dc));
    const sr = Math.sign(dr), sc = Math.sign(dc);
    const out = [];
    for (let i = 0; i <= len; i++) {
      const r = r0 + sr * i, c = c0 + sc * i;
      if (r < 0 || r >= N || c < 0 || c >= N) break;
      out.push(cells[r * N + c]);
    }
    return out;
  };
  const paintSel = (list) => {
    sel.forEach((c) => c.classList.remove('sel'));
    sel = list;
    sel.forEach((c) => c.classList.add('sel'));
  };
  const commit = (list) => {
    paintSel([]);
    if (list.length < 2) return false;
    const s = list.map((c) => c.textContent).join('');
    const rev = [...s].reverse().join('');
    const hit = TRY_WORDS.find((w) => !found.has(w) && (w === s || w === rev));
    if (!hit) {
      board.classList.remove('shake');
      void board.offsetWidth;
      board.classList.add('shake');
      return false;
    }
    found.add(hit);
    const color = TRY_COLORS[TRY_WORDS.indexOf(hit)];
    const a = list[0], b = list[list.length - 1];
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', +a.dataset.c + 0.5);
    ln.setAttribute('y1', +a.dataset.r + 0.5);
    ln.setAttribute('x2', +b.dataset.c + 0.5);
    ln.setAttribute('y2', +b.dataset.r + 0.5);
    ln.setAttribute('stroke', color);
    ln.setAttribute('stroke-width', '0.74');
    strokes.appendChild(ln);
    list.forEach((c) => c.classList.add('hit'));
    $(`[data-w="${hit}"]`, wordsEl).classList.add('found');
    if (found.size === TRY_WORDS.length) doneEl.hidden = false;
    return true;
  };

  let dragStart = null;
  board.addEventListener('pointerdown', (e) => {
    const c = cellAt(e.clientX, e.clientY);
    if (!c) return;
    e.preventDefault();
    if (anchor && anchor !== c) {
      // tryb „stuknij początek, stuknij koniec”
      const list = linePath(anchor, c);
      anchor = null;
      commit(list);
      return;
    }
    dragStart = c;
    paintSel([c]);
  });
  board.addEventListener('pointermove', (e) => {
    if (!dragStart) return;
    const c = cellAt(e.clientX, e.clientY);
    if (c) paintSel(linePath(dragStart, c));
  });
  const endDrag = (e) => {
    if (!dragStart) return;
    const c = cellAt(e.clientX, e.clientY) || sel[sel.length - 1] || dragStart;
    const list = linePath(dragStart, c);
    if (list.length === 1) {
      anchor = dragStart; // pojedyncze stuknięcie — czekamy na drugie
      paintSel([dragStart]);
    } else {
      anchor = null;
      commit(list);
    }
    dragStart = null;
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', () => { dragStart = null; paintSel([]); });
  $('[data-try-reset]').addEventListener('click', renderTry);
  renderTry();

  /* ---------- Wydania ---------- */
  const editionsEl = $('[data-editions]');
  editionsEl.innerHTML = [...LEVELS, ...SPECIAL].map((b, i) => `
    <article class="edition reveal" id="ed-${b.id}" data-id="${b.id}" style="--c:${b.color};--rd:${(i % 3) * 0.08}s">
      <div class="edition-top">
        <span class="edition-age">${esc(b.age)}</span>
        <div class="edition-cover"><img src="${b.cover}" alt="Okładka: ${esc(b.title)} — ${esc(b.level)}, ${esc(b.age)}" width="850" height="1100" loading="lazy"></div>
      </div>
      <div class="edition-body">
        <span class="edition-level">${esc(b.level)}</span>
        <h3>${esc(b.title)}</h3>
        <p class="edition-tagline">${esc(b.tagline)}</p>
        <p class="edition-desc">${esc(b.description)}</p>
        <ul class="edition-features">${b.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <dl class="edition-meta">
          <div><dt>Zagadek</dt><dd>${b.puzzles}</dd></div>
          <div><dt>Stron</dt><dd>${b.pages}</dd></div>
          <div><dt>Format</dt><dd>21,6×28</dd></div>
        </dl>
        <div class="edition-actions">
          <a class="btn btn-primary btn-amazon" href="${b.amazon}" target="_blank" rel="noopener"
             aria-label="Kup na Amazon: ${esc(b.title)} — ${esc(b.level)}, ${esc(b.age)}">Kup na Amazon</a>
          <button class="btn btn-ghost" data-preview="${b.id}" aria-label="Zajrzyj do środka: ${esc(b.age)}">Podgląd</button>
        </div>
      </div>
    </article>`).join('');

  editionsEl.addEventListener('click', (e) => {
    const p = e.target.closest('[data-preview]');
    if (!p) return;
    selectBook(p.dataset.preview);
    $('#wnetrze').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- Przyszłe tomy ---------- */
  $('[data-upcoming]').innerHTML = UPCOMING.map((u, i) => `
    <article class="soon reveal" style="--c:${u.color};--rd:${i * 0.08}s">
      <div class="soon-cover">
        ${u.cover
          ? `<img src="${u.cover}" alt="Okładka: ${esc(u.title)}" loading="lazy">`
          : `<span class="soon-letters">${esc(u.letters || '?')}</span><small>Okładka wkrótce</small>`}
      </div>
      <div>
        <span class="soon-status">${esc(u.status)}</span>
        <h3>${esc(u.title)}</h3>
        <p class="soon-age">${esc(u.age)}</p>
        <p>${esc(u.description)}</p>
      </div>
    </article>`).join('');

  /* ---------- Animacje przy przewijaniu ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        revealObserver.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.benefit').forEach((el, i) => el.style.setProperty('--rd', `${(i % 3) * 0.08}s`));
  $$('.hero .reveal').forEach((el, i) => el.style.setProperty('--rd', `${i * 0.1}s`));
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
