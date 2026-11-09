/* Sell HOU 2 You Team — shared behaviours (used by Version A and Version B).
   Load order: gsap, ScrollTrigger, lenis, data.js, <version>/site.js, core.js */
(function () {
  'use strict';
  var doc = document.documentElement, body = document.body;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var D = window.SH_DATA || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  doc.classList.add('js');
  if (reduced) doc.classList.add('reduced');
  if (!hasGsap) doc.classList.add('no-gsap');

  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- version renders lists first ---------- */
  if (typeof window.SH_RENDER === 'function') window.SH_RENDER(D, window.SH_FMT);

  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $$('[data-idx]').forEach(function (a) { var k = a.getAttribute('data-idx'); if (D.idx && D.idx[k]) { a.href = D.idx[k]; a.target = '_blank'; a.rel = 'noopener'; } });

  /* ---------- Split words helper ---------- */
  function splitWords(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'w';
          var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
          w.appendChild(i); frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') { splitWords(node); }
    });
  }
  if (hasGsap && !reduced) $$('[data-split]').forEach(function (el) { el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim()); splitWords(el); });

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (!reduced && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    if (hasGsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); }
  }
  var header = $('.js-header');
  function offset() { return -((header ? header.offsetHeight : 0) + 10); }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: offset() });
    else window.scrollTo({ top: el.getBoundingClientRect().top + pageYOffset + offset(), behavior: reduced ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-open')) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = document.getElementById(id.slice(1));
    if (!t) return;
    e.preventDefault(); closeMenu();
    if (id === '#top') { if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); } else scrollToEl(t);
  });

  /* ---------- Header / progress / sticky CTA ---------- */
  var progress = $('[data-progress-bar]');
  var sticky = $('[data-sticky]');
  var heroEl = $('[data-hero]');
  var contactEl = $('#contact');
  var lastY = 0, ticking = false;
  function onScroll() {
    var y = pageYOffset, max = doc.scrollHeight - innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    if (header) {
      header.classList.toggle('is-scrolled', y > 40);
      if (!body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > lastY + 2 && y > 600);
      if (y < lastY - 2) header.classList.remove('is-hidden');
    }
    if (sticky && heroEl) {
      var past = y > heroEl.offsetTop + heroEl.offsetHeight - 120;
      var nearEnd = contactEl ? contactEl.getBoundingClientRect().top < innerHeight * 0.7 : false;
      sticky.classList.toggle('is-visible', past && !nearEnd);
    }
    lastY = y; ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  var navLinks = $$('[data-nav] a[href^="#"]');
  if ('IntersectionObserver' in window && navLinks.length) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + x.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) { var s = document.getElementById(l.getAttribute('href').slice(1)); if (s) io.observe(s); });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('[data-menu-toggle]'), menu = $('[data-menu]');
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open', 'is-locked');
    if (menu) menu.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      if (body.classList.contains('menu-open')) { closeMenu(); return; }
      body.classList.add('menu-open', 'is-locked');
      if (header) header.classList.remove('is-hidden');
      menu.setAttribute('aria-hidden', 'false'); menuBtn.setAttribute('aria-expanded', 'true');
      if (lenis) lenis.stop();
      if (hasGsap && !reduced) window.gsap.fromTo($$('[data-menu] .m-link'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.7, delay: 0.25, ease: 'power3.out' });
    });
    $$('a, button', menu).forEach(function (b) { if (!b.hasAttribute('data-menu-toggle')) b.addEventListener('click', closeMenu); });
  }

  /* desktop dropdowns: keyboard + click support */
  $$('[data-dropdown]').forEach(function (dd) {
    var btn = $('button', dd);
    btn.addEventListener('click', function () { var o = dd.classList.toggle('is-open'); btn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    dd.addEventListener('mouseleave', function () { dd.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) { dd.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  });

  /* ---------- Toast ---------- */
  var toastEl = $('[data-toast]'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('is-show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 4200);
  }

  /* ---------- Modals ---------- */
  var lastFocus = null;
  function openModal(id, opts) {
    var m = document.getElementById('m-' + id);
    if (!m) return;
    opts = opts || {};
    $$('.modal.is-open').forEach(function (o) { if (o !== m) closeModal(o, true); });
    var form = $('form[data-steps]', m);
    if (form) {
      if (form.dataset.state === 'done') resetForm(form);
      if (opts.prefill) Object.keys(opts.prefill).forEach(function (k) { var f = form.elements[k]; if (f && opts.prefill[k]) f.value = opts.prefill[k]; });
      goStep(form, opts.startAt || 1);
    }
    lastFocus = document.activeElement;
    m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked'); if (lenis) lenis.stop();
    setTimeout(function () {
      var f = $('.step.is-active input:not([type=radio]):not([type=checkbox]), .step.is-active textarea, .step.is-active select', m) || $('.modal-x', m);
      if (f) f.focus({ preventScroll: true });
    }, 150);
  }
  function closeModal(m, keep) {
    m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true');
    if (!keep) { body.classList.remove('is-locked'); if (lenis) lenis.start(); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
  }
  $$('.modal').forEach(function (m) {
    $$('[data-close]', m).forEach(function (c) { c.addEventListener('click', function () { closeModal(m); }); });
    m.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('button, input, select, textarea, a[href]', m).filter(function (el) { return el.offsetParent !== null && !el.disabled; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { $$('.modal.is-open').forEach(function (m) { closeModal(m); }); closeMenu(); } });

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (!o) return;
    e.preventDefault(); closeMenu();
    var pre = {};
    var src = o.getAttribute('data-prefill-from');
    if (src) { var inp = $(src); if (inp) pre.address = inp.value.trim(); }
    if (o.getAttribute('data-topic')) pre.topic = o.getAttribute('data-topic');
    if (o.getAttribute('data-message')) pre.message = o.getAttribute('data-message');
    openModal(o.getAttribute('data-open'), { prefill: pre, startAt: pre.address ? 2 : 1 });
  });

  /* ---------- Multi-step forms (all modals + inline) ---------- */
  function validate(scope) {
    var ok = true, first = null;
    $$('[required]', scope).forEach(function (i) {
      var v;
      if (i.type === 'checkbox') v = i.checked;
      else if (i.type === 'radio') v = !!$('input[name="' + i.name + '"]:checked', scope);
      else if (i.type === 'tel') v = i.value.replace(/\D/g, '').length >= 10;
      else v = i.value.trim() !== '' && i.checkValidity();
      var wrap = i.closest('.fld, .chk, .opts') || i;
      wrap.classList.toggle('has-error', !v);
      if (!v && !first) first = i;
      if (!v) ok = false;
    });
    if (first) { first.focus({ preventScroll: true }); if (hasGsap && !reduced) window.gsap.fromTo(scope, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' }); }
    return ok;
  }
  document.addEventListener('input', function (e) { var w = e.target.closest('.has-error'); if (w) w.classList.remove('has-error'); });
  document.addEventListener('change', function (e) { var w = e.target.closest('.has-error'); if (w) w.classList.remove('has-error'); });

  function steps(form) { return $$('.step', form); }
  function realSteps(form) { return steps(form).filter(function (s) { return s.dataset.step !== 'done'; }); }
  function goStep(form, n) {
    form.dataset.cur = n;
    steps(form).forEach(function (s) { s.classList.toggle('is-active', String(s.dataset.step) === String(n)); });
    var total = realSteps(form).length;
    var root = form.closest('.modal') || form;
    var bar = $('[data-progress]', root), lab = $('[data-step-label]', root);
    if (n === 'done') { if (bar) bar.style.width = '100%'; if (lab) lab.style.visibility = 'hidden'; return; }
    if (bar) bar.style.width = (n / total * 100) + '%';
    if (lab) { lab.style.visibility = total > 1 ? 'visible' : 'hidden'; lab.textContent = 'Step ' + n + ' of ' + total; }
    var f = $('.step.is-active input:not([type=radio]):not([type=checkbox]), .step.is-active textarea', form);
    if (f && form.closest('.modal.is-open')) setTimeout(function () { f.focus({ preventScroll: true }); }, 60);
  }
  function resetForm(form) { form.reset(); form.dataset.state = ''; $$('.has-error', form).forEach(function (x) { x.classList.remove('has-error'); }); }
  $$('form[data-steps]').forEach(function (form) {
    goStep(form, 1);
    form.addEventListener('click', function (e) {
      var nx = e.target.closest('[data-next]'), pv = e.target.closest('[data-prev]');
      var cur = parseInt(form.dataset.cur, 10);
      if (nx) { e.preventDefault(); if (validate($('.step.is-active', form))) goStep(form, cur + 1); }
      if (pv) { e.preventDefault(); goStep(form, Math.max(1, cur - 1)); }
    });
    /* auto-advance single-choice steps */
    $$('.step[data-auto] input[type=radio]', form).forEach(function (r) {
      r.addEventListener('change', function () { var cur = parseInt(form.dataset.cur, 10); setTimeout(function () { if (String(form.dataset.cur) === String(cur)) goStep(form, cur + 1); }, 280); });
    });
    form.addEventListener('keydown', function (e) {
      var cur = parseInt(form.dataset.cur, 10);
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && cur < realSteps(form).length) { e.preventDefault(); if (validate($('.step.is-active', form))) goStep(form, cur + 1); }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate($('.step.is-active', form))) return;
      var nm = form.elements.name ? form.elements.name.value.trim().split(' ')[0] : '';
      $$('[data-fill-name]', form).forEach(function (x) { x.textContent = nm ? ', ' + nm : ''; });
      form.dataset.state = 'done';
      if (form.dataset.toast) toast(form.dataset.toast.replace('{name}', nm || 'friend'));
      if ($('.step[data-step="done"]', form)) goStep(form, 'done');
      else { resetForm(form); goStep(form, 1); var m = form.closest('.modal'); if (m) closeModal(m); }
      if (form.hasAttribute('data-guide')) store.set('exitShown', '1');
    });
  });

  /* ---------- Search widget (classic / AI / sell) ---------- */
  $$('[data-search]').forEach(function (root) {
    var tabs = $$('[data-search-tab]', root), modes = $$('[data-search-mode]', root);
    var state = { tab: 'buy', mode: 'classic' };
    function sync() {
      tabs.forEach(function (t) { var on = t.dataset.searchTab === state.tab; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); });
      modes.forEach(function (t) { var on = t.dataset.searchMode === state.mode; t.classList.toggle('is-active', on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var panel = state.tab === 'sell' ? 'sell' : state.mode;
      $$('[data-search-panel]', root).forEach(function (p) { var on = p.dataset.searchPanel === panel; p.hidden = !on; p.classList.toggle('is-active', on); });
      root.setAttribute('data-tab', state.tab); root.setAttribute('data-mode', state.mode);
      var mw = $('[data-mode-wrap]', root); if (mw) mw.hidden = state.tab === 'sell';
      $$('[data-rent-only]', root).forEach(function (x) { x.hidden = state.tab !== 'rent'; });
      $$('[data-buy-only]', root).forEach(function (x) { x.hidden = state.tab === 'rent'; });
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { state.tab = t.dataset.searchTab; sync(); }); });
    modes.forEach(function (t) { t.addEventListener('click', function () { state.mode = t.dataset.searchMode; sync(); }); });
    $$('[data-ai-chip]', root).forEach(function (c) { c.addEventListener('click', function () { var ta = $('textarea', root); ta.value = c.textContent.trim(); ta.focus(); }); });
    $$('form', root).forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.hasAttribute('data-sell')) {
          var a = $('input', f).value.trim();
          if (!a) { validate(f); return; }
          openModal('valuation', { prefill: { address: a }, startAt: 2 });
          return;
        }
        toast(state.mode === 'ai' ? 'Opening AI home search on our live MLS…' : 'Opening live MLS search…');
        window.open(state.mode === 'ai' ? D.idx.search : D.idx.search, '_blank', 'noopener');
      });
    });
    sync();
  });

  /* ---------- Generic tabs ---------- */
  $$('[data-tabs-root]').forEach(function (root) {
    var btns = $$('[data-tab]', root);
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (o) { var on = o === b; o.classList.toggle('is-active', on); o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1; });
        $$('[data-panel]', root).forEach(function (p) { var on = p.dataset.panel === b.dataset.tab; p.hidden = !on; p.classList.toggle('is-active', on); });
        root.dispatchEvent(new CustomEvent('sh:tab', { detail: b.dataset.tab }));
        if (hasGsap) window.ScrollTrigger.refresh();
      });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length]; n.click(); n.focus(); }
      });
    });
  });

  /* ---------- Listing actions (delegated) ---------- */
  document.addEventListener('click', function (e) {
    var fav = e.target.closest('.js-fav');
    if (fav) {
      e.preventDefault();
      var on = fav.getAttribute('aria-pressed') !== 'true';
      fav.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) toast('Saved. Want a text when similar homes list? Tap “Get listing alerts”.');
      if (hasGsap && !reduced) window.gsap.fromTo(fav, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' });
      return;
    }
    var tour = e.target.closest('[data-tour]');
    if (tour) {
      e.preventDefault();
      openModal('ask', { prefill: { topic: 'Schedule a showing', message: "I'd like to tour the " + tour.getAttribute('data-tour') + '.' } });
    }
  });

  /* ---------- Sliders ---------- */
  $$('[data-slider]').forEach(function (root) {
    var slides = $$('.js-slide', root), dotsWrap = $('[data-slider-dots]', root), idx = 0, timer;
    if (!slides.length) return;
    var dots = [];
    if (dotsWrap) slides.forEach(function (_, i) {
      var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Show item ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); }); dotsWrap.appendChild(d); dots.push(d);
    });
    var count = $('[data-slider-count]', root);
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, j) { s.classList.toggle('is-active', j === idx); s.setAttribute('aria-hidden', j === idx ? 'false' : 'true'); });
      dots.forEach(function (d, j) { d.classList.toggle('is-active', j === idx); d.setAttribute('aria-current', j === idx ? 'true' : 'false'); });
      if (count) count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      root.dispatchEvent(new CustomEvent('sh:slide', { detail: idx }));
    }
    function restart() { clearInterval(timer); var ms = parseInt(root.getAttribute('data-slider'), 10) || 0; if (ms && !reduced) timer = setInterval(function () { go(idx + 1); }, ms); }
    var p = $('[data-slider-prev]', root), n = $('[data-slider-next]', root);
    if (p) p.addEventListener('click', function () { go(idx - 1); restart(); });
    if (n) n.addEventListener('click', function () { go(idx + 1); restart(); });
    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', restart);
    go(0); restart();
  });

  /* ---------- Drag scrollers ---------- */
  $$('[data-drag]').forEach(function (wrap) {
    var track = wrap.firstElementChild, pos = 0, sx = 0, sp = 0, drag = false, moved = false, v = 0, lx = 0, lt = 0, raf;
    function max() { return Math.max(0, track.scrollWidth - wrap.clientWidth); }
    function apply() { pos = Math.min(0, Math.max(-max(), pos)); track.style.transform = 'translate3d(' + pos + 'px,0,0)'; wrap.dispatchEvent(new CustomEvent('sh:drag', { detail: max() ? -pos / max() : 0 })); }
    wrap.style.touchAction = 'pan-y';
    wrap.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; drag = true; moved = false; sx = lx = e.clientX; sp = pos; lt = performance.now(); v = 0; cancelAnimationFrame(raf); wrap.classList.add('is-dragging'); });
    addEventListener('pointermove', function (e) { if (!drag) return; var dx = e.clientX - sx; if (Math.abs(dx) > 5) moved = true; var now = performance.now(); v = (e.clientX - lx) / Math.max(1, now - lt); lx = e.clientX; lt = now; pos = sp + dx; apply(); });
    addEventListener('pointerup', function () { if (!drag) return; drag = false; wrap.classList.remove('is-dragging'); var vel = v * 16; (function glide() { vel *= 0.94; pos += vel; apply(); if (Math.abs(vel) > 0.3) raf = requestAnimationFrame(glide); })(); });
    wrap.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    wrap.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); pos -= e.deltaX; apply(); } }, { passive: false });
    $$('[data-drag-prev],[data-drag-next]', wrap.parentNode).forEach(function (b) {
      b.addEventListener('click', function () { pos += (b.hasAttribute('data-drag-prev') ? 1 : -1) * wrap.clientWidth * 0.75; track.style.transition = 'transform .8s cubic-bezier(.2,.8,.2,1)'; apply(); setTimeout(function () { track.style.transition = ''; }, 800); });
    });
    addEventListener('resize', apply);
  });

  /* ---------- Counters ---------- */
  function fmtCount(el, v) { var d = parseInt(el.dataset.decimals || '0', 10); el.textContent = (el.dataset.prefix || '') + (d ? v.toFixed(d) : Math.round(v).toLocaleString('en-US')) + (el.dataset.suffix || ''); }
  var counters = $$('[data-count]');
  if (reduced || !('IntersectionObserver' in window)) counters.forEach(function (el) { fmtCount(el, parseFloat(el.dataset.count)); });
  else {
    counters.forEach(function (el) { fmtCount(el, 0); });
    var cio = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return; cio.unobserve(x.target);
        var el = x.target, to = parseFloat(el.dataset.count), t0 = performance.now(), dur = 1800;
        (function tick(t) { var p = Math.min(1, (t - t0) / dur); fmtCount(el, to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Exit intent (desktop, once per session) ---------- */
  var armed = false; setTimeout(function () { armed = true; }, 12000);
  if (finePointer) document.addEventListener('mouseout', function (e) {
    if (!armed || e.relatedTarget || e.clientY > 8 || store.get('exitShown') || $('.modal.is-open')) return;
    store.set('exitShown', '1'); openModal('guide');
  });

  /* ---------- Magnetic ---------- */
  if (finePointer && hasGsap && !reduced) $$('.magnetic').forEach(function (b) {
    b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); window.gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.32, duration: 0.4, ease: 'power3.out' }); });
    b.addEventListener('mouseleave', function () { window.gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' }); });
  });

  /* ---------- Hand off to version animations ---------- */
  window.SH = { openModal: openModal, toast: toast, lenis: lenis, store: store, esc: esc, reduced: reduced, finePointer: finePointer };
  var pre = $('[data-preloader]');
  function dropPre() { if (pre && pre.parentNode) pre.parentNode.removeChild(pre); body.classList.remove('is-loading'); }
  if (!hasGsap || reduced || typeof window.SH_FX !== 'function') { dropPre(); return; }
  window.gsap.registerPlugin(window.ScrollTrigger);
  var safety = setTimeout(dropPre, 5000);
  window.SH_FX({ gsap: window.gsap, ST: window.ScrollTrigger, lenis: lenis, store: store, done: function () { clearTimeout(safety); dropPre(); }, $: $, $$: $$ });
  addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
