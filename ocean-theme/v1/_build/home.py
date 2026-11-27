import json
from partials import U, ARR_L, ARR_R, CHEV

SLIDES = [
    {'id': 10, 'cta': 'Shop necklaces', 'href': 'collection/?c=necklaces', 'eyebrow': 'New season · The Gold Edit'},
    {'id': 1, 'cta': 'Shop pearls', 'href': 'product/?id=1', 'eyebrow': 'Best seller'},
    {'id': 14, 'cta': 'Shop bridal', 'href': 'collection/?c=bridal', 'eyebrow': 'Bridal · Free engraving'},
]


def home():
    slides = json.dumps(SLIDES).replace('"', '&quot;')
    hero = f'''<!-- 01 SLIDESHOW -->
<section class="hero hero--v2" data-section="Slideshow" data-slide="0" data-slides="{slides}" aria-roledescription="carousel" aria-label="Featured">
  <div class="hero__media">
    <div class="hero__frame">
      <picture><source media="(max-width: 749px)" srcset="{U('1633810542706-90e5ff7557be', 480, 880, (0.5, 0.28, 1))} 480w, {U('1633810542706-90e5ff7557be', 720, 1320, (0.5, 0.28, 1))} 720w, {U('1633810542706-90e5ff7557be', 960, 1760, (0.5, 0.28, 1))} 960w" sizes="100vw" width="720" height="1320"><img class="hero__img is-active" style="--pos: 50% 28%" src="{U('1633810542706-90e5ff7557be', 1600)}" srcset="{U('1633810542706-90e5ff7557be', 1000)} 1000w, {U('1633810542706-90e5ff7557be', 1600)} 1600w, {U('1633810542706-90e5ff7557be', 2200)} 2200w" sizes="100vw" alt="Woman wearing a bold gold link chain necklace" width="2000" height="1333" fetchpriority="high"></picture>
      <picture><source media="(max-width: 749px)" srcset="{U('1611085583191-a3b181a88401', 480, 880, (0.6, 0.4, 1))} 480w, {U('1611085583191-a3b181a88401', 720, 1320, (0.6, 0.4, 1))} 720w, {U('1611085583191-a3b181a88401', 960, 1760, (0.6, 0.4, 1))} 960w" sizes="100vw" width="720" height="1320"><picture><source media="(max-width: 749px)" srcset="{U('1622398925373-3f91b1e275f5', 480, 880, (0.5, 0.55, 1))} 480w, {U('1622398925373-3f91b1e275f5', 720, 1320, (0.5, 0.55, 1))} 720w, {U('1622398925373-3f91b1e275f5', 960, 1760, (0.5, 0.55, 1))} 960w" sizes="100vw" width="720" height="1320"><img class="hero__img" style="--pos: 60% 40%" src="{U('1622398925373-3f91b1e275f5', 1600)}" srcset="{U('1622398925373-3f91b1e275f5', 1000)} 1000w, {U('1622398925373-3f91b1e275f5', 1600)} 1600w, {U('1622398925373-3f91b1e275f5', 2200)} 2200w" sizes="100vw" alt="Freshwater pearl pendant on a fine gold chain" width="2000" height="1333" loading="lazy" fetchpriority="low"></picture></picture>
      <img class="hero__img" style="--pos: 50% 55%" src="{U('1622398925373-3f91b1e275f5', 2000)}" alt="Two gold wedding bands resting on satin" width="2000" height="1333" loading="lazy">
    </div>
    <div class="hero__shade" aria-hidden="true"></div>
  </div>
  <div class="container hero__content">
    <div class="hero__copy">
      <p class="eyebrow"><span class="dot"></span> <span data-hero-eyebrow>{SLIDES[0]['eyebrow']}</span></p>
      <div class="hero__slides-text">
        <div class="hero__text is-active" data-slide-text="0">
          <h1 class="display">Gold that <em>moves</em><br>with you.</h1>
          <p class="lead">Chains, pendants and hoops in recycled 14k gold, made to be layered and worn every single day.</p>
        </div>
        <div class="hero__text" data-slide-text="1" aria-hidden="true">
          <p class="display" role="heading" aria-level="2">Pearls, <em>quietly</em><br>modern.</p>
          <p class="lead">Baroque freshwater pearls on fine gold chains. No two are the same, so yours is one of a kind.</p>
        </div>
        <div class="hero__text" data-slide-text="2" aria-hidden="true">
          <p class="display" role="heading" aria-level="2">Rings for <em>every</em><br>chapter.</p>
          <p class="lead">Solitaires, stacking bands and wedding rings, with free engraving and resizing within 60 days.</p>
        </div>
      </div>
      <div class="hero__ctas">
        <a class="btn btn--primary" href="{SLIDES[0]['href']}" data-hero-cta>{SLIDES[0]['cta']}</a>
        <a class="btn btn--ghost" href="#bundle">Build a stack</a>
      </div>
    </div>
    <div class="hero__chip" data-hero-chip>
      <img src="{U('1633810542706-90e5ff7557be', 160, 160, (0.5, 0.32, 2))}" alt="" width="64" height="64" data-chip-img>
      <div>
        <p class="hero__chip-label">Featured piece</p>
        <p class="hero__chip-name" data-chip-name>Bold Link Chain</p>
        <p class="hero__chip-meta"><span data-chip-price data-money="310">$310.00</span></p>
      </div>
      <button class="hero__chip-add" aria-label="Choose options for Bold Link Chain" data-chip-add data-quick="10"><span aria-hidden="true">+</span></button>
    </div>
  </div>
  <div class="hero__rail" role="tablist" aria-label="Choose slide. Press the current slide to pause or play">
    <button class="hero__dot is-active" role="tab" aria-selected="true" data-label="Slide 1: Necklaces" aria-label="Slide 1: Necklaces"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="22"/><circle class="ring-fill" cx="24" cy="24" r="22"/></svg><span>1</span></button>
    <button class="hero__dot" role="tab" aria-selected="false" data-label="Slide 2: Pearls" aria-label="Slide 2: Pearls"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="22"/><circle class="ring-fill" cx="24" cy="24" r="22"/></svg><span>2</span></button>
    <button class="hero__dot" role="tab" aria-selected="false" data-label="Slide 3: Bridal" aria-label="Slide 3: Bridal"><svg viewBox="0 0 48 48" aria-hidden="true"><circle class="ring-bg" cx="24" cy="24" r="22"/><circle class="ring-fill" cx="24" cy="24" r="22"/></svg><span>3</span></button>
  </div>
</section>
'''
    usp = ['Recycled 14k &amp; 18k gold', 'Conflict-free stones', 'Free resizing within 60 days', 'Lifetime polishing', 'Hallmarked', 'Gift-boxed as standard']
    li = ''.join(f'<li>{u}</li>' for u in usp)
    marquee = f'''<section class="marquee" data-section="Scrolling text" aria-label="Our promises">
  <div class="marquee__track"><ul class="marquee__list">{li}</ul><ul class="marquee__list" aria-hidden="true">{li}</ul></div>
</section>
'''
    cats = [('rings', 'Rings', '1543294001-f7cd5d7fb516', 'Gold rings stacked together', 5), ('necklaces', 'Necklaces', '1599459183200-59c7687a0275', 'Layered gold necklaces', 7),
            ('earrings', 'Earrings', '1617038260897-41a1f14a8ca0', 'Twisted gold hoop earrings', 3), ('bracelets', 'Bracelets', '1596944924616-7b38e7cfac36', 'Gold chain bracelet on a wrist', 2),
            ('bridal', 'Bridal', '1631982690223-8aa4be0a2497', 'Diamond rings in a jewellery tray', 3), ('gifts-under-250', 'Gifts under $250', '1569397288884-4d43d6738fbd', 'Gold bar necklace with its gift box', 8)]
    cat_li = ''.join(f'''<li><a class="concern" href="collection.html?c={h}"><img src="{U(i, 700, 900)}" alt="{a}" width="350" height="450" loading="lazy"><span class="concern__body"><span class="concern__name">{t}</span><span class="concern__count">{n} pieces</span></span><span class="concern__arrow" aria-hidden="true">→</span></a></li>''' for h, t, i, a, n in cats)
    collections = f'''<section class="section" id="concerns" data-section="Collection list">
  <div class="container">
    <div class="section-head">
      <div><p class="eyebrow"><span class="idx">(01)</span> Shop by category</p><h2 class="h2">Find your<br>next favourite.</h2></div>
      <div class="section-head__side">
        <p class="muted">Six collections, all in recycled gold. Start anywhere: everything is designed to be worn together.</p>
        <div class="slider-nav">
          <button class="icon-btn icon-btn--outline" aria-label="Previous collections" data-scroll="#concern-track" data-dir="-1">{ARR_L}</button>
          <button class="icon-btn icon-btn--outline" aria-label="Next collections" data-scroll="#concern-track" data-dir="1">{ARR_R}</button>
        </div>
      </div>
    </div>
    <ul class="concern-track" id="concern-track">{cat_li}</ul>
  </div>
</section>
'''
    featured = '''<section class="section scheme-2" id="featured" data-section="Featured collection">
  <div class="container">
    <div class="section-head">
      <div><p class="eyebrow"><span class="idx">(02)</span> Best sellers</p><h2 class="h2">Pieces you’ll <em>never</em> take off.</h2></div>
      <div class="tabs" role="tablist" aria-label="Filter products">
        <button class="tab is-active" role="tab" aria-selected="true" data-tab="all">All</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="rings">Rings</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="necklaces">Necklaces</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="earrings">Earrings</button>
        <button class="tab" role="tab" aria-selected="false" data-tab="new">New</button>
      </div>
    </div>
    <ul class="product-grid" id="product-grid" aria-live="polite"></ul>
    <div class="center mt-40"><a class="btn btn--outline" href="collection.html">View all jewellery</a></div>
  </div>
</section>
'''
    story = f'''<section class="section story" data-section="Image with text (collage)">
  <div class="container story__grid">
    <div class="story__copy">
      <p class="eyebrow"><span class="idx">(03)</span> Our story</p>
      <h2 class="h2">Made to<br><em>last.</em></h2>
      <p class="lead">Fine jewellery made in small batches, from recycled gold and stones we can trace.</p>
      <ul class="story__points">
        <li><span class="story__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><div><strong>Recycled gold</strong><p>14k and 18k, hallmarked.</p></div></li>
        <li><span class="story__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M6 3h12l3 6-9 12L3 9z M3 9h18 M9 3l3 18 3-18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg></span><div><strong>Conflict-free stones</strong><p>Lab-grown or traceable.</p></div></li>
        <li><span class="story__icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span><div><strong>Lifetime care</strong><p>Free polishing, forever.</p></div></li>
      </ul>
      <div class="story__ctas"><a class="btn btn--primary" href="page.html">Read our story</a><a class="link-arrow" href="blog.html">Visit the journal <span aria-hidden="true">→</span></a></div>
    </div>
    <div class="story__media">
      <figure class="story__main"><img src="{U('1611652022419-a9419f74343d', 1000, 1250)}" alt="Woman wearing a fine gold chain and a small pendant" width="500" height="625" loading="lazy"></figure>
      <figure class="story__second"><img src="{U('1608042314453-ae338d80c427', 600, 600)}" alt="" width="300" height="300" loading="lazy"></figure>
      <div class="story__stat"><p class="story__stat-num">100%</p><p class="story__stat-text">recycled<br>gold.</p></div>
      <div class="story__rating"><p><strong>585</strong> hallmark on every piece</p></div>
      <div class="seal" aria-hidden="true">
        <svg viewBox="0 0 120 120"><defs><path id="circ2" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs><text><textPath href="#circ2" textLength="286" lengthAdjust="spacing">MADE TO LAST · WORN EVERY DAY ·</textPath></text></svg>
        <svg class="seal__mark" width="34" height="34" viewBox="0 0 32 32"><path d="M5 18c3.5-4 7-4 11 0s7.5 4 11 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M5 12.5c3.5-4 7-4 11 0s7.5 4 11 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/></svg>
      </div>
    </div>
  </div>
</section>
'''
    look_items = [(19, 'Paperclip Chain', '40 cm', 150, (0.6, 0.27, 2.4), '60%', '24%'), (18, 'Satin Ball Chain', '42 cm', 120, (0.57, 0.43, 2.4), '57%', '52%'), (17, 'Pebble Coin Necklace', '50 cm', 175, (0.5, 0.56, 2.2), '50%', '75%')]
    pins = ''.join(f'<button class="pin" style="--x:{x};--y:{y}" data-pin="{n + 1}" aria-label="{t}">{n + 1}</button>' for n, (pid, t, ty, pr, fp, x, y) in enumerate(look_items))
    rows = ''.join(f'''<li class="look__row" data-look="{n + 1}"><span class="look__n">{n + 1}</span><img src="{U('1599459183200-59c7687a0275', 160, 160, fp)}" alt="" width="56" height="56" loading="lazy"><div class="look__info"><a href="product.html?id={pid}"><strong>{t}</strong></a><span>14k Yellow gold · {ty}</span></div><span class="look__price" data-money="{pr}">${pr}.00</span><button class="look__add" data-add="{pid}" aria-label="Add {t} to bag">+</button></li>''' for n, (pid, t, ty, pr, fp, x, y) in enumerate(look_items))
    look = f'''<section class="section section--flush-top" data-section="Shop the look">
  <div class="container"><div class="look">
    <div class="look__media"><img src="{U('1599459183200-59c7687a0275', 1400)}" alt="Three gold necklaces layered at different lengths" width="1400" height="2090" loading="lazy">{pins}<span class="look__tag">3 pieces in this look</span></div>
    <div class="look__panel">
      <p class="eyebrow"><span class="idx">(04)</span> Shop the look</p>
      <h2 class="h2">The three-<br>length <em>layer.</em></h2>
      <p class="muted">A short, a middle and a long chain. Tap a number on the photo to find each piece, or add the whole layer.</p>
      <ol class="look__list">{rows}</ol>
      <div class="look__total"><span>Complete look</span><strong data-money="445">$445.00</strong></div>
      <button class="btn btn--primary btn--block btn--lg" data-add-look="19,18,17">Add all 3 to bag</button>
    </div>
  </div></div>
</section>
'''
    bento = f'''<section class="section scheme-3 features" id="features" data-section="Multicolumn">
  <div class="container">
    <div class="section-head section-head--light">
      <div><p class="eyebrow"><span class="idx">(05)</span> The Ocean promise</p><h2 class="h2">Fine jewellery.<br><em>Fair prices.</em></h2></div>
      <p class="muted section-head__side">What comes with every piece, whether it’s a <span class="nowrap"><span data-money="120">$120.00</span></span> chain or a diamond solitaire.</p>
    </div>
    <div class="bento">
      <article class="tile tile--a"><img class="tile__bg" src="{U('1631982690223-8aa4be0a2497', 1000, 1000)}" alt="" width="500" height="500" loading="lazy">
        <div class="tile__body"><p class="tile__num"><span>100</span><small>% recycled gold</small></p><h3>Gold with a smaller footprint</h3><p>Every piece is cast from recycled 14k or 18k gold and hallmarked by an independent assay office.</p></div></article>
      <article class="tile tile--b"><span class="tile__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        <p class="tile__num"><span>60</span><small>day returns</small></p>
        <div class="tile__text"><h3>Free resizing and returns</h3><p>Wrong size or changed your mind? Resizing and returns are free for 60 days.</p><a class="tile__link" href="page.html#shipping">How returns work <span aria-hidden="true">→</span></a></div></article>
      <article class="tile tile--c"><span class="tile__icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></span>
        <p class="tile__num"><span>2</span><small>year warranty</small></p><h3>Covered, then cared for</h3><p>Plus free lifetime polishing.</p></article>
      <article class="tile tile--d"><img class="tile__bg" src="{U('1569397288884-4d43d6738fbd', 700, 700)}" alt="" width="350" height="350" loading="lazy"><div class="tile__body"><p class="tile__num"><span>0</span><small>plastic</small></p><h3>Gift-ready packaging</h3></div></article>
    </div>
  </div>
</section>
'''
    bundle = '''<section class="section" id="bundle" data-section="Bundle builder">
  <div class="container">
    <div class="section-head">
      <div><p class="eyebrow"><span class="idx">(06)</span> Stack builder</p><h2 class="h2">Build your stack</h2></div>
      <div class="section-head__side"><p class="muted">Choose one piece from each step and add all three in one go.</p><ol class="bsteps-mini" aria-hidden="true"><li data-mini="0">1</li><li data-mini="1">2</li><li data-mini="2">3</li></ol></div>
    </div>
    <div class="builder">
      <div class="builder__steps" id="builder-steps"></div>
      <div class="builder__bar" aria-label="Your stack">
        <div class="builder__bar-info"><p class="builder__label">Your stack <span id="builder-count">1/3</span></p><div class="builder__meter"><span id="builder-meter"></span></div><p class="builder__save" id="builder-save" aria-live="polite"></p></div>
        <ul class="builder__picked" id="builder-picked"></ul>
        <div class="builder__totals"><s id="builder-compare"></s><strong id="builder-total"></strong></div>
        <button class="btn btn--light" id="builder-add" disabled>Add stack to bag</button>
      </div>
    </div>
  </div>
</section>
'''
    gift = f'''<section class="section scheme-2 body-feature" id="gifts" data-section="Image with text">
  <div class="container body-feature__grid">
    <div class="body-feature__media">
      <div class="body-feature__frame"><img class="parallax" src="{U('1515562141207-7a88fb7ce338', 1200, 1400)}" alt="Pearl necklace presented in an open gift box" width="1200" height="1400" loading="lazy"></div>
      <figure class="body-feature__inset"><img src="{U('1569397288884-4d43d6738fbd', 600, 600)}" alt="Gold bar necklace beside its dark green gift box" width="300" height="300" loading="lazy"></figure>
    </div>
    <div class="body-feature__copy">
      <p class="eyebrow"><span class="idx">(07)</span> The gift edit</p>
      <h2 class="h2">Gifts they’ll<br><em>actually</em> wear.</h2>
      <p class="lead">Every order arrives in our signature box with a polishing cloth and a handwritten card. Add free engraving to make it theirs.</p>
      <ul class="stat-row">
        <li><strong>Free</strong><span>Engraving on rings and pendants</span></li>
        <li><strong>2 days</strong><span>Express delivery, tracked</span></li>
        <li><strong><span data-money="250">$250.00</span></strong><span>Most gifts are under</span></li>
      </ul>
      <div class="hero__ctas"><a class="btn btn--primary" href="collection.html?c=gifts-under-250">Shop gifts</a><a class="btn btn--ghost" href="gift-card.html">Send a gift card</a></div>
    </div>
  </div>
</section>
'''
    revs = [('1610694955371-d4a3e0ce4b52', 'Customer wearing a fine gold pendant', 5, '“I haven’t taken it off in months”', 'It’s delicate but strong, and it hasn’t tarnished at all. I sleep and shower in it without thinking about it.', 'Amara O.', 'AO', '2 weeks ago', 1, 'Tide Pearl Pendant'),
            ('1620656798579-1984d9e87df7', 'Customer wearing the ginkgo leaf pendant', 5, '“The detail is even better in person”', 'You can see every vein in the leaf. It came beautifully boxed with a card, which made it a perfect birthday gift.', 'Lena K.', 'LK', '1 month ago', 7, 'Ginkgo Leaf Pendant'),
            ('1596944924616-7b38e7cfac36', 'Customer wearing stacked rings and a chain bracelet', 4, '“Resizing was quick and free”', 'My band was a little loose, so I sent it back. It came back resized within a week. I’d love more widths.', 'Sophie R.', 'SR', '3 weeks ago', 14, 'Classic Wedding Band'),
            ('1611652022419-a9419f74343d', 'Customer wearing a fine chain choker', 5, '“Finally, gold that doesn’t irritate”', 'I react to most costume jewellery, but these hoops are fine all day. The weight is just right.', 'Claire M.', 'CM', '2 months ago', 4, 'Twist Hoop Earrings'),
            ('1616837874254-8d5aaa63e273', 'Customer wearing a herringbone chain', 5, '“Like liquid gold”', 'The herringbone lies flat and catches the light beautifully. Worth every penny.', 'Nadia F.', 'NF', '1 week ago', 5, 'Herringbone Chain')]
    cards = ''.join(f'''<li class="review"><div class="review__media"><img src="{U(i, 700, 560)}" alt="{a}" width="350" height="280" loading="lazy"><a class="review__chip" href="product.html?id={pid}">{pn}</a></div>
      <div class="review__body"><h3>{t}</h3><p>{b}</p>
      <p class="review__who"><span class="review__avatar" aria-hidden="true">{ini}</span>{n}</p></div></li>''' for i, a, s, t, b, n, ini, d, pid, pn in revs)
    reviews = f'''<section class="section reviews" data-section="Testimonials">
  <div class="container">
    <div class="reviews__head">
      <div><p class="eyebrow">Testimonials</p><h2 class="h2">Notes from customers</h2></div>
    </div>
    <ul class="review-track" id="review-track">{cards}</ul>
    <div class="track-foot"><div class="track-progress" aria-hidden="true"><span data-track-bar="#review-track"></span></div>
      <div class="slider-nav"><button class="icon-btn icon-btn--outline" aria-label="Previous reviews" data-scroll="#review-track" data-dir="-1">{ARR_L}</button><button class="icon-btn icon-btn--outline" aria-label="Next reviews" data-scroll="#review-track" data-dir="1">{ARR_R}</button></div></div>
  </div>
</section>
'''
    journal = f'''<section class="section scheme-2" id="journal" data-section="Blog posts">
  <div class="container">
    <div class="section-head"><div><p class="eyebrow"><span class="idx">(09)</span> The Journal</p><h2 class="h2">Guides &amp; <em>stories.</em></h2></div><a class="btn btn--outline" href="blog.html">View all articles</a></div>
    <div class="journal">
      <a class="jfeat" href="article.html?id=1"><img src="{U('1631982690223-8aa4be0a2497', 1400, 1000)}" alt="Rings displayed in a jewellery tray" width="700" height="500" loading="lazy"><span class="jfeat__chip">Editor’s pick</span>
        <div class="jfeat__body"><p class="jfeat__meta">Guides · 5 min read · 18 Nov 2026</p><h3>How to find your ring size at home</h3><p>Three easy ways to measure, and what to do if you are between sizes.</p><span class="jfeat__cta">Read article <span aria-hidden="true">→</span></span></div></a>
      <div class="jside"><p class="mini-title">Latest articles</p><ol class="jlist">
        <li><a class="jitem" href="article.html?id=2"><span class="jitem__n">02</span><div class="jitem__text"><p class="post__meta">Styling · 4 min read</p><h3>Layering necklaces: the three-length rule</h3></div><div class="jitem__img"><img src="{U('1590548784585-643d2b9f2925', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
        <li><a class="jitem" href="article.html?id=3"><span class="jitem__n">03</span><div class="jitem__text"><p class="post__meta">Care · 3 min read</p><h3>Caring for gold vermeil so it lasts</h3></div><div class="jitem__img"><img src="{U('1561828995-aa79a2db86dd', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
        <li><a class="jitem" href="article.html?id=4"><span class="jitem__n">04</span><div class="jitem__text"><p class="post__meta">Materials · 6 min read</p><h3>Pearls 101: freshwater, baroque and keshi</h3></div><div class="jitem__img"><img src="{U('1515562141207-7a88fb7ce338', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
      </ol></div>
    </div>
  </div>
</section>
'''
    faqs = [('products', 'Is your jewellery solid gold or plated?', 'Our fine pieces are solid 14k or 18k recycled gold. Our everyday pieces are gold vermeil: a thick layer of gold over sterling silver. Each product page shows which it is.'),
            ('products', 'Is it safe for sensitive skin?', 'Yes. Everything is nickel-free and hypoallergenic. Our earring posts are solid gold or sterling silver.'),
            ('products', 'Can I add engraving?', 'Free engraving is available on rings and pendants, up to 12 characters. Engraved pieces can still be resized, but can’t be returned.'),
            ('orders', 'How long does delivery take?', 'Orders ship within 2 working days. Express delivery is free on orders over $100.00 and arrives in 1–2 working days.'),
            ('orders', 'What if my ring doesn’t fit?', 'Resizing is free within 60 days. Start a request from your account and we’ll send a prepaid label.'),
            ('orders', 'Do you ship internationally?', 'We ship to 32 countries. Prices, duties and taxes are shown in your local currency at checkout.')]
    items = ''.join(f'<details data-cat="{c}"{" open" if i == 0 else ""}><summary><span class="faq__num">{i + 1:02d}</span><span class="faq__q">{q}</span></summary><p>{a}</p></details>' for i, (c, q, a) in enumerate(faqs))
    faq = f'''<section class="section" id="faq" data-section="Collapsible content">
  <div class="container faq">
    <div class="faq__aside">
      <p class="eyebrow"><span class="idx">(10)</span> Help centre</p>
      <h2 class="h2">Questions,<br><em>answered.</em></h2>
      <div class="faq__tabs" role="tablist" aria-label="Question categories">
        <button class="tab is-active" role="tab" aria-selected="true" data-faq="all">All</button><button class="tab" role="tab" aria-selected="false" data-faq="products">Jewellery</button><button class="tab" role="tab" aria-selected="false" data-faq="orders">Orders &amp; sizing</button>
      </div>
      <div class="faq__card"><img src="{U('1594824476967-48c8b964273f', 300, 300)}" alt="Smiling customer care specialist" width="72" height="72" loading="lazy"><div><p class="faq__card-title">Still need help?</p><p class="muted">Our team replies within one business day.</p><a class="link-arrow" href="contact.html">Send us a message <span aria-hidden="true">→</span></a></div></div>
    </div>
    <div class="faq__list">{items}</div>
  </div>
</section>
'''
    news = f'''<section class="section newsletter" data-section="Newsletter">
  <div class="container"><div class="newsletter__card">
    <img class="newsletter__bg" src="{U('1626784215021-2e39ccf971cd', 1800)}" alt="" width="1800" height="900" loading="lazy">
    <div class="newsletter__inner">
      <p class="eyebrow eyebrow--light">The Ocean List</p>
      <h2 class="h2">10% off your first piece,<br>and early access to new drops.</h2>
      <form class="newsletter__form" novalidate data-newsletter>
        <label class="visually-hidden" for="nl-email">Email address</label>
        <input id="nl-email" type="email" name="email" placeholder="Your email address" autocomplete="email" required>
        <button class="btn btn--light" type="submit">Subscribe</button>
        <p class="form-msg" role="status" aria-live="polite" data-form-msg></p>
      </form>
      <p class="newsletter__fine">Unsubscribe any time. Read our <a href="page.html">privacy policy</a>.</p>
    </div>
  </div></div>
</section>
'''
    featured_product = '''<section class="section fp" data-section="Featured product" data-featured-product data-id="1">
  <div class="container fp__grid"><div class="fp__media" data-fp-media></div><div class="fp__info" data-fp-info></div></div>
</section>
'''
    return hero + marquee + collections + featured + story + look + featured_product + bento + bundle + gift + reviews + journal + faq + news
