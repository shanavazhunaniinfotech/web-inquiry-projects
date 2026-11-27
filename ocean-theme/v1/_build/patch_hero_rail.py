"""One-off: hero slide controls become numbered progress circles on the right; arrows, counter and pause button removed."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
home = os.path.join(HERE, 'home.py'); s = open(home).read()
i = s.index('  <div class="container hero__controls">'); j = s.index('    </div>\n  </div>\n', s.index('data-hero-next', i)) + len('    </div>\n  </div>\n')
RING = '<svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="22"/><circle class="ring-fill" cx="24" cy="24" r="22"/></svg>'
dots = ''.join(f'    <button class="hero__dot{" is-active" if n == 1 else ""}" role="tab" aria-selected="{"true" if n == 1 else "false"}" data-label="Slide {n}: {t}" aria-label="Slide {n}: {t}">{RING}<span>{n}</span></button>\n' for n, t in ((1, 'Necklaces'), (2, 'Pearls'), (3, 'Bridal')))
s = s[:i] + '  <div class="hero__rail" role="tablist" aria-label="Choose slide. Press the current slide to pause or play">\n' + dots + '  </div>\n' + s[j:]
open(home, 'w').write(s)

p = os.path.join(ROOT, 'script.js'); s = open(p).read()
pairs = [
 ("dots.forEach(function (d, i) { on(d, 'click', function () { goSlide(i); }); });\n    on($('[data-hero-prev]', hero), 'click', function () { goSlide(si - 1); });\n    on($('[data-hero-next]', hero), 'click', function () { goSlide(si + 1); });\n    var pauseBtn = $('[data-hero-pause]', hero);\n    var setPaused = function (v) { paused = v; hero.classList.toggle('is-paused', v); if (pauseBtn) pauseBtn.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow'); schedule(); };\n    on(pauseBtn, 'click', function () { setPaused(!paused); });",
  "dots.forEach(function (d, i) { on(d, 'click', function () { if (i === si) setPaused(!paused); else goSlide(i); }); });\n    var setPaused = function (v) { paused = v; hero.classList.toggle('is-paused', v); labelDots(); schedule(); };"),
 ("      schedule();\n    };\n    dots.forEach", "      labelDots();\n      schedule();\n    };\n    var labelDots = function () { dots.forEach(function (d, i) { d.setAttribute('aria-label', d.dataset.label + (i === si ? (paused ? ', paused. Press to play' : ', playing. Press to pause') : '')); }); };\n    dots.forEach"),
]
for a, b in pairs:
    assert s.count(a) == 1, a[:80]; s = s.replace(a, b)
open(p, 'w').write(s)

c = os.path.join(ROOT, 'ready.css'); s = open(c).read()
s += """
/* hero: numbered progress circles on the right replace the tab row, counter, arrows and pause button */
.hero__rail { position: absolute; z-index: 3; right: clamp(20px, 3vw, 48px); top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 14px; }
.hero__dot { position: relative; display: grid; place-items: center; width: 48px; height: 48px; padding: 0; border-radius: 50%; color: rgba(255,255,255,.72); background: rgba(0,0,0,.18); backdrop-filter: blur(6px); transition: background-color .3s, color .3s; min-height: 0; }
.hero__dot:hover { background: rgba(255,255,255,.14); color: #fff; }
.hero__dot.is-active { color: #fff; background: rgba(255,255,255,.12); }
.hero__dot svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.hero__dot circle { fill: none; stroke-width: 2; }
.hero__dot .ring-bg { stroke: rgba(255,255,255,.3); }
.hero__dot .ring-fill { stroke: var(--hero-accent, #fff); stroke-linecap: round; stroke-dasharray: 138.3; stroke-dashoffset: 138.3; transition: stroke .8s; }
.hero__dot.is-active .ring-fill { animation: ring-fill var(--slide-ms, 6500ms) linear forwards; }
.hero.is-paused .hero__dot.is-active .ring-fill { animation-play-state: paused; }
.hero__dot span { position: relative; font-family: var(--f-label); font-weight: 700; font-size: 14px; letter-spacing: .02em; }
.hero__dot:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
@keyframes ring-fill { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .hero__dot.is-active .ring-fill { animation: none; stroke-dashoffset: 0; } }
@media (max-width: 749px) {
  .hero__rail { top: 16px; right: 16px; transform: none; flex-direction: row; gap: 10px; }
  .hero__dot { width: 44px; height: 44px; }
}
"""
open(c, 'w').write(s)
print('hero rail applied')
