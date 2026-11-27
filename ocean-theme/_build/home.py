from partials import U, ARR_L, ARR_R


def hallmarks():
    items = [('14k', 'Solid recycled gold', 'Never plated, never hollow-cored. Every piece is stamped 585.'),
             ('585', 'Independently hallmarked', 'Tested and marked by an assay office before it ships.'),
             ('IGI', 'Certified lab-grown diamonds', 'Graded by IGI. Reports included above 0.3 ct.'),
             ('60', 'Days to resize or return', 'Resizing is free, including engraved rings.')]
    li = ''.join(f'<li><p class="hallmarks__mark">{m}</p><p class="hallmarks__title">{t}</p><p class="hallmarks__text">{d}</p></li>' for m, t, d in items)
    return f'<section class="hallmarks" data-section="Hallmark row" data-feature="hallmarks" aria-label="Materials and services"><div class="container"><ul class="hallmarks__list">{li}</ul></div></section>\n'


def home():
    hero = f'''<section class="ehero" data-section="Image banner">
  <div class="container ehero__grid">
    <div class="ehero__copy">
      <p class="eyebrow">Ocean Fine Jewellery</p>
      <h1 class="ehero__title">Gold you can <em>live</em> in.</h1>
      <p class="ehero__lead">Solid 14k recycled gold, made by hand in small batches and meant to be worn every day, for years.</p>
      <a class="btn btn--primary btn--lg" href="collection.html">Shop the collection</a>
    </div>
    <figure class="ehero__media">
      <div class="ehero__arch"><img src="{U('1633810542706-90e5ff7557be', 1400, 1700, (0.5, 0.4, 1.1))}" srcset="{U('1633810542706-90e5ff7557be', 800, 970, (0.5, 0.4, 1.1))} 800w, {U('1633810542706-90e5ff7557be', 1400, 1700, (0.5, 0.4, 1.1))} 1400w" sizes="(min-width: 990px) 50vw, 100vw" alt="Woman wearing a bold gold link chain" width="1400" height="1700" fetchpriority="high"></div>
      <figcaption class="ehero__cap"><a href="product.html?id=10">Bold Link Chain</a> · 14k yellow gold · <span data-money="310">$310.00</span></figcaption>
    </figure>
  </div>
</section>
'''
    cats = [('rings', 'Rings', '1543294001-f7cd5d7fb516', 'Gold rings stacked together', 6),
            ('necklaces', 'Necklaces', '1599459183200-59c7687a0275', 'Layered gold necklaces', 5),
            ('earrings', 'Earrings', '1617038260897-41a1f14a8ca0', 'Twisted gold hoop earrings', 3),
            ('bracelets', 'Bracelets', '1596944924616-7b38e7cfac36', 'Gold chain bracelet on a wrist', 2)]
    cat_li = ''.join(f'<li><a class="catcard" href="collection.html?c={h}"><span class="catcard__img"><img src="{U(i, 700, 900)}" alt="{a}" width="350" height="450" loading="lazy"></span><span class="catcard__name">{t}</span><span class="catcard__count">{n} pieces</span></a></li>' for h, t, i, a, n in cats)
    collections = f'''<section class="section" data-section="Collection list">
  <div class="container">
    <div class="shead"><h2 class="h2">Shop by category</h2><a class="link-arrow" href="collections.html">All collections <span aria-hidden="true">→</span></a></div>
    <ul class="catcards">{cat_li}</ul>
  </div>
</section>
'''
    featured = '''<section class="section scheme-2" id="featured" data-section="Featured collection">
  <div class="container">
    <div class="shead">
      <h2 class="h2">Most worn</h2>
      <div class="ttabs" role="tablist" aria-label="Filter products">
        <button class="ttab is-active" role="tab" aria-selected="true" data-tab="all">All</button>
        <button class="ttab" role="tab" aria-selected="false" data-tab="rings">Rings</button>
        <button class="ttab" role="tab" aria-selected="false" data-tab="necklaces">Necklaces</button>
        <button class="ttab" role="tab" aria-selected="false" data-tab="earrings">Earrings</button>
      </div>
    </div>
    <ul class="pgrid" id="product-grid" aria-live="polite"></ul>
    <div class="center mt-40"><a class="btn btn--outline" href="collection.html">View all jewellery</a></div>
  </div>
</section>
'''
    craft = f'''<section class="section craft" data-section="Image with text">
  <div class="container craft__grid">
    <div class="craft__media">
      <div class="craft__arch"><img src="{U('1611652022419-a9419f74343d', 1000, 1300)}" alt="Woman wearing a fine gold chain with a small pendant" width="500" height="650" loading="lazy"></div>
      <figure class="craft__detail"><img src="{U('1608042314453-ae338d80c427', 600, 700)}" alt="Gold rings with coral and turquoise stones on a pebble" width="300" height="350" loading="lazy"><figcaption>Coloured stones, traced to source</figcaption></figure>
    </div>
    <div class="craft__copy">
      <p class="eyebrow">The workshop</p>
      <h2 class="h2">Made slowly, by people who know gold.</h2>
      <p class="lead">Every Ocean piece passes through the same three pairs of hands before it reaches yours.</p>
      <ol class="craft__steps">
        <li><span>I</span><div><strong>Cast</strong><p>Recycled 14k gold is cast in small batches, so nothing is mass-produced.</p></div></li>
        <li><span>II</span><div><strong>Set</strong><p>Stones are set by hand under magnification, then checked twice.</p></div></li>
        <li><span>III</span><div><strong>Hallmarked</strong><p>An independent assay office tests the gold and stamps it 585.</p></div></li>
      </ol>
      <a class="link-arrow" href="page.html">Visit the workshop <span aria-hidden="true">→</span></a>
    </div>
  </div>
</section>
'''
    look_items = [(19, 'Paperclip Chain', '40 cm', 150, (0.6, 0.27, 2.4), '60%', '24%'), (18, 'Satin Ball Chain', '42 cm', 120, (0.57, 0.43, 2.4), '57%', '52%'), (17, 'Pebble Coin Necklace', '50 cm', 175, (0.5, 0.56, 2.2), '50%', '75%')]
    pins = ''.join(f'<button class="pin" style="--x:{x};--y:{y}" data-pin="{n + 1}" aria-label="{t}">{n + 1}</button>' for n, (pid, t, ty, pr, fp, x, y) in enumerate(look_items))
    rows = ''.join(f'<li class="look__row" data-look="{n + 1}"><span class="look__n">{n + 1}</span><img src="{U("1599459183200-59c7687a0275", 160, 160, fp)}" alt="" width="56" height="56" loading="lazy"><div class="look__info"><a href="product.html?id={pid}"><strong>{t}</strong></a><span>14k yellow gold · {ty}</span></div><span class="look__price" data-money="{pr}">${pr}.00</span><button class="look__add" data-add="{pid}" aria-label="Add {t} to bag">Add</button></li>' for n, (pid, t, ty, pr, fp, x, y) in enumerate(look_items))
    look = f'''<section class="section section--flush-top" data-section="Shop the look">
  <div class="container"><div class="look">
    <div class="look__media"><img src="{U('1599459183200-59c7687a0275', 1400)}" alt="Three gold necklaces layered at different lengths" width="1400" height="2090" loading="lazy">{pins}</div>
    <div class="look__panel">
      <p class="eyebrow">Shop the look</p>
      <h2 class="h2">The three-length layer</h2>
      <p class="muted">A short, a middle and a long chain. Select a number on the photo to find each piece.</p>
      <ol class="look__list">{rows}</ol>
      <div class="look__total"><span>All three</span><strong data-money="445">$445.00</strong></div>
      <button class="btn btn--primary btn--block btn--lg" data-add-look="19,18,17">Add all three to bag</button>
    </div>
  </div></div>
</section>
'''
    bundle = '''<section class="section scheme-2" id="bundle" data-section="Bundle builder">
  <div class="container">
    <div class="shead"><div><h2 class="h2">Build a stack, save 15%</h2><p class="muted shead__sub">Choose one piece from each step. The discount is applied automatically in your bag.</p></div><ol class="bsteps-mini" aria-hidden="true"><li data-mini="0">1</li><li data-mini="1">2</li><li data-mini="2">3</li></ol></div>
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
    gift = f'''<section class="section gift" data-section="Image with text">
  <div class="container gift__grid">
    <div class="gift__copy">
      <p class="eyebrow">Gifting</p>
      <h2 class="h2">A gift that outlasts the occasion</h2>
      <p class="lead">Every order arrives in our green linen box with a polishing cloth and a handwritten card. Engraving is free on rings and pendants.</p>
      <dl class="gift__facts">
        <div><dt>Engraving</dt><dd>Free, up to 12 characters</dd></div>
        <div><dt>Delivery</dt><dd>Insured, 2–3 working days</dd></div>
        <div><dt>Gift cards</dt><dd>Never expire</dd></div>
      </dl>
      <div class="gift__ctas"><a class="btn btn--primary" href="collection.html?c=gifts-under-250">Gifts under <span data-money="250">$250.00</span></a><a class="btn btn--outline" href="product.html?id=20">Send a gift card</a></div>
    </div>
    <div class="gift__media"><img src="{U('1515562141207-7a88fb7ce338', 1200, 1000)}" alt="Pearl necklace presented in an open gift box" width="1200" height="1000" loading="lazy"></div>
  </div>
