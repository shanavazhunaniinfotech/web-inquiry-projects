/* Perpetua Foundry — Perpetua LIS homepage concept */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = (p) => p + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  /* ---------- Analytics (GA4 / GTM dataLayer stub, consent-gated) ---------- */
  window.dataLayer = window.dataLayer || [];
  const consent = () => store.get('pf_consent') || {};
  function track(event, params = {}) {
    if (!consent().analytics) return;
    window.dataLayer.push({ event, ...params });
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-track]');
    if (t) track('cta_click', { cta: t.dataset.track });
  });

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
  }

  /* ---------- Header: scroll state + progress ---------- */
  const header = $('.site-header');
  const prog = $('.progress span');
  const drawer = $('#drawer');
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    drawer.classList.toggle('is-stuck', y > 38);
    parallax(y);
    shiftProgress();
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  /* ---------- Parallax ---------- */
  const pEls = $$('[data-parallax]');
  function parallax(y) {
    if (reduce) return;
    if (y > innerHeight * 1.4) return;
    pEls.forEach((el) => { el.style.translate = `0 ${(y * parseFloat(el.dataset.parallax)).toFixed(1)}px`; });
  }

  /* Hero tilt follows pointer */
  const tilt = $('[data-tilt]');
  const heroVis = $('.hero__visual');
  if (tilt && !reduce && matchMedia('(pointer:fine)').matches) {
    heroVis.addEventListener('pointermove', (e) => {
      const r = heroVis.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateY(${(-8 + x * 10).toFixed(2)}deg) rotateX(${(4 - y * 8).toFixed(2)}deg)`;
    });
    heroVis.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
  }

  /* ---------- Heat grid ---------- */
  const heat = $('.heat__grid');
  if (heat) {
    const vals = [];
    for (let i = 0; i < 42; i++) vals.push((0.15 + ((Math.sin(i * 1.7) + 1) / 2) * 0.75).toFixed(2));
    heat.innerHTML = vals.map((v) => `<i style="--o:${v}"></i>`).join('');
    if (!reduce) setInterval(() => {
      const cells = heat.children;
      const c = cells[Math.floor(Math.random() * cells.length)];
      c.style.setProperty('--o', (0.2 + Math.random() * 0.8).toFixed(2));
    }, 600);
  }

  /* ---------- Counters ---------- */
  function countUp(el) {
    const end = parseFloat(el.dataset.count);
    if (reduce) { el.textContent = end; return; }
    const dur = 1600; const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Typewriter (bento) ---------- */
  function typeOut(el, done) {
    const txt = el.dataset.type;
    if (reduce) { el.textContent = txt; done && done(); return; }
    let i = 0; el.textContent = '';
    const iv = setInterval(() => {
      el.textContent = txt.slice(0, ++i);
      if (i >= txt.length) { clearInterval(iv); done && done(); }
    }, 28);
  }

  /* ---------- Reveal observer ---------- */
  $$('.reveal').forEach((el) => {
    const sibs = Array.from(el.parentElement.children).filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i * 0.08, 0.4) + 's');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('is-in');
      $$('[data-count]', el).forEach(countUp);
      if (el.matches('[data-count]')) countUp(el);
      if (el.classList.contains('hero__visual')) setTimeout(() => el.classList.add('is-drawn'), 300);
      $$('.bars', el).forEach((b) => b.classList.add('is-in'));
      const mb = $('.mini-builder', el);
      if (mb && !mb.dataset.done) { mb.dataset.done = 1; typeOut($('.type', mb), () => setTimeout(() => mb.classList.add('is-done'), 250)); }
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));
  const h1 = $('.hero h1');
  setTimeout(() => h1 && h1.classList.add('is-in'), 50);

  /* ---------- Category shift progress ---------- */
  const shift = $('#shift');
  function shiftProgress() {
    if (!shift) return;
    const r = shift.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.3)));
    shift.style.setProperty('--s', reduce ? 1 : p.toFixed(3));
  }

  /* ---------- Mega menu ---------- */
  const megaItems = $$('.has-mega');
  function closeMega(except) {
    megaItems.forEach((li) => { if (li !== except) { li.classList.remove('is-open'); $('.menu__btn', li).setAttribute('aria-expanded', 'false'); } });
  }
  megaItems.forEach((li) => {
    const btn = $('.menu__btn', li);
    let hoverT;
    btn.addEventListener('click', () => {
      const open = !li.classList.contains('is-open');
      closeMega(li);
      li.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    li.addEventListener('mouseenter', () => { if (!matchMedia('(hover:hover)').matches) return; clearTimeout(hoverT); closeMega(li); li.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); });
    li.addEventListener('mouseleave', () => { if (!matchMedia('(hover:hover)').matches) return; hoverT = setTimeout(() => { li.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }, 160); });
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) { li.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega')) closeMega(); });
  $$('.mega a').forEach((a) => a.addEventListener('click', () => closeMega()));

  /* ---------- Drawer ---------- */
  const burger = $('.burger');
  function setDrawer(open) {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setDrawer(drawer.hidden));
  drawer.addEventListener('click', (e) => { if (e.target.closest('a, [data-open]')) setDrawer(false); });

  /* ---------- Tour ---------- */
  const TOUR = {
    create: { url: 'studio', nav: 'create', steps: [
      { t: 'Upload your source content', d: 'Drop in policies, playbooks, slide decks or SOPs. Perpetua LIS reads them as the single source of truth.', hs: [70, 32],
        html: `<div class="scr-h"><div><small>Studio · New course</small><strong>Add source material</strong></div><span class="scr-btn scr-btn--ghost">Import from Drive</span></div>
        <div class="scr-card scr-card--hl"><span class="scr-label">Sources (3)</span><div class="scr-files"><span class="scr-file"><b>PDF</b>Sales_Playbook_2026.pdf</span><span class="scr-file"><b class="p">PPT</b>Discovery_Training.pptx</span><span class="scr-file"><b class="d">DOC</b>Pricing_Guidelines.docx</span></div></div>
        <div class="scr-card"><span class="scr-label">Course goal</span><p style="margin:0;font-size:13px">Get new account managers confident running discovery calls and writing proposals within 2 weeks.</p></div>
        <div class="scr-card"><span class="scr-label">Audience</span><div class="scr-files"><span class="scr-tag">New account managers</span><span class="scr-tag">Sales · APAC</span><span class="scr-tag scr-tag--o">Beginner</span></div></div>
        <div style="text-align:right"><span class="scr-btn">Generate course draft →</span></div>` },
      { t: 'AI drafts the full course', d: 'Get a structured course — modules, lessons and knowledge checks — grounded in your material, in under a minute.', hs: [86, 18],
        html: `<div class="scr-h"><div><small>Studio · Draft generated in 42s</small><strong>Account Manager Onboarding</strong></div><span class="scr-tag">AI draft · review required</span></div>
        <div class="scr-mods">
          <div class="scr-mod"><i>01</i><div>Welcome &amp; how we sell<br><span>3 lessons · 12 min</span></div><span class="scr-tag">Ready</span></div>
          <div class="scr-mod"><i>02</i><div>Running discovery conversations<br><span>4 lessons · 25 min · role-play</span></div><span class="scr-tag">Ready</span></div>
          <div class="scr-mod"><i>03</i><div>Qualifying &amp; next steps<br><span>3 lessons · 18 min</span></div><span class="scr-tag">Ready</span></div>
          <div class="scr-mod"><i>04</i><div>Proposals that win<br><span>3 lessons · 20 min</span></div><span class="scr-tag scr-tag--o">Edit</span></div>
          <div class="scr-mod"><i>05</i><div>Knowledge check<br><span>12 questions · scenario based</span></div><span class="scr-tag">Ready</span></div>
        </div>` },
      { t: 'Review, refine and publish', d: 'Edit anything inline, ask the AI to adjust tone or depth, then publish to the right people in one click.', hs: [88, 88],
        html: `<div class="scr-h"><div><small>Module 04 · Lesson 2</small><strong>Structuring a winning proposal</strong></div><span class="scr-btn scr-btn--ghost">Preview</span></div>
        <div class="scr-card"><div class="scr-line" style="width:92%"></div><div class="scr-line" style="width:84%"></div><div class="scr-line" style="width:70%"></div><div class="scr-line" style="width:88%"></div></div>
        <div class="scr-card scr-card--hl"><span class="scr-label">Ask AI to refine</span><p style="margin:0;font-size:13px">“Make this more practical and add an example for a mid-market customer.”</p></div>
        <div class="scr-card"><div class="scr-set"><span>Assign to: New account managers (14)</span><span class="scr-toggle"></span></div><div class="scr-set"><span>Due within 14 days of start date</span><span class="scr-toggle"></span></div></div>
        <div style="text-align:right"><span class="scr-btn">Publish course</span></div>` }
    ] },
    deliver: { url: 'paths', nav: 'deliver', steps: [
      { t: 'Build role-based learning paths', d: 'Combine courses into paths by role, team or location — and assign them automatically when people join.', hs: [30, 40],
        html: `<div class="scr-h"><div><small>Paths</small><strong>Customer Success · First 30 days</strong></div><span class="scr-btn scr-btn--teal">Auto-assign on</span></div>
        <div class="scr-mods">
          <div class="scr-mod"><i>W1</i><div>Company &amp; product foundations<br><span>2 courses · 1h 10m</span></div><span class="scr-tag">Required</span></div>
          <div class="scr-mod"><i>W2</i><div>Customer conversations<br><span>2 courses · 55m</span></div><span class="scr-tag">Required</span></div>
          <div class="scr-mod"><i>W3</i><div>Tools &amp; workflows<br><span>3 courses · 1h 20m</span></div><span class="scr-tag scr-tag--o">Optional</span></div>
          <div class="scr-mod"><i>W4</i><div>Readiness check<br><span>Assessment · 20m</span></div><span class="scr-tag">Required</span></div>
        </div>` },
      { t: 'Learn in the flow of work', d: 'Short lessons and timely nudges reach people where they work, so learning fits around the job — not the other way round.', hs: [50, 70],
        html: `<div class="scr-h"><div><small>Learner view</small><strong>Good morning, Priya</strong></div><span class="pill">3 of 7 done</span></div>
        <div class="scr-card"><span class="scr-label">Continue</span><strong style="font-size:14px">Handling objections with empathy</strong><div class="scr-prog"><i style="--w:62%"></i></div></div>
        <div class="scr-nudge"><span class="av b">PF</span><div><b>5-minute practice before your 2pm call?</b>A quick role-play on pricing objections — based on your upcoming customer meeting.</div></div>
        <div class="scr-row" style="margin-top:10px"><div class="scr-card"><span class="scr-label">Streak</span><b style="font-family:var(--serif);font-size:22px">6 days</b></div><div class="scr-card"><span class="scr-label">This week</span><b style="font-family:var(--serif);font-size:22px">48 min</b></div></div>` },
      { t: 'Track progress across teams', d: 'See who is on track, who is stuck and where to step in — with reminders sent automatically.', hs: [84, 44],
        html: `<div class="scr-h"><div><small>Paths · Customer Success · First 30 days</small><strong>Cohort progress</strong></div><span class="scr-btn scr-btn--ghost">Send reminder</span></div>
        <div class="scr-people">
          <div class="scr-person"><span class="av">PS</span><span>Priya S.</span><div class="scr-prog"><i style="--w:72%"></i></div><span class="scr-tag">On track</span></div>
          <div class="scr-person"><span class="av b">MT</span><span>Marcus T.</span><div class="scr-prog"><i style="--w:88%"></i></div><span class="scr-tag">On track</span></div>
          <div class="scr-person"><span class="av c">AL</span><span>Aisha L.</span><div class="scr-prog"><i style="--w:34%"></i></div><span class="scr-tag scr-tag--o">Behind</span></div>
          <div class="scr-person"><span class="av d">JR</span><span>James R.</span><div class="scr-prog"><i style="--w:55%"></i></div><span class="scr-tag">On track</span></div>
          <div class="scr-person"><span class="av">KN</span><span>Kenji N.</span><div class="scr-prog"><i style="--w:100%"></i></div><span class="scr-tag">Complete</span></div>
        </div>` }
    ] },
    assess: { url: 'assess', nav: 'assess', steps: [
      { t: 'Generate skill-based assessments', d: 'Create scenario questions mapped to the skills that matter for each role — not just recall of facts.', hs: [60, 26],
        html: `<div class="scr-h"><div><small>Assess · Discovery skills</small><strong>Question bank · 12 items</strong></div><span class="scr-btn">+ Generate more</span></div>
        <div class="scr-card scr-card--hl"><span class="scr-label">Scenario · Skill: Questioning</span><div class="scr-q">A prospect says “we already have a tool that does this.” What's the best next question?</div>
        <div class="scr-opt">“What features does it have?”</div><div class="scr-opt ok">“What would need to change for you to look at alternatives?”</div><div class="scr-opt">“Can I show you our demo?”</div></div>
        <div class="scr-files"><span class="scr-tag">Questioning</span><span class="scr-tag">Active listening</span><span class="scr-tag scr-tag--o">Difficulty: Medium</span></div>` },
      { t: 'Learners get instant feedback', d: 'Every answer comes with an explanation, so assessment becomes part of learning — not a hurdle at the end.', hs: [40, 60],
        html: `<div class="scr-h"><div><small>Learner · Knowledge check</small><strong>Question 4 of 12</strong></div><span class="pill">8:24 left</span></div>
        <div class="scr-card"><div class="scr-q">Which signal best indicates a qualified opportunity?</div><div class="scr-opt">The prospect asked for a brochure</div><div class="scr-opt ok">A named owner with a defined problem and timeline</div><div class="scr-opt">They opened three marketing emails</div></div>
        <div class="alert alert--ok" style="margin:0;font-size:12.5px"><svg class="ic"><use href="#i-check"/></svg><span><b>Correct.</b> Ownership, a clear problem and timing are stronger signals than engagement alone.</span></div>` },
      { t: 'Measure capability, not completion', d: 'Results roll up into a skill profile for each person, showing real progress against the capabilities their role needs.', hs: [24, 34],
        html: `<div class="scr-h"><div><small>Skill profile</small><strong>Priya Sharma · Account Manager</strong></div><span class="scr-tag">+14 pts this month</span></div>
        <div class="scr-meter scr-card"><div class="ring" style="--p:76"><span>76</span></div><div><strong style="font-size:14px">Role readiness</strong><br><span style="font-size:12px;color:var(--muted)">Target 80 · on track for week 4</span></div></div>
        <div class="scr-card">
          <div class="scr-skill"><span>Questioning</span><div class="scr-prog"><i style="--w:82%"></i></div><b>82</b></div>
          <div class="scr-skill"><span>Active listening</span><div class="scr-prog"><i style="--w:74%"></i></div><b>74</b></div>
          <div class="scr-skill"><span>Proposal writing</span><div class="scr-prog"><i style="--w:58%"></i></div><b>58</b></div>
          <div class="scr-skill"><span>Product knowledge</span><div class="scr-prog"><i style="--w:90%"></i></div><b>90</b></div>
        </div>` }
    ] },
    report: { url: 'insights', nav: 'report', steps: [
      { t: 'Capability dashboards for leaders', d: 'See skill growth by team and role over time — the evidence leaders need, without exporting a single spreadsheet.', hs: [50, 22],
        html: `<div class="scr-h"><div><small>Insights · All teams</small><strong>Capability overview</strong></div><span class="pill">Last 90 days</span></div>
        <div class="scr-kpis"><div class="scr-kpi"><small>Capability index</small><b>72</b> <span class="up" style="font-size:11px">▲9</span></div><div class="scr-kpi"><small>Skills improved</small><b>38%</b></div><div class="scr-kpi"><small>Active learners</small><b>184</b></div></div>
        <div class="scr-card"><span class="scr-label">Capability index by month</span><div class="scr-cols"><i style="--h:40%"></i><i style="--h:46%"></i><i style="--h:44%"></i><i style="--h:55%"></i><i style="--h:58%"></i><i style="--h:63%"></i><i style="--h:66%"></i><i style="--h:72%"></i><i style="--h:78%"></i></div></div>` },
      { t: 'Spot and act on skill gaps', d: 'Identify where capability is lagging and launch targeted learning straight from the report.', hs: [80, 58],
        html: `<div class="scr-h"><div><small>Insights · Skill gaps</small><strong>Largest gaps vs. role targets</strong></div><span class="scr-btn">Create learning plan</span></div>
        <div class="scr-card">
          <div class="scr-skill"><span>Data literacy</span><div class="scr-prog"><i style="--w:46%;background:var(--orange)"></i></div><b>−24</b></div>
          <div class="scr-skill"><span>AI tools at work</span><div class="scr-prog"><i style="--w:52%;background:var(--orange)"></i></div><b>−19</b></div>
          <div class="scr-skill"><span>Coaching others</span><div class="scr-prog"><i style="--w:61%"></i></div><b>−11</b></div>
          <div class="scr-skill"><span>Negotiation</span><div class="scr-prog"><i style="--w:70%"></i></div><b>−6</b></div>
        </div>
        <div class="scr-nudge"><span class="av">AI</span><div><b>Suggested action</b>Assign “Data Foundations” to Operations (23 people) — estimated to close 60% of the gap in 6 weeks.</div></div>` },
      { t: 'Administer with confidence', d: 'Manage roles, permissions, learner limits and your subscription from one admin console.', hs: [86, 30],
        html: `<div class="scr-h"><div><small>Admin</small><strong>Organisation settings</strong></div><span class="scr-tag">Growth plan</span></div>
        <div class="scr-card"><span class="scr-label">Learner seats</span><strong style="font-size:14px">184 of 250 used</strong><div class="scr-prog"><i style="--w:74%"></i></div></div>
        <div class="scr-card"><div class="scr-set"><span>Admins can publish courses</span><span class="scr-toggle"></span></div><div class="scr-set"><span>Managers see team reports</span><span class="scr-toggle"></span></div><div class="scr-set"><span>Learners can self-enrol</span><span class="scr-toggle off"></span></div></div>
        <div class="scr-row"><span class="scr-btn scr-btn--ghost" style="text-align:center">Manage billing</span><span class="scr-btn scr-btn--ghost" style="text-align:center">Invite admins</span></div>` }
    ] }
  };
  const AREAS = Object.keys(TOUR);
  const tourTabs = $$('.tour__tabs [role="tab"]');
  const stepsEl = $('.steps');
  const screen = $('[data-screen]');
  const countEl = $('.tour__count');
  const hotspot = $('.hotspot');
  const autoBtn = $('.tour__auto');
  const tourUrl = $('.tour__url');
  let tArea = 'create', tStep = 0, tAuto = !reduce, tTimer, tStart, tRaf;
  const STEP_MS = 6500;

  function renderTour(focusTab) {
    const area = TOUR[tArea];
    tourTabs.forEach((b) => {
      const on = b.dataset.area === tArea;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on) { $('#tour-panel').setAttribute('aria-labelledby', b.id); if (focusTab) b.focus(); }
    });
    stepsEl.innerHTML = area.steps.map((s, i) => `<li><button type="button" data-i="${i}" ${i === tStep ? 'aria-current="step"' : ''}><span class="n">${String(AREAS.indexOf(tArea) * 3 + i + 1).padStart(2, '0')}</span><span><strong>${s.t}</strong><p>${s.d}</p></span><span class="bar"><i></i></span></button></li>`).join('');
    const s = area.steps[tStep];
    screen.innerHTML = s.html;
    tourUrl.textContent = 'app.perpetualis.ai / ' + area.url;
    $$('.app__side--labels span').forEach((n) => n.classList.toggle('is-on', n.dataset.nav === area.nav));
    countEl.textContent = `${AREAS.indexOf(tArea) * 3 + tStep + 1} / 12`;
    hotspot.style.left = `calc(104px + (100% - 104px) * ${s.hs[0] / 100} - 11px)`;
    hotspot.style.top = `calc(34px + (100% - 34px) * ${s.hs[1] / 100} - 11px)`;
    if (innerWidth <= 720) hotspot.style.left = `calc(100% * ${s.hs[0] / 100} - 11px)`;
    hotspot.classList.remove('is-on'); void hotspot.offsetWidth; hotspot.classList.add('is-on');
    track('tour_step', { area: tArea, step: tStep + 1 });
    restartTimer();
  }
  function go(delta) {
    let idx = AREAS.indexOf(tArea) * 3 + tStep + delta;
    idx = (idx + 12) % 12;
    tArea = AREAS[Math.floor(idx / 3)]; tStep = idx % 3;
    renderTour();
  }
  function restartTimer() {
    clearTimeout(tTimer); cancelAnimationFrame(tRaf);
    const bar = $('.steps [aria-current="step"] .bar i');
    if (!tAuto || !tourVisible) { if (bar) bar.style.transform = 'scaleX(0)'; return; }
    tStart = performance.now();
    const loop = (t) => {
      const p = Math.min(1, (t - tStart) / STEP_MS);
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (p < 1) tRaf = requestAnimationFrame(loop);
    };
    tRaf = requestAnimationFrame(loop);
    tTimer = setTimeout(() => go(1), STEP_MS);
  }
  function setAuto(on) { tAuto = on; autoBtn.setAttribute('aria-pressed', String(on)); autoBtn.textContent = on ? 'Pause' : 'Autoplay'; restartTimer(); }
  tourTabs.forEach((b, i) => {
    b.addEventListener('click', () => { tArea = b.dataset.area; tStep = 0; setAuto(false); renderTour(); });
    b.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : tourTabs.length - 1;
      n = (n + tourTabs.length) % tourTabs.length;
      tArea = tourTabs[n].dataset.area; tStep = 0; setAuto(false); renderTour(true);
    });
  });
  stepsEl.addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) { tStep = +b.dataset.i; setAuto(false); renderTour(); } });
  $('[data-step="prev"]').addEventListener('click', () => { setAuto(false); go(-1); });
  $('[data-step="next"]').addEventListener('click', () => { setAuto(false); go(1); });
  autoBtn.addEventListener('click', () => setAuto(!tAuto));
  let tourVisible = false;
  new IntersectionObserver(([en]) => { tourVisible = en.isIntersecting; restartTimer(); }, { threshold: 0.3 }).observe($('.tour__wrap'));
  renderTour();

  /* Deep links into tour / solutions / form tab */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tour]');
    if (t) { tArea = t.dataset.tour; tStep = 0; setAuto(false); renderTour(); }
    const s = e.target.closest('[data-solution]');
    if (s) setSolution(s.dataset.solution);
    const f = e.target.closest('[data-form-tab]');
    if (f) setFormTab(f.dataset.formTab);
  });

  /* ---------- Provisioning loop (how section) ---------- */
  const prov = $('.how .prov');
  if (prov) {
    const items = $$('li', prov); const bar = $('.prov__bar span', prov);
    let i = 0, running = false, timer;
    const tick = () => {
      items.forEach((li, k) => { li.classList.toggle('is-done', k < i); li.classList.toggle('is-busy', k === i); });
      bar.style.width = (i / items.length * 100) + '%';
      i++;
      if (i > items.length) { timer = setTimeout(() => { i = 0; tick(); }, 2600); } else timer = setTimeout(tick, 900);
    };
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; if (reduce) { i = items.length; items.forEach((li) => li.classList.add('is-done')); bar.style.width = '100%'; } else tick(); }
      else if (!en.isIntersecting && running) { running = false; clearTimeout(timer); }
    }, { threshold: 0.4 }).observe(prov);
  }

  /* ---------- Segmented controls helper ---------- */
  function movePill(group, pill, active) {
    if (!active) return;
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  /* ---------- Solutions ---------- */
  const seg = $('.seg'); const segPill = $('.seg__pill'); const segBtns = $$('.seg [role="tab"]');
  function setSolution(key, focus) {
    segBtns.forEach((b) => {
      const on = b.dataset.sol === key;
      b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1;
      $('#sol-' + b.dataset.sol).hidden = !on;
      if (on) { movePill(seg, segPill, b); if (focus) b.focus(); }
    });
  }
  segBtns.forEach((b, i) => {
    b.addEventListener('click', () => setSolution(b.dataset.sol));
    b.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + segBtns.length) % segBtns.length;
      setSolution(segBtns[n].dataset.sol, true);
    });
  });

  /* ---------- Pricing ---------- */
  const PLANS = [
    { id: 'starter', name: 'Starter', for: 'For small teams launching their first programmes.', m: 249, a: 2490, seats: 'Up to 50 learners · 1 admin',
      f: ['AI course drafting (10 / month)', 'Learning paths & assignments', 'Assessments & knowledge checks', 'Core capability dashboard', 'Email support'] },
    { id: 'growth', name: 'Growth', pop: true, for: 'For growing organisations building capability at pace.', m: 599, a: 5990, seats: 'Up to 250 learners · 5 admins',
      f: ['Everything in Starter', 'AI course drafting (50 / month)', 'Advanced capability reporting', 'Custom branding', 'Priority email support'] },
    { id: 'scale', name: 'Scale', for: 'For multi-team rollouts and training providers.', m: 1290, a: 12900, seats: 'Up to 1,000 learners · unlimited admins',
      f: ['Everything in Growth', 'AI course drafting (200 / month)', 'Multi-team & cohort management', 'Dedicated customer success manager', ['Integrations', 'plan']] },
    { id: 'enterprise', name: 'Enterprise', for: 'For large organisations with custom needs.', seats: '1,000+ learners · custom limits',
      f: ['Everything in Scale', 'Custom learner volumes & terms', 'Security & procurement review', 'Tailored rollout & capability baseline', 'Invoice billing'] }
  ];
  let billing = 'annual';
  const plansEl = $('#plans');
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  function renderPlans(animate) {
    plansEl.innerHTML = PLANS.map((p) => {
      const ent = !p.m;
      const per = ent ? '' : billing === 'annual' ? Math.round(p.a / 12) : p.m;
      const price = ent ? '<b>Custom</b>' : `<b class="${animate ? 'price-anim' : ''}">${fmt(per)}</b><span>/ month</span>`;
      const bill = ent ? 'Volume pricing, billed annually' : billing === 'annual' ? `${fmt(p.a)} billed annually · save ${fmt(p.m * 12 - p.a)}` : 'Billed monthly · cancel anytime';
      const feats = p.f.map((x) => Array.isArray(x) ? `<li><svg class="ic"><use href="#i-check"/></svg><span>${x[0]} <span class="status status--plan">Planned</span></span></li>` : `<li><svg class="ic"><use href="#i-check"/></svg><span>${esc(x)}</span></li>`).join('');
      const cta = ent ? `<a class="btn ${p.pop ? 'btn--primary' : 'btn--ghost'}" href="#demo" data-form-tab="contact" data-track="plan_enterprise">Contact sales</a>`
        : `<button class="btn ${p.pop ? 'btn--primary' : 'btn--ghost'}" type="button" data-buy="${p.id}">Start with ${p.name}</button>`;
      return `<article class="plan ${p.pop ? 'plan--pop' : ''} reveal is-in">${p.pop ? '<span class="plan__badge">Most popular</span>' : ''}<h3>${p.name}</h3><p class="plan__for">${p.for}</p><div class="plan__price">${price}</div><p class="plan__bill">${bill}</p>${cta}<div class="plan__seats">${p.seats}</div><ul>${feats}</ul></article>`;
    }).join('');
  }
  const billBtns = $$('.billing [role="radio"]'); const billPill = $('.billing__pill'); const billWrap = $('.billing');
  function setBilling(b, animate) {
    billing = b;
    billBtns.forEach((x) => { const on = x.dataset.bill === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; if (on) movePill(billWrap, billPill, x); });
    renderPlans(animate);
  }
  billBtns.forEach((b) => {
    b.addEventListener('click', () => { setBilling(b.dataset.bill, true); track('billing_toggle', { billing: b.dataset.bill }); });
    b.addEventListener('keydown', (e) => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const o = billBtns.find((x) => x !== b); setBilling(o.dataset.bill, true); o.focus(); } });
  });
  setBilling('annual');
  const cmpBtn = $('.compare__toggle');
  cmpBtn.addEventListener('click', () => { const open = cmpBtn.getAttribute('aria-expanded') !== 'true'; cmpBtn.setAttribute('aria-expanded', String(open)); $('#compare-table').hidden = !open; cmpBtn.firstChild.textContent = open ? 'Hide feature comparison ' : 'Compare all features '; });

  window.addEventListener('resize', () => {
    movePill(billWrap, billPill, $('.billing [aria-checked="true"]'));
    movePill(seg, segPill, $('.seg [aria-selected="true"]'));
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { movePill(billWrap, billPill, $('.billing [aria-checked="true"]')); setSolution($('.seg [aria-selected="true"]').dataset.sol); });
  else setSolution('onboarding');

  /* ---------- Modal ---------- */
  const modal = $('#modal'); const mBox = $('.modal__box', modal); const mContent = $('#modal-content');
  let lastFocus = null, onModalClose = null;
  function openModal(html, opts = {}) {
    lastFocus = document.activeElement;
    mContent.innerHTML = html;
    modal.classList.toggle('modal--wide', !!opts.wide);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    onModalClose = opts.onClose || null;
    requestAnimationFrame(() => { const f = $('input, select, button:not(.modal__x), a[href]', mContent); (opts.focusBox ? mBox : f || mBox).focus(); });
  }
  function closeModal(skipFocus) {
    if (modal.hidden) return;
    modal.hidden = true; document.body.style.overflow = '';
    if (onModalClose) { onModalClose(); onModalClose = null; }
    if (lastFocus && !skipFocus) lastFocus.focus({ preventScroll: false });
  }
  modal.addEventListener('click', (e) => { const c = e.target.closest('[data-close="modal"]'); if (c) closeModal(c.matches('a[href^="#"]')); });
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', mBox).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) closeModal();
    else if (!chat.hidden) closeChat();
    else if (!drawer.hidden) setDrawer(false);
    else closeMega();
  });

  /* ---------- Checkout flow (prototype) ---------- */
  const orders = new Set();
  function checkout(planId) {
    const p = PLANS.find((x) => x.id === planId);
    const bill = billing;
    const price = bill === 'annual' ? p.a : p.m;
    const key = uid('idem');
    let state = { step: 1, data: {} };
    track('select_plan', { plan: p.id, billing: bill, value: price, currency: 'USD' });

    const stepsBar = (n) => `<ol class="co-steps"><li class="${n > 1 ? 'is-done' : n === 1 ? 'is-on' : ''}">1. Details</li><li class="${n > 2 ? 'is-done' : n === 2 ? 'is-on' : ''}">2. Payment</li><li class="${n === 3 ? 'is-on' : ''}">3. Workspace</li></ol>`;
    const summary = () => `<div class="summary"><div class="summary__row"><span>Perpetua LIS ${p.name} · ${bill === 'annual' ? 'Annual' : 'Monthly'}</span><span>${fmt(price)}</span></div><div class="summary__row"><span>${p.seats}</span><span></span></div><div class="summary__row"><span>Tax</span><span>Calculated at payment</span></div><div class="summary__row summary__row--total"><span>Due today (USD)</span><span>${fmt(price)}</span></div></div>`;

    function step1() {
      openModal(`<h2 id="modal-title">Start with ${p.name}</h2><p class="modal__sub">Tell us who the workspace is for. You'll review everything before paying.</p>${stepsBar(1)}
        <form id="co-form" novalidate>
          <label class="fld"><span>Organisation name*</span><input name="org" required autocomplete="organization" value="${esc(state.data.org || '')}"></label>
          <div class="row"><label class="fld"><span>Administrator name*</span><input name="name" required autocomplete="name" value="${esc(state.data.name || '')}"></label>
          <label class="fld"><span>Administrator work email*</span><input name="email" type="email" required autocomplete="email" value="${esc(state.data.email || '')}"></label></div>
          <div class="row"><label class="fld"><span>Country*</span><select name="country" required><option value="">Select</option><option>Australia</option><option>New Zealand</option><option>United Kingdom</option><option>United States</option><option>Singapore</option><option>Other</option></select></label>
          <label class="fld"><span>Billing email</span><input name="billing" type="email" autocomplete="email" placeholder="Defaults to admin email"></label></div>
          ${summary()}
          <label class="check"><input type="checkbox" name="terms" required><span>I agree to the <button type="button" class="inline-link" data-policy="terms">Terms of Service</button> and subscription terms.*</span></label><p class="err" data-err="terms"></p>
          <div class="modal__actions"><button class="btn btn--primary" type="submit">Continue to secure payment <svg class="ic"><use href="#i-lock"/></svg></button></div>
        </form>`, { wide: false });
      if (state.data.country) $('select[name="country"]', mContent).value = state.data.country;
      $('#co-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        if (!validate(f)) return;
        state.data = Object.fromEntries(new FormData(f));
        track('begin_checkout', { plan: p.id, billing: bill, value: price, currency: 'USD' });
        step2();
      });
    }
    function step2(failed) {
      openModal(`<h2 id="modal-title">Secure payment</h2><p class="modal__sub">Workspace for <strong>${esc(state.data.org)}</strong> · admin ${esc(state.data.email)}</p>${stepsBar(2)}
        ${failed ? `<div class="alert alert--bad" role="alert"><svg class="ic"><use href="#i-close"/></svg><span><b>Payment declined — you have not been charged.</b> Please try again or use a different card. No workspace or account has been created.</span></div>` : ''}
        ${summary()}
        <div class="paybox"><p><svg class="ic"><use href="#i-lock"/></svg> In production you'll complete payment on our provider's hosted, PCI-compliant page (e.g. Stripe Checkout). Card details never touch Perpetua Foundry servers.</p>
          <div class="paybox__btns"><button class="btn btn--primary" type="button" id="pay-ok">Simulate successful payment</button><button class="btn btn--ghost" type="button" id="pay-fail">Simulate declined card</button></div>
          <p class="idem">Idempotency key: ${key}</p></div>
        <button class="btn btn--text btn--sm" type="button" id="co-back">← Edit details</button>`);
      $('#co-back').addEventListener('click', step1);
      const ok = $('#pay-ok'), bad = $('#pay-fail');
      ok.addEventListener('click', () => {
        if (orders.has(key)) return; // duplicate-charge guard
        orders.add(key); ok.disabled = bad.disabled = true; ok.textContent = 'Verifying payment…';
        setTimeout(step3, 1100);
      });
      bad.addEventListener('click', () => { bad.disabled = ok.disabled = true; bad.textContent = 'Processing…'; track('payment_failed', { plan: p.id }); setTimeout(() => step2(true), 900); });
    }
    function step3() {
      const order = 'PF-' + Math.floor(10000 + Math.random() * 89999);
      track('purchase', { transaction_id: order, plan: p.id, billing: bill, value: price, currency: 'USD' });
      const items = ['Payment verified by provider webhook', `Organisation “${esc(state.data.org)}” created`, `${p.name} plan assigned · ${p.seats.split(' · ')[0].replace('Up to ', '')}`, `Admin invite sent to ${esc(state.data.email)}`, 'Secure first-login link ready'];
      openModal(`<h2 id="modal-title">Setting up your workspace</h2><p class="modal__sub">Order ${order} · this usually takes under a minute.</p>${stepsBar(3)}
        <div class="prov"><ul class="prov__list">${items.map((t) => `<li><i></i>${t}</li>`).join('')}</ul><div class="prov__bar"><span></span></div></div>
        <div id="co-done" hidden><div class="alert alert--ok" role="status" style="margin-top:20px"><svg class="ic"><use href="#i-check"/></svg><span><b>You're all set.</b> We've emailed ${esc(state.data.email)} a secure link to sign in and start the setup checklist.</span></div>
        <div class="receipt"><b>Receipt</b> · ${fmt(price)} USD · ${p.name} (${bill}) · <code>${order}</code><br>Manage invoices, payment methods, upgrades, renewals and cancellation anytime in the billing portal.</div>
        <div class="modal__actions"><button class="btn btn--primary" type="button" data-close="modal">Done</button><button class="btn btn--ghost" type="button" id="portal">Preview billing portal</button></div></div>`, { focusBox: true });
      const lis = $$('.prov__list li', mContent); const bar = $('.prov__bar span', mContent);
      let i = 0;
      const tick = () => {
        lis.forEach((li, k) => { li.classList.toggle('is-done', k < i); li.classList.toggle('is-busy', k === i); });
        bar.style.width = (i / lis.length * 100) + '%';
        if (i++ < lis.length) setTimeout(tick, reduce ? 50 : 750);
        else { $('#co-done').hidden = false; track('onboarding_complete', { plan: p.id }); $('#co-done .btn--primary').focus(); $('#portal').addEventListener('click', () => portal(p, bill, order)); }
      };
      tick();
    }
    step1();
  }
  function portal(p, bill, order) {
    const price = bill === 'annual' ? p.a : p.m;
    const next = new Date(); bill === 'annual' ? next.setFullYear(next.getFullYear() + 1) : next.setMonth(next.getMonth() + 1);
    openModal(`<h2 id="modal-title">Billing portal</h2><p class="modal__sub">Prototype view of the customer self-service portal.</p>
      <div class="summary"><div class="summary__row"><span>Current plan</span><span><b>${p.name}</b> · ${bill}</span></div><div class="summary__row"><span>Next renewal</span><span>${next.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })} · ${fmt(price)}</span></div><div class="summary__row"><span>Payment method</span><span>Visa ending 4242</span></div><div class="summary__row"><span>Latest invoice</span><span>${order} · Paid</span></div></div>
      <div class="modal__actions"><button class="btn btn--dark btn--sm" type="button" data-pt="Plan change preview: upgrades apply now, pro-rated; downgrades at renewal.">Change plan</button><button class="btn btn--ghost btn--sm" type="button" data-pt="Payment method update opens the provider's secure form.">Update card</button><button class="btn btn--ghost btn--sm" type="button" data-pt="Invoice PDF download (prototype).">Download invoices</button><button class="btn btn--text btn--sm" type="button" data-pt="Cancellation takes effect at the end of the current term. Access continues until then.">Cancel subscription</button></div>`);
    $$('[data-pt]', mContent).forEach((b) => b.addEventListener('click', () => toast(b.dataset.pt)));
  }
  plansEl.addEventListener('click', (e) => { const b = e.target.closest('[data-buy]'); if (b) checkout(b.dataset.buy); });

  /* ---------- Validation ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function validate(form) {
    let first = null;
    $$('.fld', form).forEach((f) => { f.classList.remove('is-bad'); const m = $('.msg', f); if (m) m.remove(); });
    $$('.err', form).forEach((e) => { e.textContent = ''; });
    $$('input, select, textarea', form).forEach((el) => {
      if (el.closest('.hp') || el.type === 'hidden') return;
      let msg = '';
      const v = el.type === 'checkbox' ? el.checked : el.value.trim();
      if (el.required && !v) msg = el.type === 'checkbox' ? 'Please confirm to continue.' : 'This field is required.';
      else if (el.type === 'email' && v && !emailRe.test(v)) msg = 'Please enter a valid email address.';
      if (!msg) { el.removeAttribute('aria-invalid'); return; }
      el.setAttribute('aria-invalid', 'true');
      if (el.type === 'checkbox') { const e = $(`[data-err="${el.name}"]`, form); if (e) e.textContent = msg; }
      else { const f = el.closest('.fld'); f.classList.add('is-bad'); const m = document.createElement('span'); m.className = 'msg'; m.textContent = msg; m.id = 'm-' + Math.random().toString(36).slice(2); f.appendChild(m); el.setAttribute('aria-describedby', m.id); }
      if (!first) first = el;
    });
    if (first) first.focus();
    return !first;
  }

  /* ---------- Demo scheduler ---------- */
  const daysEl = $('#days'), timesEl = $('#times');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local time';
  $('#tz').textContent = 'Times shown in ' + tz.replace(/_/g, ' ');
  const days = [];
  const d0 = new Date(); d0.setHours(0, 0, 0, 0);
  for (let d = new Date(d0); days.length < 10;) { d.setDate(d.getDate() + 1); if (d.getDay() % 6) days.push(new Date(d)); }
  let selDay = 0, selTime = null;
  daysEl.innerHTML = days.map((d, i) => `<button type="button" class="day" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-d="${i}" aria-label="${d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}"><small>${d.toLocaleDateString(undefined, { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString(undefined, { month: 'short' })}</small></button>`).join('');
  function renderTimes() {
    const slots = ['09:00', '09:30', '10:00', '11:00', '11:30', '13:00', '14:00', '14:30', '15:30', '16:00'];
    timesEl.innerHTML = slots.map((s, i) => {
      const busy = (selDay * 7 + i * 3) % 5 === 0;
      return `<button type="button" class="time" role="radio" aria-checked="${selTime === s}" data-t="${s}" ${busy ? 'disabled aria-label="' + s + ' unavailable"' : ''}>${s}</button>`;
    }).join('');
  }
  renderTimes();
  daysEl.addEventListener('click', (e) => {
    const b = e.target.closest('.day'); if (!b) return;
    selDay = +b.dataset.d; selTime = null;
    $$('.day', daysEl).forEach((x) => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
    renderTimes();
  });
  daysEl.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
    e.preventDefault();
    const n = Math.max(0, Math.min(days.length - 1, selDay + (e.key === 'ArrowRight' ? 1 : -1)));
    const b = $(`[data-d="${n}"]`, daysEl); b.click(); b.focus();
  });
  timesEl.addEventListener('click', (e) => {
    const b = e.target.closest('.time:not(:disabled)'); if (!b) return;
    selTime = b.dataset.t;
    $$('.time', timesEl).forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    $('[data-err="slot"]').textContent = '';
  });

  const fDemo = $('#form-demo'), fContact = $('#form-contact'), done = $('#form-done');
  let lastBooking = null;
  const recent = new Set();
  function spam(form) { return $('input[name="website"]', form).value !== ''; }
  fDemo.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = validate(fDemo);
    if (!selTime) { $('[data-err="slot"]').textContent = 'Please choose a time for your demo.'; if (ok) daysEl.querySelector('[aria-checked="true"]').focus(); ok = false; }
    if (!ok) return;
    if (spam(fDemo)) return;
    const data = Object.fromEntries(new FormData(fDemo));
    const dupe = data.email.toLowerCase() + days[selDay].toDateString() + selTime;
    if (recent.has(dupe)) { toast('You already have this slot booked.'); return; }
    recent.add(dupe);
    const [hh, mm] = selTime.split(':').map(Number);
    const start = new Date(days[selDay]); start.setHours(hh, mm);
    lastBooking = { start, name: data.name, org: data.org };
    track('generate_lead', { form: 'demo', interest: data.interest, size: data.size });
    track('booking_handoff', { provider: 'microsoft_bookings' });
    showDone('You\'re booked in', `Thanks ${esc(data.name.split(' ')[0])} — your demo is confirmed for <strong>${start.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })} at ${selTime}</strong>. A calendar invite and video link are on the way to ${esc(data.email)}.`, true);
    fDemo.reset(); selTime = null; renderTimes();
  });
  fContact.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate(fContact) || spam(fContact)) return;
    const data = Object.fromEntries(new FormData(fContact));
    track('generate_lead', { form: 'contact', topic: data.topic });
    showDone('Message sent', `Thanks ${esc(data.name.split(' ')[0])} — our team will reply to ${esc(data.email)} within one business day.`, false);
    fContact.reset();
  });
  function showDone(title, html, ics) {
    fDemo.hidden = fContact.hidden = true; $('.form-tabs').hidden = true;
    $('#done-title').textContent = title; $('#done-text').innerHTML = html;
    $('#ics').hidden = !ics; done.hidden = false; done.focus();
  }
  $('#form-reset').addEventListener('click', () => { done.hidden = true; $('.form-tabs').hidden = false; setFormTab('demo', true); });
  $('#ics').addEventListener('click', () => {
    if (!lastBooking) return;
    const s = lastBooking.start; const e2 = new Date(s.getTime() + 30 * 60000);
    const f = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Perpetua Foundry//Demo//EN', 'BEGIN:VEVENT', 'UID:' + uid('demo') + '@perpetuafoundry.ai', 'DTSTAMP:' + f(new Date()), 'DTSTART:' + f(s), 'DTEND:' + f(e2), 'SUMMARY:Perpetua LIS demo', 'DESCRIPTION:Tailored Perpetua LIS demo for ' + lastBooking.org, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'perpetua-lis-demo.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  const fTabs = $$('.form-tabs [role="tab"]');
  function setFormTab(key, focus) {
    if (!done.hidden) { done.hidden = true; $('.form-tabs').hidden = false; }
    fTabs.forEach((b) => { const on = b.dataset.ftab === key; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    fDemo.hidden = key !== 'demo'; fContact.hidden = key !== 'contact';
  }
  fTabs.forEach((b) => {
    b.addEventListener('click', () => setFormTab(b.dataset.ftab));
    b.addEventListener('keydown', (e) => { if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { const o = fTabs.find((x) => x !== b); setFormTab(o.dataset.ftab, true); } });
  });

  /* ---------- Newsletter ---------- */
  $('#news').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#news-email'); const msg = $('.news__msg');
    if (!emailRe.test(inp.value.trim())) { msg.textContent = 'Please enter a valid email address.'; inp.focus(); return; }
    track('newsletter_signup'); msg.textContent = 'Thanks — you\'re subscribed. Check your inbox to confirm.'; inp.value = '';
  });

  /* ---------- Resources ---------- */
  $$('.res__filters button').forEach((b) => b.addEventListener('click', () => {
    $$('.res__filters button').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    $$('.res').forEach((r) => r.classList.toggle('is-hidden', b.dataset.filter !== 'all' && r.dataset.kind !== b.dataset.filter));
  }));
  const ARTICLES = [
    ['The capability gap is real — and training alone won\'t close it', 'Organisations invest heavily in learning every year, yet most still cannot answer one simple question: are we actually building capability? Completions and certificates measure activity, not ability. In this article we explore why the gap persists and what learning intelligence changes.'],
    ['From LMS to LXP to learning intelligence: what comes next', 'The LMS managed content. The LXP improved the experience. The next step connects skills, work and outcomes so organisations can see — and steer — capability growth in real time.'],
    ['Embedding learning in the flow of work: a practical guide', 'Learning sticks when it happens close to the work. This guide covers practical ways to bring short, relevant learning moments into everyday workflows, and how to measure the difference.']
  ];
  $$('.res').forEach((r) => r.addEventListener('click', (e) => {
    e.preventDefault();
    const [t, b] = ARTICLES[+r.dataset.article];
    openModal(`<span class="tag">${r.dataset.kind === 'guide' ? 'Guide' : 'Insight'}</span><h2 id="modal-title" style="margin-top:14px">${t}</h2><p class="modal__sub">${b}</p><p class="fine">One of 5 existing Perpetua Foundry articles to be migrated with formatting and SEO metadata. Full article opens on its own page in the live site.</p><div class="modal__actions"><a class="btn btn--primary" href="#demo" data-close="modal">Talk to us about this</a></div>`);
    track('article_open', { article: t });
  }));

  /* ---------- FAQ ---------- */
  const FAQ = [
    ['What is Perpetua LIS?', 'Perpetua LIS is an AI-native learning intelligence system. It helps organisations create courses from their own content, deliver learning in the flow of work, assess real skills and report on capability growth — in one platform.'],
    ['How is it different from an LMS or LXP?', 'An LMS manages content and tracks completions; an LXP improves discovery and experience. Perpetua LIS focuses on outcomes — connecting learning to skills and showing whether capability is actually improving.'],
    ['Can I buy online, or do I need to talk to sales?', 'Both. Starter, Growth and Scale can be purchased online with monthly or annual billing. For 1,000+ learners or custom terms, choose Enterprise and our team will tailor a proposal.'],
    ['What happens after I pay?', 'Once your payment is verified, your organisation workspace is created automatically, your plan and learner limits are applied, and your administrator receives a secure first-login link — usually within minutes.'],
    ['Can I change or cancel my plan?', 'Yes. Use the billing portal to upgrade, downgrade, update payment details, download invoices or cancel. Cancellations take effect at the end of your current billing term.'],
    ['Which features are available today?', 'AI course creation, learning delivery, assessments and reporting & admin are core to Perpetua LIS 1.0. Anything marked “Planned” is on our roadmap and not included in current plans.'],
    ['How is our data protected?', 'Payments are handled by a PCI-compliant provider, so card details never touch our servers. Each organisation\'s data is kept separate with role-based permissions. Contact us for our security documentation.']
  ];
  const acc = $('#acc');
  acc.innerHTML = FAQ.map(([q, a], i) => `<div class="acc__item reveal"><h3><button class="acc__q" type="button" aria-expanded="false" aria-controls="faq-${i}" id="faq-q-${i}">${q}<span class="acc__plus" aria-hidden="true"></span></button></h3><div class="acc__a" id="faq-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${a}</p></div></div></div>`).join('');
  $$('.acc__item', acc).forEach((el) => io.observe(el));
  acc.addEventListener('click', (e) => {
    const b = e.target.closest('.acc__q'); if (!b) return;
    const item = b.closest('.acc__item'); const open = !item.classList.contains('is-open');
    item.classList.toggle('is-open', open); b.setAttribute('aria-expanded', String(open));
    if (open) track('faq_open', { q: b.textContent });
  });

  /* ---------- Cookie consent ---------- */
  const cookie = $('#cookie');
  function saveConsent(c) {
    store.set('pf_consent', { ...c, ts: Date.now() });
    cookie.hidden = true;
    window.dataLayer.push({ event: 'consent_update', analytics_storage: c.analytics ? 'granted' : 'denied', ad_storage: c.marketing ? 'granted' : 'denied' });
    toast('Privacy preferences saved');
  }
  if (!store.get('pf_consent')) setTimeout(() => { cookie.hidden = false; }, 1200);
  cookie.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ck]'); if (!b) return;
    const prefs = $('#cookie-prefs');
    if (b.dataset.ck === 'accept') saveConsent({ analytics: true, marketing: true });
    if (b.dataset.ck === 'reject') saveConsent({ analytics: false, marketing: false });
    if (b.dataset.ck === 'custom') {
      if (prefs.hidden) { prefs.hidden = false; b.textContent = 'Save choices'; }
      else saveConsent({ analytics: $('#ck-analytics').checked, marketing: $('#ck-marketing').checked });
    }
  });

  /* ---------- Chatbot ---------- */
  const chat = $('#chat'), fab = $('.chat-fab'), log = $('#chat-log'), chips = $('#chat-chips'), cform = $('#chat-form'), cin = $('#chat-input');
  let chatStarted = false;
  const KB = [
    { k: ['price', 'pricing', 'cost', 'plan', 'how much', 'subscription', 'annual', 'monthly'], a: 'We offer three self-service plans — <b>Starter</b> (up to 50 learners), <b>Growth</b> (up to 250) and <b>Scale</b> (up to 1,000) — billed monthly or annually (annual saves about 2 months). Enterprise is available for larger teams.', acts: [['See plans', '#pricing'], ['Talk to sales', '#demo|contact']] },
    { k: ['demo', 'walkthrough', 'call', 'meeting', 'book'], a: 'Happy to set that up. A tailored 30-minute demo covers course creation, delivery and reporting for your use case.', acts: [['Book a demo', '#demo']] },
    { k: ['feature', 'course', 'ai', 'create', 'author', 'content'], a: 'Perpetua LIS covers four core areas: <b>AI course creation</b> from your own content, <b>learning delivery</b> with role-based paths, <b>assessments</b> that measure skills, and <b>reporting & admin</b>. Want to see them?', acts: [['Take the product tour', '#tour'], ['Book a demo', '#demo']] },
    { k: ['secur', 'privacy', 'data', 'gdpr', 'iso', 'soc', 'compliance'], a: 'Payments go through a PCI-compliant provider and card details never touch our servers. Each organisation\'s data is kept separate with role-based permissions. For formal security documentation, our team can help directly.', acts: [['Security overview', '#security'], ['Ask the team', '#demo|contact']] },
    { k: ['onboard', 'setup', 'set up', 'start', 'after pay', 'access', 'login', 'log in'], a: 'After a verified payment your workspace is created automatically, your plan and learner limits are applied, and your admin gets a secure first-login link — usually within minutes.', acts: [['Choose a plan', '#pricing']] },
    { k: ['cancel', 'refund', 'upgrade', 'downgrade', 'invoice', 'billing', 'renew'], a: 'You can upgrade, downgrade, update payment details, download invoices or cancel anytime from the billing portal. Cancellations take effect at the end of your current term.', acts: [['See FAQs', '#faq']] },
    { k: ['lms', 'lxp', 'different', 'compare', 'talentlms', 'learnupon'], a: 'Traditional LMS/LXP tools manage content and track completions. Perpetua LIS focuses on <b>capability</b> — connecting learning to skills and showing whether people are actually improving.', acts: [['See the platform', '#platform']] },
    { k: ['integrat', 'hris', 'sso', 'api', 'slack', 'teams'], a: 'Broader integrations are on our roadmap and marked as <b>Planned</b>. I don\'t want to over-promise — our team can confirm what\'s possible for your setup.', acts: [['View roadmap', '#roadmap'], ['Ask the team', '#demo|contact']] },
    { k: ['provider', 'rto', 'trainer', 'training company'], a: 'Training providers use Perpetua LIS to build courses faster, run cohorts for multiple clients and share outcome reports.', acts: [['Training providers', '#solutions|providers']] },
    { k: ['hello', 'hi', 'hey'], a: 'Hi! I can help with features, pricing, demos or getting started. What would you like to know?' }
  ];
  function bot(html, acts) {
    const typing = document.createElement('div'); typing.className = 'msg msg--bot msg--typing'; typing.innerHTML = '<i></i><i></i><i></i>';
    log.appendChild(typing); log.scrollTop = log.scrollHeight;
    setTimeout(() => {
      typing.remove();
      const m = document.createElement('div'); m.className = 'msg msg--bot';
      m.innerHTML = `<p>${html}</p>` + (acts ? `<div class="msg__acts">${acts.map(([l, h]) => `<button type="button" data-go="${h}">${l}</button>`).join('')}</div>` : '');
      log.appendChild(m); log.scrollTop = log.scrollHeight;
    }, reduce ? 50 : 700);
  }
  function me(t) { const m = document.createElement('div'); m.className = 'msg msg--me'; m.textContent = t; log.appendChild(m); log.scrollTop = log.scrollHeight; }
  function answer(q) {
    const s = q.toLowerCase();
    if (/human|person|agent|someone|real/.test(s)) return handover();
    const hit = KB.find((x) => x.k.some((k) => s.includes(k)));
    track('chat_question', { matched: !!hit });
    if (hit) bot(hit.a, hit.acts);
    else bot('I\'m not certain about that one, and I don\'t want to guess. Would you like me to pass your question to a member of the Perpetua Foundry team?', [['Yes, talk to a person', 'handover'], ['See FAQs', '#faq']]);
  }
  function handover() {
    track('chat_handover');
    const typing = document.createElement('div'); typing.className = 'msg msg--bot';
    typing.innerHTML = `<p>I'll connect you with our team. Share your details and they'll pick up this conversation — usually within one business day.</p><form data-ho novalidate><input name="n" placeholder="Your name" aria-label="Your name" autocomplete="name" required><input name="e" type="email" placeholder="Work email" aria-label="Work email" autocomplete="email" required><label><input type="checkbox" name="c" required>I consent to sharing my details and this chat summary with Perpetua Foundry.</label><button class="btn btn--primary btn--sm" type="submit">Send to the team</button></form>`;
    log.appendChild(typing); log.scrollTop = log.scrollHeight;
    $('input', typing).focus();
  }
  log.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-ho]'); if (!f) return;
    e.preventDefault();
    const n = f.n.value.trim(), em = f.e.value.trim();
    if (!n || !emailRe.test(em) || !f.c.checked) { toast(!f.c.checked ? 'Please tick the consent box to continue.' : 'Please add your name and a valid email.'); return; }
    f.replaceWith(Object.assign(document.createElement('p'), { textContent: 'Sent ✓' }));
    track('generate_lead', { form: 'chat_handover' });
    bot(`Thanks ${esc(n.split(' ')[0])}! I've passed this conversation to the team. They'll reply to ${esc(em)} soon.`);
  });
  log.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]'); if (!b) return;
    const [hash, extra] = b.dataset.go.split('|');
    if (hash === 'handover') return handover();
    if (window.innerWidth < 720) closeChat();
    if (extra === 'contact') setFormTab('contact');
    if (extra && hash === '#solutions') setSolution(extra);
    document.querySelector(hash).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
  const CHIPS = ['What does it cost?', 'Show me the features', 'How does onboarding work?', 'Is my data secure?', 'Book a demo'];
  chips.innerHTML = CHIPS.map((c) => `<button type="button">${c}</button>`).join('');
  chips.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { me(b.textContent); answer(b.textContent); } });
  cform.addEventListener('submit', (e) => { e.preventDefault(); const v = cin.value.trim(); if (!v) return; me(v); cin.value = ''; answer(v); });
  function openChat() {
    chat.hidden = false; fab.setAttribute('aria-expanded', 'true');
    if (!chatStarted) { chatStarted = true; bot('Hi, I\'m the Perpetua Assistant — an <b>AI assistant</b> trained on Perpetua Foundry\'s approved content. I can help with features, pricing, demos and getting started. You can ask for a person anytime.'); track('chat_open'); }
    setTimeout(() => cin.focus(), 50);
  }
  function closeChat() { chat.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  $('[data-close="chat"]').addEventListener('click', closeChat);
  $('[data-handover]').addEventListener('click', () => { if (chat.hidden) openChat(); handover(); });

  /* ---------- Global openers ---------- */
  const POLICY = {
    privacy: ['Privacy Policy', 'Perpetua Foundry will supply approved Privacy Policy wording. This page will explain what personal information we collect (for example, enquiry, demo and purchase details), how it is used, who it is shared with (such as our payment and CRM providers) and how to access or delete it.'],
    terms: ['Terms of Service', 'Perpetua Foundry will supply approved Terms of Service and subscription terms, covering plans, billing, renewals, cancellations and acceptable use.']
  };
  function video() {
    const scenes = [
      ['Billions invested in learning.', '<em>Little proof</em> it builds capability.'],
      ['Meet Perpetua LIS.', 'The AI-native <em>learning intelligence</em> system.'],
      ['Create courses in minutes.', 'Deliver learning <em>in the flow of work</em>.'],
      ['Measure real skills.', 'Prove <em>capability growth</em>.']
    ];
    openModal(`<h2 id="modal-title">Perpetua LIS overview</h2><div class="vid"><div class="vid__stage">${scenes.map((s, i) => `<div class="vid__scene ${i === 0 ? 'is-on' : ''}"><div><h3>${s[0]}<br>${s[1]}</h3></div></div>`).join('')}</div><div class="vid__bar"><i></i></div></div><div class="vid__ctrl"><span>Placeholder animation — the PF-supplied product video will be embedded here.</span><a class="btn btn--primary btn--sm" href="#demo" data-close="modal">Book a demo</a></div>`, { wide: true, onClose: () => clearInterval(vt) });
    const sc = $$('.vid__scene', mContent), bar = $('.vid__bar i', mContent);
    let k = 0, t = 0;
    const vt = setInterval(() => {
      t += 50; bar.style.width = Math.min(100, t / (scenes.length * 3000) * 100) + '%';
      const nk = Math.min(scenes.length - 1, Math.floor(t / 3000));
      if (nk !== k) { sc[k].classList.remove('is-on'); sc[nk].classList.add('is-on'); k = nk; }
      if (t >= scenes.length * 3000) { t = 0; }
    }, 50);
    track('video_play');
  }
  function login() {
    openModal(`<h2 id="modal-title">Log in to Perpetua LIS</h2><p class="modal__sub">Existing customers sign in to the platform. In production this button goes straight to the Perpetua LIS login page.</p><form id="login-form" novalidate><label class="fld"><span>Work email</span><input type="email" name="email" autocomplete="email" required></label><div class="modal__actions"><button class="btn btn--primary" type="submit">Continue to sign in</button><a class="btn btn--text" href="#pricing" data-close="modal">New here? See plans</a></div></form>`);
    $('#login-form').addEventListener('submit', (e) => { e.preventDefault(); if (validate(e.target)) { closeModal(); toast('Prototype: this would continue to app.perpetualis.ai'); } });
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (o) {
      const k = o.dataset.open;
      if (k === 'chat') openChat();
      if (k === 'video') video();
      if (k === 'login') login();
      if (k === 'cookies') { cookie.hidden = false; const c = consent(); $('#ck-analytics').checked = !!c.analytics; $('#ck-marketing').checked = !!c.marketing; $('#cookie-prefs').hidden = false; $('[data-ck="custom"]').textContent = 'Save choices'; $('[data-ck="custom"]').focus(); }
    }
    const pol = e.target.closest('[data-policy]');
    if (pol) {
      const [t, b] = POLICY[pol.dataset.policy];
      const wasCheckout = !modal.hidden;
      if (wasCheckout) { toast(t + ': PF-supplied approved wording will be linked here.'); return; }
      openModal(`<h2 id="modal-title">${t}</h2><div class="policy"><p>${b}</p><p class="fine">Policy pages (Privacy, Terms, Cookies) use Perpetua Foundry-supplied approved wording.</p></div><div class="modal__actions"><button class="btn btn--dark" type="button" data-close="modal">Close</button></div>`);
    }
  });

  $('#yr').textContent = new Date().getFullYear();
  onScroll();
})();
