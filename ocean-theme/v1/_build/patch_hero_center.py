"""One-off: each hero slide carries its own eyebrow, heading, text and buttons (no gap on shorter slides); banner text centred vertically."""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
home = os.path.join(HERE, 'home.py'); s = open(home).read()
start = s.index('    <div class="hero__copy">\n'); end = s.index('    <div class="hero__chip" data-hero-chip>')
TEXT = [
 ('<h1 class="display">Gold that <em>moves</em><br>with you.</h1>', 'Chains, pendants and hoops in recycled 14k gold, made to be layered and worn every single day.'),
 ('<p class="display" role="heading" aria-level="2">Pearls, <em>quietly</em><br>modern.</p>', 'Baroque freshwater pearls on fine gold chains. No two are the same, so yours is one of a kind.'),
 ('<p class="display" role="heading" aria-level="2">Rings for <em>every</em><br>chapter.</p>', 'Solitaires, stacking bands and wedding rings, with free engraving and resizing within 60 days.'),
]
for h, l in TEXT: assert h in s[start:end] and l in s[start:end], h
parts = []
for n, (h, l) in enumerate(TEXT):
    attrs = ' is-active" data-slide-text="0">' if n == 0 else f'" data-slide-text="{n}" aria-hidden="true" inert>'
    parts.append(f'''        <div class="hero__text{attrs}
          <p class="eyebrow"><span class="dot"></span> {{SLIDES[{n}]['eyebrow']}}</p>
          {h}
          <p class="lead">{l}</p>
          <div class="hero__ctas">
            <a class="btn btn--primary" href="{{SLIDES[{n}]['href']}}">{{SLIDES[{n}]['cta']}}</a>
            <a class="btn btn--ghost" href="#bundle">Build a stack</a>
          </div>
        </div>
''')
s = s[:start] + '    <div class="hero__copy">\n      <div class="hero__slides-text">\n' + ''.join(parts) + '      </div>\n    </div>\n' + s[end:]
open(home, 'w').write(s)

p = os.path.join(ROOT, 'script.js'); s = open(p).read()
pairs = [
 ("slideTexts.forEach(function (t, i) { t.classList.toggle('is-active', i === si); t.setAttribute('aria-hidden', String(i !== si)); });",
  "slideTexts.forEach(function (t, i) { t.classList.toggle('is-active', i === si); t.setAttribute('aria-hidden', String(i !== si)); t.inert = i !== si; });"),
 ("        $('[data-hero-eyebrow]', hero).textContent = m.eyebrow;\n        var cta = $('[data-hero-cta]', hero); cta.textContent = m.cta; cta.href = m.href;\n", ""),
]
for a, b in pairs:
    assert s.count(a) == 1, a[:70]; s = s.replace(a, b)
open(p, 'w').write(s)

c = os.path.join(ROOT, 'ready.css'); s = open(c).read()
s += """
/* banner: text block centred vertically; each slide's block centred in the shared stack, so shorter slides leave no gap */
.hero.hero--v2 { justify-content: center; }
.hero--v2 .hero__text { align-self: center; }
.hero--v2 .hero__text .eyebrow { margin-bottom: 18px; }
.hero--v2 .hero__text:not(.is-active) .hero__ctas, .hero--v2 .hero__text:not(.is-active) .eyebrow { opacity: 0; }
@media (min-width: 1200px) { .hero--v2 .hero__copy { max-width: 1000px; } }
"""
open(c, 'w').write(s)
print('hero centre applied')