</section>
'''
    revs = [(5, '“I haven’t taken it off in months. No tarnish, no green marks, and it still looks new.”', 'Amara O.', 1, 'Tide Pearl Pendant', '1610694955371-d4a3e0ce4b52'),
            (5, '“You can see every vein in the leaf. It arrived boxed with a handwritten card.”', 'Lena K.', 7, 'Ginkgo Leaf Pendant', '1620656798579-1984d9e87df7'),
            (4, '“My band was a little loose. It came back resized in a week, free of charge.”', 'Sophie R.', 14, 'Classic Wedding Band', '1596944924616-7b38e7cfac36')]
    cards = ''.join(f'<li class="quote"><p class="stars" aria-label="{s} out of 5">{"★" * s}{"☆" * (5 - s)}</p><blockquote>{q}</blockquote><div class="quote__who"><img src="{U(img, 120, 120)}" alt="" width="48" height="48" loading="lazy"><p><strong>{n}</strong><span>Verified buyer · <a href="product.html?id={pid}">{pn}</a></span></p></div></li>' for s, q, n, pid, pn, img in revs)
    reviews = f'''<section class="section reviews2" data-section="Testimonials">
  <div class="container">
    <div class="shead"><h2 class="h2">In their words</h2><p class="reviews2__score"><span class="stars" aria-hidden="true">★★★★★</span> 4.8 average from 476 reviews</p></div>
    <ul class="quotes">{cards}</ul>
  </div>
</section>
'''
    journal = f'''<section class="section scheme-2" id="journal" data-section="Blog posts">
  <div class="container">
    <div class="shead"><h2 class="h2">From the journal</h2><a class="link-arrow" href="blog.html">All articles <span aria-hidden="true">→</span></a></div>
    <div class="journal">
      <a class="jfeat" href="article.html?id=1"><img src="{U('1631982690223-8aa4be0a2497', 1400, 1000)}" alt="Rings displayed in a jewellery tray" width="700" height="500" loading="lazy">
        <div class="jfeat__body"><p class="jfeat__meta">Guides · 5 min read</p><h3>How to find your ring size at home</h3><span class="jfeat__cta">Read article <span aria-hidden="true">→</span></span></div></a>
      <div class="jside"><ol class="jlist">
        <li><a class="jitem" href="article.html?id=2"><div class="jitem__text"><p class="post__meta">Styling · 4 min read</p><h3>Layering necklaces: the three-length rule</h3></div><div class="jitem__img"><img src="{U('1590548784585-643d2b9f2925', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
        <li><a class="jitem" href="article.html?id=3"><div class="jitem__text"><p class="post__meta">Care · 3 min read</p><h3>Caring for solid gold so it lasts</h3></div><div class="jitem__img"><img src="{U('1561828995-aa79a2db86dd', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
        <li><a class="jitem" href="article.html?id=4"><div class="jitem__text"><p class="post__meta">Materials · 6 min read</p><h3>Pearls 101: freshwater, baroque and keshi</h3></div><div class="jitem__img"><img src="{U('1515562141207-7a88fb7ce338', 320, 240)}" alt="" width="160" height="120" loading="lazy"></div></a></li>
      </ol></div>
    </div>
  </div>
</section>
'''
    faqs = [('Is everything solid gold?', 'Yes. Every piece is solid recycled 14k gold, stamped 585. We don’t make plated or vermeil jewellery.'),
            ('Are your diamonds real?', 'Our diamonds are lab-grown: chemically identical to mined diamonds, graded by IGI, with reports included above 0.3 ct.'),
            ('What if my ring doesn’t fit?', 'Resizing is free within 60 days, including engraved rings. Start a request from your account and we’ll send a prepaid label.'),
            ('How long does delivery take?', 'Orders ship insured within 2 working days and usually arrive 2–3 working days later. Shipping is free over $100.00.'),
            ('Do you ship internationally?', 'We ship to 32 countries. Prices, duties and taxes are shown in your local currency at checkout.')]
    items = ''.join(f'<details{" open" if i == 0 else ""}><summary>{q}</summary><p>{a}</p></details>' for i, (q, a) in enumerate(faqs))
    faq = f'''<section class="section" id="faq" data-section="Collapsible content">
  <div class="container faq2">
    <div><h2 class="h2">Questions</h2><p class="muted">Can’t find an answer? <a class="link-u" href="contact.html">Contact our team</a>. We reply within one business day.</p></div>
    <div class="faq2__list">{items}</div>
  </div>
</section>
'''
    news = f'''<section class="section section--flush-top" data-section="Newsletter">
  <div class="container"><div class="news2">
    <div class="news2__copy">
      <h2 class="h2">The Ocean letter</h2>
      <p>New pieces and workshop notes, once a month. Subscribers hear about limited runs first.</p>
      <form class="news2__form" novalidate data-newsletter>
        <label class="visually-hidden" for="nl-email">Email address</label>
        <input id="nl-email" type="email" name="email" placeholder="Email address" autocomplete="email" required>
        <button class="btn btn--light" type="submit">Subscribe</button>
        <p class="form-msg" role="status" aria-live="polite" data-form-msg></p>
      </form>
    </div>
    <div class="news2__media"><img src="{U('1626784215021-2e39ccf971cd', 1000, 800)}" alt="" width="1000" height="800" loading="lazy"></div>
  </div></div>
</section>
'''
    return hero + hallmarks() + collections + featured + craft + look + bundle + gift + reviews + journal + faq + news
