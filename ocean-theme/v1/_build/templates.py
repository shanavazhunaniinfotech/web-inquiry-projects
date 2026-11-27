from partials import U, X, SEARCH, ARR_L, ARR_R, LOGO, LOGO_MARK, BAG, breadcrumbs

FILTER_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'


def facets(default_sort='featured'):
    return f'''<div class="facets" data-facets data-default-sort="{default_sort}">
  <div class="ftoolbar">
    <button class="ftoolbar__toggle" data-filter-toggle aria-expanded="false" aria-controls="filters">{FILTER_ICON}<span data-filter-label>Filter</span> <span data-filter-count></span></button>
    <p class="ftoolbar__count" aria-live="polite" data-count-results></p>
    <div class="ftoolbar__sort"><label for="sort-by">Sort by</label>
      <div class="select"><select id="sort-by" aria-label="Sort by" data-sort>
        <option value="featured">Featured</option><option value="best">Best selling</option><option value="az">Alphabetically, A–Z</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option><option value="new">Date, new to old</option>
      </select></div></div>
  </div>
  <div class="fchips-mobile" aria-label="Filter groups">
    <button class="fchip" data-filter-toggle data-focus-group="Availability">Availability</button><button class="fchip" data-filter-toggle data-focus-group="Price">Price</button><button class="fchip" data-filter-toggle data-focus-group="Product type">Type</button><button class="fchip" data-filter-toggle data-focus-group="Metal">Metal</button><button class="fchip" data-filter-toggle data-focus-group="Stone">Stone</button>
  </div>
  <ul class="fchips" data-active aria-label="Active filters" hidden></ul>
  <div class="facets__layout">
    <aside class="facets__side" id="filters" data-filters aria-label="Filters">
      <div class="facets__side-head"><p class="facets__side-title">Filters</p><button class="icon-btn" data-close-filters aria-label="Close filters">{X}</button></div>
      <div class="facets__groups" data-groups></div>
      <div class="facets__side-foot"><button class="btn btn--outline" data-clear-all>Clear all</button><button class="btn btn--primary" data-show-results>Show results</button></div>
    </aside>
    <div class="facets__results">
      <h2 class="visually-hidden">Products</h2>
      <ul class="product-grid coll-grid" data-results aria-live="polite"></ul>
      <div class="state-empty" data-empty hidden>
        <div class="state-empty__art" aria-hidden="true">{FILTER_ICON.replace('width="18" height="18"', 'width="36" height="36"')}</div>
        <h2 class="h4">No products match these filters</h2>
        <p class="muted">Try removing a filter or widening the price range.</p>
        <button class="btn btn--primary" data-clear-all>Clear all filters</button>
      </div>
      <nav class="pager" aria-label="Pagination" data-pager></nav>
    </div>
  </div>
</div>'''


def collection():
    nav = ''.join(f'<a href="collection.html?c={h}" data-handle="{h}">{t}</a>' for h, t in [('all', 'All'), ('rings', 'Rings'), ('necklaces', 'Necklaces'), ('earrings', 'Earrings'), ('bracelets', 'Bracelets'), ('bridal', 'Bridal'), ('gifts-under-250', 'Gifts')])
    return f'''<section class="chero" data-section="Collection banner">
  <div class="container chero__grid">
    <div class="chero__copy">
      {breadcrumbs([('Home', 'index.html'), ('Collections', 'collections.html'), ('<span data-col-crumb>All jewellery</span>', None)])}
      <h1 class="chero__title" data-col-title>All jewellery</h1>
      <p class="chero__desc" data-col-desc>Every piece we make, in solid recycled 14k gold.</p>
      <nav class="chero__nav" aria-label="Collections" data-col-nav>{nav}</nav>
    </div>
    <div class="chero__media" data-col-image></div>
  </div>
</section>
<section class="section section--tight" data-section="Product grid">
  <div class="container">
    {facets()}
    <div class="state-empty state-empty--page" data-col-empty hidden>
      <div class="state-empty__art" aria-hidden="true">{BAG.replace('width="19" height="19"', 'width="36" height="36"')}</div>
      <h2 class="h4">This collection is empty</h2>
      <p class="muted">There are no products here yet. Browse our other collections instead.</p>
      <a class="btn btn--primary" href="collections.html">Browse collections</a>
    </div>
  </div>
</section>'''


def collections():
    return f'''<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Collections', None)])}
  <h1 class="phead__title">Collections</h1>
  <p class="phead__lead">Rings, necklaces, earrings and bracelets in solid recycled 14k gold.</p>
</div></section>
<section class="section section--tight" data-section="Collection list"><div class="container">
  <ul class="ccards" data-collection-list></ul>
</div></section>'''


def product():
    return f'''<div class="container">{breadcrumbs([('Home', 'index.html'), ('<a href="collection.html" data-p-crumb-type>Jewellery</a>', None, ' class="crumb-link"'), ('<span data-p-crumb></span>', None)]).replace('<li aria-current="page" class="crumb-link">', '<li>')}</div>
<section class="pdp" data-section="Main product">
  <div class="container pdp__grid">
    <div class="pg" data-gallery aria-label="Product images"></div>
    <div class="pinfo-wrap"><div class="pinfo" data-pinfo></div><span data-atc-anchor aria-hidden="true"></span>
    </div>
  </div>
</section>
<!-- Product reviews: an @app block slot. The reviews app renders here; the demo store uses no apps. -->
<section class="section scheme-2" data-section="Product recommendations"><div class="container">
  <div class="section-head"><div><p class="eyebrow">You may also like</p><h2 class="h2">More to <em>love.</em></h2></div></div>
  <ul class="product-grid" data-recs></ul>
</div></section>
<section class="section" data-recent-wrap data-section="Recently viewed"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Recently viewed</p><h2 class="h2">Pick up where<br>you left off.</h2></div></div>
  <ul class="product-grid" data-recent></ul>
</div></section>
<div class="sticky-atc" data-sticky-atc aria-hidden="true"></div>
<div class="modal lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Product image" hidden>
  <div class="lightbox__panel">
    <button class="icon-btn modal__close" aria-label="Close" data-close-modal>{X}</button>
    <img data-lb-img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">
    <div class="lightbox__nav"><button class="icon-btn icon-btn--outline" aria-label="Previous image" data-lb-prev>{ARR_L}</button><span data-lb-n></span><button class="icon-btn icon-btn--outline" aria-label="Next image" data-lb-next>{ARR_R}</button></div>
  </div>
</div>
<div class="modal" id="store-info" role="dialog" aria-modal="true" aria-labelledby="store-title" hidden>
  <div class="modal__panel modal__panel--sm"><button class="icon-btn modal__close" aria-label="Close" data-close-modal>{X}</button>
    <div class="modal__body"><h2 class="h4" id="store-title">Ocean Studio</h2><p class="stock"><span></span>Pickup available, usually ready in 24 hours</p><p class="muted">Collect your order from our studio by appointment. We’ll email you when it’s ready, with directions and opening hours.</p></div></div>
</div>
<div class="modal" id="notify" role="dialog" aria-modal="true" aria-labelledby="notify-title" hidden>
  <div class="modal__panel modal__panel--sm"><button class="icon-btn modal__close" aria-label="Close" data-close-modal>{X}</button>
    <form class="modal__body" data-notify-form novalidate><h2 class="h4" id="notify-title">Email me when it’s back</h2><p class="muted">We’ll send one email when this size is back in stock.</p>
      <div class="field"><label for="notify-email">Email address</label><input id="notify-email" type="email" autocomplete="email" required></div>
      <button class="btn btn--primary btn--block" type="submit">Notify me</button><p class="form-msg" role="status" aria-live="polite" data-form-msg></p></form></div>
</div>'''


def cart():
    return f'''<section class="phead phead--compact" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Your bag', None)])}
  <h1 class="phead__title">Your bag <span class="phead__count" data-cp-count></span></h1>
</div></section>
<section class="section section--tight" data-section="Cart items"><div class="container">
  <div class="cartpage" data-cp-full hidden>
    <div class="cartpage__main">
      <div class="cp-ship"><p data-cp-ship></p><div class="ship-meter__bar"><span data-cp-bar></span></div></div>
      <div class="cp-head" aria-hidden="true"><span>Product</span><span>Total</span></div>
      <ul class="cart-lines cart-lines--page" data-cartpage-lines></ul>
      <div class="cp-extras">
        <div class="field"><label for="cp-note">Order note <span class="muted">(optional)</span></label><textarea id="cp-note" rows="3" placeholder="Gift message or delivery instructions"></textarea></div>
        <a class="link-arrow" href="collection.html"><span aria-hidden="true">←</span> Continue shopping</a>
      </div>
    </div>
    <aside class="cartpage__summary" aria-label="Order summary">
      <h2 class="h4">Order summary</h2>
      <label class="gift-toggle"><input type="checkbox" data-cp-gift><span class="gift-toggle__ui" aria-hidden="true"></span><span><strong>Add gift wrap</strong> Ribbon and a handwritten card · <span data-money="8">$8.00</span></span></label>
      <dl class="cp-totals">
        <div><dt>Subtotal</dt><dd data-cp-sub>$0.00</dd></div>
        <div data-cp-wrap-row hidden><dt>Gift wrap</dt><dd data-cp-wrap></dd></div>
        <div class="cp-totals__disc" data-cp-disc-row hidden><dt>Stack discount (automatic)</dt><dd data-cp-disc></dd></div>
        <div class="cp-totals__total"><dt>Estimated total</dt><dd data-cp-total>$0.00</dd></div>
      </dl>
      <p class="cart-drawer__tax">Tax included. Discounts and shipping calculated at checkout.</p>
      <button class="btn btn--primary btn--block btn--lg" data-cp-checkout>Check out</button>
      <div class="accel"><button class="accel__btn accel__btn--shop" aria-label="Buy with Shop Pay">Buy with <strong>shop</strong><em>Pay</em></button><button class="accel__btn accel__btn--apple" aria-label="Buy with Apple Pay"> Pay</button></div>
      <ul class="usps usps--compact"><li>Secure checkout by Shopify</li><li>60-day returns and free resizing</li><li>Gift-boxed as standard</li></ul>
    </aside>
  </div>
  <div class="state-empty state-empty--page" data-cp-empty hidden>
    <div class="state-empty__art" aria-hidden="true">{BAG.replace('width="19" height="19"', 'width="40" height="40"')}</div>
    <h2 class="h3">Your bag is empty</h2>
    <p class="muted">Have an account? <a href="account.html">Sign in</a> to see items you saved.</p>
    <a class="btn btn--primary btn--lg" href="collection.html">Continue shopping</a>
  </div>
</div></section>
<section class="section scheme-2" data-section="Cart recommendations"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Pairs well with</p><h2 class="h2">Complete<br>the <em>set.</em></h2></div></div>
  <ul class="product-grid" data-cp-ups></ul>
  <ul class="product-grid" data-cp-pop hidden></ul>
</div></section>'''


def search():
    return f'''<section class="phead phead--search" data-section="Search header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Search', None)])}
  <h1 class="phead__title">Search results for <span data-sq></span></h1>
  <form class="searchbar" action="search.html" role="search">
    <label class="visually-hidden" for="search-page-input">Search</label>{SEARCH}
    <input id="search-page-input" type="search" name="q" placeholder="Search rings, pearls, gold…">
    <button class="btn btn--primary" type="submit">Search</button>
  </form>
  <p class="phead__lead" data-s-summary aria-live="polite"></p>
</div></section>
<section class="section section--tight" data-section="Search results"><div class="container">
  <div data-s-results>
    <div class="stabs" role="tablist" aria-label="Result types">
      <button class="tab is-active" role="tab" aria-selected="true" data-stab="products">Products <span data-stab-count="products"></span></button>
      <button class="tab" role="tab" aria-selected="false" data-stab="articles">Articles <span data-stab-count="articles"></span></button>
      <button class="tab" role="tab" aria-selected="false" data-stab="pages">Pages <span data-stab-count="pages"></span></button>
    </div>
    <div data-spanel="products">{facets('best')}</div>
    <div data-spanel="articles" hidden><ul class="slist" data-s-articles></ul></div>
    <div data-spanel="pages" hidden><ul class="slist" data-s-pages></ul></div>
  </div>
  <div class="state-empty state-empty--page" data-s-none hidden>
    <div class="state-empty__art" aria-hidden="true">{SEARCH.replace('width="18" height="18"', 'width="40" height="40"')}</div>
    <h2 class="h3">No results for “<span data-s-none-q></span>”</h2>
    <p class="muted">Check the spelling, use fewer words, or try one of these:</p>
    <ul class="chips chips--center"><li><a href="search.html?q=ring">ring</a></li><li><a href="search.html?q=pearl">pearl</a></li><li><a href="search.html?q=diamond">diamond</a></li><li><a href="search.html?q=hoop">hoop</a></li></ul>
    <h3 class="mini-title mt-40">Popular right now</h3>
    <ul class="product-grid" data-s-popular></ul>
  </div>
  <div class="state-empty state-empty--page" data-s-start hidden>
    <h2 class="h3">What are you looking for?</h2>
    <ul class="chips chips--center"><li><a href="search.html?q=ring">ring</a></li><li><a href="search.html?q=necklace">necklace</a></li><li><a href="search.html?q=gold">gold</a></li></ul>
    <ul class="product-grid mt-40" data-s-popular></ul>
  </div>
</div></section>'''


def blog():
    tags = ''.join(f'<button class="chip{" is-active" if t == "All" else ""}" data-btag="{t}" aria-pressed="{"true" if t == "All" else "false"}">{t}</button>' for t in ['All', 'Guides', 'Styling', 'Care', 'Materials', 'Gifts'])
    return f'''<section class="phead" data-section="Blog header"><div class="container phead__split">
  <div>{breadcrumbs([('Home', 'index.html'), ('Journal', None)])}<h1 class="phead__title">The Journal</h1><p class="phead__lead">Guides, styling notes and the stories behind our materials.</p></div>
  <div class="btags" role="group" aria-label="Filter by topic">{tags}</div>
</div></section>
<section class="section section--tight" data-section="Blog posts"><div class="container">
  <ul class="bgrid" data-blog-grid></ul>
  <p class="state-empty" data-blog-empty hidden>No articles in this topic yet.</p>
  <nav class="pager" aria-label="Pagination"><button class="pager__btn" disabled aria-label="Previous page">‹</button><button class="pager__btn is-current" aria-current="page">1</button><button class="pager__btn" disabled aria-label="Next page">›</button></nav>
</div></section>'''


def article():
    return f'''<div class="read-progress" aria-hidden="true"><span data-read-progress></span></div>
<article class="article" data-section="Article">
  <header class="article__head container container--narrow">
    {breadcrumbs([('Home', 'index.html'), ('Journal', 'blog.html'), ('<span data-a-crumb>Article</span>', None)])}
    <p class="article__meta" data-a-meta></p>
    <h1 class="article__title" data-a-title>How to find your ring size at home</h1>
    <p class="article__lead" data-a-lead></p>
  </header>
  <figure class="article__hero container" data-a-hero></figure>
  <div class="container article__layout">
    <aside class="article__aside">
      <p class="mini-title">Share</p>
      <button class="share__btn" data-copy-link>Copy link</button>
      <p class="mini-title mt-24">In this article</p>
      <ol class="toc"><li><a href="#a1">Measure a ring you own</a></li><li><a href="#a2">Use a strip of paper</a></li><li><a href="#a3">Between two sizes?</a></li></ol>
    </aside>
    <div class="rte" data-a-body>
      <p>The easiest way to find your ring size is to measure a ring that already fits the finger you want to wear it on. If you don’t have one, a strip of paper works well too.</p>
      <h2 id="a1">1. Measure a ring you own</h2>
      <p>Place the ring on a ruler and measure the inside diameter in millimetres, edge to edge. Then use the table below to find your size.</p>
      <table class="size-table"><caption>Ring size conversion</caption><thead><tr><th scope="col">US</th><th scope="col">UK</th><th scope="col">Inside diameter</th></tr></thead><tbody><tr><td>5</td><td>J½</td><td>15.7 mm</td></tr><tr><td>6</td><td>L½</td><td>16.5 mm</td></tr><tr><td>7</td><td>N½</td><td>17.3 mm</td></tr><tr><td>8</td><td>P½</td><td>18.2 mm</td></tr><tr><td>9</td><td>R½</td><td>19.0 mm</td></tr></tbody></table>
      <h2 id="a2">2. Use a strip of paper</h2>
      <p>Wrap a thin strip of paper around the base of your finger, mark where it overlaps, then measure the length in millimetres. Divide by 3.14 to get the diameter.</p>
      <figure><img src="{U('1543294001-f7cd5d7fb516', 1400, 800)}" alt="Gold stacking rings with diamond pavé" width="1400" height="800" loading="lazy"><figcaption>Wider bands fit more snugly, so size up half a size for anything over 4 mm.</figcaption></figure>
      <blockquote><p>Measure at the end of the day, when your fingers are at their largest.</p></blockquote>
      <h2 id="a3">3. Between two sizes?</h2>
      <p>Choose the larger size. And if it isn’t quite right, resizing is free within 60 days.</p>
      <ul><li>Measure three or four times and take the average.</li><li>Avoid measuring when your hands are cold.</li><li>Knuckles matter: the ring must slide over them.</li></ul>
    </div>
  </div>
</article>
<section class="section scheme-2" data-section="Featured products"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Shop the story</p><h2 class="h2">Pieces in<br>this <em>article.</em></h2></div></div>
  <ul class="product-grid product-grid--3" data-a-products></ul>
</div></section>
<section class="section" data-section="Comments"><div class="container container--narrow">
  <h2 class="h3">Leave a comment</h2>
  <p class="muted">Comments are moderated and appear once approved.</p>
  <form class="form-grid" data-validate="comment" novalidate>
    <div class="error-summary" data-error-summary tabindex="-1" role="alert" hidden></div>
    <div class="field"><label for="c-name">Name</label><input id="c-name" autocomplete="name" data-rules="required" data-label="Name"><p class="field__error" id="c-name-error" hidden></p></div>
    <div class="field"><label for="c-email">Email</label><input id="c-email" type="email" autocomplete="email" data-rules="required email" data-label="Email"><p class="field__error" id="c-email-error" hidden></p></div>
    <div class="field field--full"><label for="c-body">Comment</label><textarea id="c-body" rows="4" data-rules="required" data-label="Comment"></textarea><p class="field__error" id="c-body-error" hidden></p></div>
    <button class="btn btn--primary" type="submit">Post comment</button>
  </form>
  <div class="form-success" data-form-success tabindex="-1" hidden><h3 class="h4">Thanks for your comment</h3><p class="muted">It will appear here once it’s approved.</p></div>
</div></section>
<section class="section scheme-2" data-section="Related articles"><div class="container">
  <div class="section-head"><div><p class="eyebrow">Keep reading</p><h2 class="h2">More from<br>the <em>journal.</em></h2></div></div>
  <ul class="bgrid bgrid--3" data-a-related></ul>
</div></section>'''


def page():
    return f'''<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('About Ocean', None)])}
  <h1 class="phead__title">About Ocean</h1>
  <p class="phead__lead">Fine jewellery designed to be worn every day, made from recycled gold and stones we can trace.</p>
</div></section>
<figure class="page-hero container"><img src="{U('1631982690223-8aa4be0a2497', 1800, 700)}" alt="Gold rings arranged in a jewellery tray" width="1800" height="700"></figure>
<section class="section section--tight" data-section="Page content"><div class="container page-layout">
  <nav class="page-toc" aria-label="On this page"><p class="mini-title">On this page</p><ol>
    <li><a href="#story">Our story</a></li><li><a href="#materials">Materials</a></li><li><a href="#size-guide">Ring size guide</a></li><li><a href="#care">Jewellery care</a></li><li><a href="#shipping">Shipping &amp; returns</a></li></ol></nav>
  <div class="rte">
    <h2 id="story">Our story</h2>
    <p>Ocean started at a single workbench with a simple idea: fine jewellery should be worn, not saved for special occasions. Every piece we make is designed to be comfortable enough to sleep in and strong enough to wear in the shower.</p>
    <p>We work with a small group of family-run workshops. Each piece is cast, set and polished by hand, then hallmarked by an independent assay office.</p>
    <h2 id="materials">Materials</h2>
    <p>We use recycled 14k and 18k gold for our fine pieces and thick gold vermeil over recycled sterling silver for our everyday range. Our diamonds are lab-grown and come with an independent report above 0.3 ct. Our coloured stones and pearls are traceable to source.</p>
    <h2 id="size-guide">Ring size guide</h2>
    <p>Measure the inside diameter of a ring that fits, then find it below. If you’re between sizes, choose the larger one.</p>
    <table class="size-table"><caption>Ring size conversion</caption><thead><tr><th scope="col">US</th><th scope="col">UK</th><th scope="col">EU</th><th scope="col">Inside diameter</th></tr></thead><tbody>
      <tr><td>5</td><td>J½</td><td>49</td><td>15.7 mm</td></tr><tr><td>6</td><td>L½</td><td>52</td><td>16.5 mm</td></tr><tr><td>7</td><td>N½</td><td>54</td><td>17.3 mm</td></tr><tr><td>8</td><td>P½</td><td>57</td><td>18.2 mm</td></tr><tr><td>9</td><td>R½</td><td>59</td><td>19.0 mm</td></tr><tr><td>10</td><td>T½</td><td>62</td><td>19.8 mm</td></tr></tbody></table>
    <h2 id="care">Jewellery care</h2>
    <ul><li>Take jewellery off before swimming, exercising or applying lotion.</li><li>Store each piece separately in its pouch to avoid scratches.</li><li>Polish gently with the cloth included in your box.</li><li>Send it back any time for free professional polishing.</li></ul>
    <h2 id="shipping">Shipping &amp; returns</h2>
    <p>Orders ship within 2 working days. Express delivery is free on orders over <span data-money="100">$100.00</span>. Returns and resizing are free within 60 days of delivery. Engraved pieces can be resized but not returned.</p>
  </div>
</div></section>'''


def contact():
    return f'''<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Contact', None)])}
  <h1 class="phead__title">Contact us</h1>
  <p class="phead__lead">Questions about sizing, an order or a custom piece? Send us a message and we’ll reply within one business day.</p>
</div></section>
<section class="section section--tight" data-section="Contact form"><div class="container contact">
  <aside class="contact__info">
    <div class="cinfo"><span class="cinfo__i" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></span><div><h2 class="h5">Customer care hours</h2><p>Monday to Friday, 9am–6pm<br>Saturday, 10am–4pm</p></div></div>
    <div class="cinfo"><span class="cinfo__i" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 6h16v12H4z M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><div><h2 class="h5">Reply time</h2><p>Within one business day, usually much sooner.</p></div></div>
    <div class="cinfo"><span class="cinfo__i" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 10l8-6 8 6v10H4z M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg></span><div><h2 class="h5">Studio visits</h2><p>Try pieces on or plan a custom design, by appointment only.</p></div></div>
    <a class="cinfo cinfo--link" href="index.html#faq"><span class="cinfo__i" aria-hidden="true">?</span><div><h2 class="h5">Read the FAQ</h2><p>Sizing, delivery, engraving and care.</p></div><span aria-hidden="true">→</span></a>
  </aside>
  <div class="contact__form">
    <form class="form-grid" data-validate="contact" novalidate>
      <div class="error-summary field--full" data-error-summary tabindex="-1" role="alert" hidden></div>
      <div class="field"><label for="ct-name">Name</label><input id="ct-name" autocomplete="name" data-rules="required" data-label="Name"><p class="field__error" id="ct-name-error" hidden></p></div>
      <div class="field"><label for="ct-email">Email</label><input id="ct-email" type="email" autocomplete="email" data-rules="required email" data-label="Email"><p class="field__error" id="ct-email-error" hidden></p></div>
      <div class="field"><label for="ct-topic">Topic</label><div class="select"><select id="ct-topic"><option>Sizing and fit</option><option>An existing order</option><option>Custom or engraving</option><option>Something else</option></select></div></div>
      <div class="field"><label for="ct-order">Order number <span class="muted">(optional)</span></label><input id="ct-order" inputmode="numeric" placeholder="#1001"></div>
      <div class="field field--full"><label for="ct-msg">Message</label><textarea id="ct-msg" rows="6" data-rules="required" data-label="Message"></textarea><p class="field__error" id="ct-msg-error" hidden></p></div>
      <label class="fcheck fcheck--consent field--full" for="ct-consent"><input type="checkbox" id="ct-consent" data-rules="required" data-label="Consent"><span class="fcheck__box" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span><span class="fcheck__label">I agree to Ocean storing my details to reply to this message.</span></label>
      <p class="field__error field--full" id="ct-consent-error" hidden></p>
      <button class="btn btn--primary btn--lg" type="submit">Send message</button>
    </form>
    <div class="form-success" data-form-success tabindex="-1" hidden>
      <span class="form-success__i" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></span>
      <h2 class="h3">Thanks, we’ve got your message</h2><p class="muted">We’ll reply to your email within one business day.</p><a class="btn btn--outline" href="index.html">Back to home</a>
    </div>
  </div>
</div></section>'''


def notfound():
    return f'''<section class="nf" data-section="404"><div class="container nf__grid">
  <div class="nf__copy">
    <p class="eyebrow">Error 404</p>
    <h1 class="nf__title">This page has<br><em>slipped away.</em></h1>
    <p class="lead">The link may be broken or the page may have moved. Try a search, or start from one of our collections.</p>
    <form class="searchbar" action="search.html" role="search"><label class="visually-hidden" for="nf-search">Search</label>{SEARCH}<input id="nf-search" type="search" name="q" placeholder="Search the store"><button class="btn btn--primary" type="submit">Search</button></form>
    <ul class="chips"><li><a href="collection.html?c=rings">Rings</a></li><li><a href="collection.html?c=necklaces">Necklaces</a></li><li><a href="collection.html?c=earrings">Earrings</a></li><li><a href="index.html">Home page</a></li></ul>
  </div>
  <div class="nf__art" aria-hidden="true"><span>4</span><span class="nf__ring"><img src="{U('1591209627710-d2427565a41f', 500, 500, (0.52, 0.5, 1.6))}" alt="" width="250" height="250"></span><span>4</span></div>
</div></section>
<section class="section scheme-2" data-section="Featured products"><div class="container">
  <div class="section-head"><div><p class="eyebrow">While you’re here</p><h2 class="h2">Our highest<br><em>rated.</em></h2></div></div>
  <ul class="product-grid" data-404-products></ul>
</div></section>'''


def password():
    return f'''<div class="pw">
  <div class="pw__media"><img src="{U('1599459183200-59c7687a0275', 1200, 1600)}" alt="Layered gold necklaces" width="600" height="800"></div>
  <div class="pw__content">
    {LOGO}
    <div class="pw__body">
      <p class="eyebrow">Opening soon</p>
      <h1 class="pw__title">Something <em>golden</em><br>is on its way.</h1>
      <p class="lead">We’re putting the finishing touches on our first collection: rings, chains and pearls in recycled gold, made to be worn every day. Join the list to hear first when the store opens, and get early access to limited pieces before anyone else.</p>
      <form class="newsletter__form pw__form" data-newsletter novalidate>
        <label class="visually-hidden" for="pw-email">Email address</label>
        <input id="pw-email" type="email" placeholder="Your email address" autocomplete="email" required>
        <button class="btn btn--primary" type="submit">Notify me</button>
        <p class="form-msg" role="status" aria-live="polite" data-form-msg></p>
      </form>
      <button class="link-btn pw__reveal" data-reveal-password aria-expanded="false" aria-controls="pw-form">Enter using password</button>
      <form class="pw__pass" id="pw-form" data-password-form data-validate="password" novalidate hidden>
        <div class="error-summary" data-error-summary tabindex="-1" role="alert" hidden></div>
        <div class="field"><label for="store-password">Store password</label><div class="field__row"><input id="store-password" type="password" autocomplete="current-password" data-rules="required" data-label="Password"><button type="button" class="field__toggle" data-toggle-pass aria-controls="store-password" aria-pressed="false">Show</button></div><p class="field__error" id="store-password-error" hidden></p></div>
        <button class="btn btn--outline" type="submit">Enter</button>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden><p><strong>Welcome in.</strong> <a href="index.html">Continue to the store →</a></p></div>
    </div>
    <p class="pw__foot">Are you the store owner? <a href="https://accounts.shopify.com/store-login" target="_blank" rel="noopener">Log in here</a> · This shop will be powered by Shopify</p>
  </div>
</div>'''


def giftcard():
    return f'''<div class="gc">
  <header class="gc__head">{LOGO}<a class="link-arrow" href="index.html">Start shopping <span aria-hidden="true">→</span></a></header>
  <div class="gc__main">
    <div class="gc__expired" data-gc-expired role="status" hidden><strong>This gift card expired on 1 January 2026.</strong> It can no longer be used at checkout. Contact us if you think this is a mistake.</div>
    <p class="eyebrow">Gift card</p>
    <h1 class="gc__title">Here’s your <span data-money="100">$100.00</span> gift card for Ocean</h1>
    <div class="gc__card" role="img" aria-label="Ocean gift card worth $100.00">
      <div class="gc__card-top">{LOGO_MARK}<span>OCEAN</span></div>
      <p class="gc__card-amount" data-money="100">$100.00</p>
      <p class="gc__card-foot" data-gc-foot>Gift card · No expiry date</p>
    </div>
    <div class="gc__code"><p class="mini-title" data-gc-instruction>Use this code at checkout</p><p class="gc__code-value">OCEN 7H2K 9QWX 4F3M</p><button class="btn btn--outline" data-copy-code>Copy code</button></div>
    <div class="gc__grid">
      <div class="gc__qr"><div data-qr class="gc__qr-box"></div><p class="muted">Scan in store</p></div>
      <dl class="gc__balance"><div><dt>Balance</dt><dd data-money="100">$100.00</dd></div><div><dt>Expires</dt><dd>Never</dd></div></dl>
    </div>
    <div class="gc__actions">
      <button class="wallet-btn" data-wallet aria-label="Add to Apple Wallet"><svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 9h18M15 14h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg><span><small>Add to</small>Apple Wallet</span></button>
      <button class="btn btn--outline" data-print>Print gift card</button>
      <a class="btn btn--primary" href="collection.html">Start shopping</a>
    </div>
  </div>
</div>'''


def account():
    def pass_field(i, label, auto):
        return f'<div class="field"><label for="{i}">{label}</label><div class="field__row"><input id="{i}" type="password" autocomplete="{auto}" data-rules="required{" min8" if auto == "new-password" else ""}" data-label="Password"><button type="button" class="field__toggle" data-toggle-pass aria-controls="{i}" aria-pressed="false">Show</button></div><p class="field__error" id="{i}-error" hidden></p></div>'
    return f'''<section class="acct" data-section="Customer login"><div class="container acct__grid">
  <div class="acct__media"><img src="{U('1611085583191-a3b181a88401', 1000, 1300)}" alt="Pearl pendant on a fine gold chain" width="500" height="650"><div class="acct__perks"><p class="h4">Why create an account?</p><ul class="usps"><li>Track orders and returns</li><li>Start a free resize in one click</li><li>Save your ring size</li><li>Early access to new pieces</li></ul></div></div>
  <div class="acct__panel">
    {breadcrumbs([('Home', 'index.html'), ('Account', None)])}
    <div class="acct__tabs" role="tablist" aria-label="Account">
      <button class="tab is-active" role="tab" aria-selected="true" data-atab data-switch="login">Sign in</button>
      <button class="tab" role="tab" aria-selected="false" data-atab data-switch="register">Create account</button>
    </div>
    <div data-pane="login">
      <h1 class="acct__title">Welcome back</h1>
      <button class="shop-login" type="button"><span>Sign in with</span> <strong>shop</strong></button>
      <p class="or"><span>or use your email</span></p>
      <form data-validate="login" novalidate>
        <div class="error-summary" data-error-summary tabindex="-1" role="alert" hidden></div>
        <div class="field"><label for="login-email">Email</label><input id="login-email" type="email" autocomplete="email" data-rules="required email" data-label="Email"><p class="field__error" id="login-email-error" hidden></p></div>
        {pass_field('login-password', 'Password', 'current-password')}
        <button type="button" class="acct__forgot" data-switch="recover">Forgot your password?</button>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Sign in</button>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden><h2 class="h4">You’re signed in</h2><p class="muted">Your orders, returns and saved sizes are on your account page.</p></div>
    </div>
    <div data-pane="recover" hidden>
      <h1 class="acct__title">Reset your password</h1>
      <p class="muted">We’ll email you a link to reset it.</p>
      <form data-validate="recover" novalidate>
        <div class="error-summary" data-error-summary tabindex="-1" role="alert" hidden></div>
        <div class="field"><label for="rec-email">Email</label><input id="rec-email" type="email" autocomplete="email" data-rules="required email" data-label="Email"><p class="field__error" id="rec-email-error" hidden></p></div>
        <button class="btn btn--primary btn--block btn--lg" type="submit">Send reset link</button>
        <button type="button" class="acct__forgot" data-switch="login">Back to sign in</button>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden><h2 class="h4">Check your inbox</h2><p class="muted">If an account exists for that email, a reset link is on its way.</p></div>
    </div>
    <div data-pane="register" hidden>
      <h1 class="acct__title">Create an account</h1>
      <form class="form-grid" data-validate="register" novalidate>
        <div class="error-summary field--full" data-error-summary tabindex="-1" role="alert" hidden></div>
        <div class="field"><label for="reg-first">First name</label><input id="reg-first" autocomplete="given-name" data-rules="required" data-label="First name"><p class="field__error" id="reg-first-error" hidden></p></div>
        <div class="field"><label for="reg-last">Last name</label><input id="reg-last" autocomplete="family-name"></div>
        <div class="field field--full"><label for="reg-email">Email</label><input id="reg-email" type="email" autocomplete="email" data-rules="required email" data-label="Email"><p class="field__error" id="reg-email-error" hidden></p></div>
        <div class="field--full">{pass_field('reg-password', 'Password', 'new-password')}</div>
        <button class="btn btn--primary btn--block btn--lg field--full" type="submit">Create account</button>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden><h2 class="h4">Welcome to Ocean</h2><p class="muted">Your account is ready.</p></div>
    </div>
  </div>
</div></section>'''


def acct_shell(active, title, body):
    nav = ''.join(f'<li><a href="{u}"{" aria-current=\"page\"" if k == active else ""}>{t}</a></li>' for k, u, t in [('orders', 'account/orders.html', 'Orders'), ('addresses', 'account/addresses.html', 'Addresses'), ('profile', 'account/orders.html#profile', 'Profile')])
    return f"""<section class="acct2" data-section="Customer account"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Account', 'account/orders.html'), (title, None)])}
  <div class="acct2__head"><div><p class="eyebrow">Signed in as Maya Lund</p><h1 class="phead__title">{title}</h1></div><a class="btn btn--outline" href="account.html">Sign out</a></div>
  <div class="acct2__grid">
    <nav class="acct2__nav" aria-label="Account"><ul>{nav}</ul></nav>
    <div class="acct2__main">{body}</div>
  </div>
</div></section>"""


ORDERS = [('#1048', '18 Nov 2026', 'Delivered', 'is-done', 1250, ['1591209627710-d2427565a41f']),
          ('#1031', '2 Oct 2026', 'Resize in progress', 'is-progress', 540, ['1622398925373-3f91b1e275f5']),
          ('#1007', '14 Jun 2026', 'Delivered', 'is-done', 330, ['1611085583191-a3b181a88401', '1617038220319-276d3cfab638'])]


def account_orders():
    rows = ''.join(f"""<tr><th scope="row"><a href="account/order.html">{n}</a></th><td>{d}</td><td><span class="status {c}">{st}</span></td><td><span class="otbl__imgs">{''.join(f'<img src="{U(i, 96, 96)}" alt="" width="40" height="40" loading="lazy">' for i in imgs)}</span></td><td class="num" data-money="{tot}">${tot:,}.00</td><td><a class="link-u" href="account/order.html">View</a></td></tr>""" for n, d, st, c, tot, imgs in ORDERS)
    body = f"""<div class="acct2__panel"><h2 class="h4">Order history</h2>
      <div class="otbl-wrap" tabindex="0" role="region" aria-label="Your orders"><table class="otbl"><caption class="visually-hidden">Your orders</caption><thead><tr><th scope="col">Order</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col">Items</th><th scope="col" class="num">Total</th><th scope="col"><span class="visually-hidden">Actions</span></th></tr></thead><tbody>{rows}</tbody></table></div></div>
    <div class="acct2__cards" id="profile">
      <div class="acct2__panel"><h2 class="h4">Profile</h2><dl class="kv"><div><dt>Name</dt><dd>Maya Lund</dd></div><div><dt>Email</dt><dd>maya@example.com</dd></div><div><dt>Saved ring size</dt><dd>US 6</dd></div></dl></div>
      <div class="acct2__panel"><h2 class="h4">Default address</h2><address>Maya Lund<br>12 Harbour Street<br>Bristol BS1 4RD<br>United Kingdom</address><a class="link-u" href="account/addresses.html">Manage addresses</a></div>
    </div>"""
    return acct_shell('orders', 'Your account', body)


def account_order():
    lines = [('1591209627710-d2427565a41f', 'Halo Solitaire Ring', '14k white gold · Size 6 · Engraving: “M + T”', 1, 1250)]
    rows = ''.join(f'<tr><th scope="row"><span class="oline"><img src="{U(i, 160, 190)}" alt="" width="64" height="76"><span><strong>{t}</strong><small>{o}</small></span></span></th><td class="num">{q}</td><td class="num" data-money="{p}">${p:,}.00</td></tr>' for i, t, o, q, p in lines)
    body = f"""<div class="acct2__panel">
      <div class="ohead"><div><h2 class="h4">Order #1048</h2><p class="muted">Placed 18 November 2026</p></div><span class="status is-done">Delivered</span></div>
      <ol class="otimeline"><li class="is-done"><strong>Confirmed</strong><span>18 Nov</span></li><li class="is-done"><strong>Hallmarked &amp; packed</strong><span>19 Nov</span></li><li class="is-done"><strong>Shipped, insured</strong><span>20 Nov</span></li><li class="is-done"><strong>Delivered</strong><span>22 Nov</span></li></ol>
      <div class="otbl-wrap" tabindex="0" role="region" aria-label="Items in order #1048"><table class="otbl otbl--lines"><caption class="visually-hidden">Items in order #1048</caption><thead><tr><th scope="col">Item</th><th scope="col" class="num">Qty</th><th scope="col" class="num">Total</th></tr></thead><tbody>{rows}</tbody>
      <tfoot><tr><th scope="row">Subtotal</th><td></td><td class="num" data-money="1250">$1,250.00</td></tr><tr><th scope="row">Shipping (insured)</th><td></td><td class="num">Free</td></tr><tr class="otbl__total"><th scope="row">Total</th><td></td><td class="num" data-money="1250">$1,250.00</td></tr></tfoot></table></div>
      <div class="ohead__actions"><a class="btn btn--primary" href="contact.html">Request a free resize</a><a class="btn btn--outline" href="account/orders.html">Back to orders</a></div>
    </div>
    <div class="acct2__cards"><div class="acct2__panel"><h2 class="h4">Shipping address</h2><address>Maya Lund<br>12 Harbour Street<br>Bristol BS1 4RD<br>United Kingdom</address></div><div class="acct2__panel"><h2 class="h4">Payment</h2><p>Visa ending 4242</p><p class="muted">Billing address same as shipping</p></div></div>"""
    return acct_shell('orders', 'Order #1048', body)


def account_addresses():
    body = """<div class="addr-grid">
      <div class="acct2__panel addr"><span class="addr__tag">Default</span><address>Maya Lund<br>12 Harbour Street<br>Bristol BS1 4RD<br>United Kingdom</address><div class="addr__actions"><button class="link-u" type="button" data-addr-edit>Edit</button><button class="link-u" type="button" data-addr-del>Delete</button></div></div>
      <div class="acct2__panel addr"><address>Maya Lund<br>Studio 4, 88 Canal Road<br>London N1 8RA<br>United Kingdom</address><div class="addr__actions"><button class="link-u" type="button" data-addr-edit>Edit</button><button class="link-u" type="button" data-addr-del>Delete</button><button class="link-u" type="button" data-addr-default>Set as default</button></div></div>
      <button class="addr addr--new" type="button" data-addr-new><span aria-hidden="true">+</span>Add a new address</button>
    </div>
    <div class="acct2__panel" data-addr-form-wrap hidden>
      <h2 class="h4" data-addr-form-title>Add a new address</h2>
      <form class="form-grid" data-validate="address" novalidate>
        <div class="error-summary field--full" data-error-summary tabindex="-1" role="alert" hidden></div>
        <div class="field"><label for="ad-first">First name</label><input id="ad-first" autocomplete="given-name" data-rules="required" data-label="First name"><p class="field__error" id="ad-first-error" hidden></p></div>
        <div class="field"><label for="ad-last">Last name</label><input id="ad-last" autocomplete="family-name" data-rules="required" data-label="Last name"><p class="field__error" id="ad-last-error" hidden></p></div>
        <div class="field field--full"><label for="ad-1">Address</label><input id="ad-1" autocomplete="address-line1" data-rules="required" data-label="Address"><p class="field__error" id="ad-1-error" hidden></p></div>
        <div class="field field--full"><label for="ad-2">Apartment, suite, etc. <span class="muted">(optional)</span></label><input id="ad-2" autocomplete="address-line2"></div>
        <div class="field"><label for="ad-city">City</label><input id="ad-city" autocomplete="address-level2" data-rules="required" data-label="City"><p class="field__error" id="ad-city-error" hidden></p></div>
        <div class="field"><label for="ad-zip">Postcode</label><input id="ad-zip" autocomplete="postal-code" data-rules="required" data-label="Postcode"><p class="field__error" id="ad-zip-error" hidden></p></div>
        <div class="field"><label for="ad-country">Country</label><div class="select"><select id="ad-country" autocomplete="country-name"><option>United Kingdom</option><option>United States</option><option>Canada</option><option>Australia</option><option>Germany</option></select></div></div>
        <div class="field"><label for="ad-phone">Phone <span class="muted">(optional)</span></label><input id="ad-phone" type="tel" autocomplete="tel"></div>
        <label class="fcheck field--full" for="ad-default"><input type="checkbox" id="ad-default"><span class="fcheck__box" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 20 20"><path d="M5 10.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></span><span class="fcheck__label">Set as default address</span></label>
        <div class="field--full form-actions"><button class="btn btn--primary" type="submit">Save address</button><button class="btn btn--outline" type="button" data-addr-cancel>Cancel</button></div>
      </form>
      <div class="form-success" data-form-success tabindex="-1" hidden><h3 class="h4">Address saved</h3><p class="muted">It’s now available at checkout.</p></div>
    </div>"""
    return acct_shell('addresses', 'Addresses', body)


def account_activate():
    return f"""<section class="acct" data-section="Activate account"><div class="container acct__grid">
  <div class="acct__media"><img src="{U('1611085583191-a3b181a88401', 1000, 1300)}" alt="Pearl pendant on a fine gold chain" width="500" height="650"></div>
  <div class="acct__panel">
    {breadcrumbs([('Home', 'index.html'), ('Account', 'account.html'), ('Activate', None)])}
    <h1 class="acct__title">Activate your account</h1>
    <p class="muted">You’ve been invited to an Ocean account for maya@example.com. Create a password to see your orders and start free resizes.</p>
    <form data-validate="activate" novalidate>
      <div class="error-summary" data-error-summary tabindex="-1" role="alert" hidden></div>
      <div class="field"><label for="act-pass">Password</label><div class="field__row"><input id="act-pass" type="password" autocomplete="new-password" data-rules="required min8" data-label="Password"><button type="button" class="field__toggle" data-toggle-pass aria-controls="act-pass" aria-pressed="false">Show</button></div><p class="field__error" id="act-pass-error" hidden></p></div>
      <div class="field"><label for="act-confirm">Confirm password</label><div class="field__row"><input id="act-confirm" type="password" autocomplete="new-password" data-rules="required match" data-match="act-pass" data-label="Password confirmation"><button type="button" class="field__toggle" data-toggle-pass aria-controls="act-confirm" aria-pressed="false">Show</button></div><p class="field__error" id="act-confirm-error" hidden></p></div>
      <button class="btn btn--primary btn--block btn--lg" type="submit">Activate account</button>
      <a class="acct__forgot" href="index.html">Decline invitation</a>
    </form>
    <div class="form-success" data-form-success tabindex="-1" hidden><h2 class="h4">Your account is active</h2><p class="muted">You can now see your orders and saved sizes.</p><a class="btn btn--outline" href="account/orders.html">Go to your account</a></div>
  </div>
</div></section>"""


def policy(kind):
    if kind == 'privacy':
        title, upd = 'Privacy policy', 'Last updated 1 November 2026'
        secs = [('What we collect', 'When you place an order we collect your name, email, shipping and billing address, phone number if you give it, and your order details. Payment information is handled by Shopify Payments and never stored by us.'),
                ('How we use it', 'To process and deliver orders, handle resizing and returns, answer messages, and, if you opt in, send our monthly letter. We do not sell your personal information.'),
                ('Cookies', 'We use essential cookies to keep your bag and session working, and analytics cookies only with your consent. You can change your choice at any time from the cookie banner.'),
                ('Sharing', 'We share the minimum needed with Shopify (our commerce platform), our insured courier, and our payment provider, each under their own privacy terms.'),
                ('Your rights', 'You can ask to see, correct, export or delete your data. Use the contact form and we’ll respond within 30 days.'),
                ('Contact', 'Questions about this policy can be sent through our contact page.')]
    else:
        title, upd = 'Terms of service', 'Last updated 1 November 2026'
        secs = [('Overview', 'These terms apply to all purchases from Ocean Fine Jewellery. By placing an order you agree to them.'),
                ('Products and pricing', 'All jewellery is solid recycled 14k gold unless stated. Prices are shown in your local currency and include tax where applicable. We may correct pricing errors before shipping.'),
                ('Orders', 'An order is accepted when we send a shipping confirmation. Made-to-order and engraved pieces begin production once payment is confirmed.'),
                ('Shipping', 'Orders ship insured within 2 working days. Risk passes to you on delivery.'),
                ('Returns and resizing', 'Unworn pieces can be returned within 60 days. Resizing is free within 60 days, including engraved rings. Engraved pieces cannot be returned for a refund.'),
                ('Warranty', 'Every piece carries a 2-year warranty against manufacturing defects, plus free lifetime polishing.'),
                ('Governing law', 'These terms are governed by the laws of England and Wales.')]
    toc = ''.join(f'<li><a href="#s{i}">{h}</a></li>' for i, (h, _) in enumerate(secs))
    body = ''.join(f'<h2 id="s{i}">{h}</h2><p>{t}</p>' for i, (h, t) in enumerate(secs))
    return f"""<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), (title, None)])}
  <h1 class="phead__title">{title}</h1><p class="phead__lead">{upd}</p>
</div></section>
<section class="section section--tight" data-section="Policy"><div class="container page-layout">
  <nav class="page-toc" aria-label="On this page"><p class="mini-title">Contents</p><ol>{toc}</ol>
    <p class="mini-title mt-24">Other policies</p><ol><li><a href="policies/privacy-policy.html">Privacy policy</a></li><li><a href="policies/terms-of-service.html">Terms of service</a></li><li><a href="page.html#shipping">Shipping &amp; returns</a></li></ol></nav>
  <div class="rte">{body}</div>
</div></section>"""



SETTINGS = [
    ('Theme settings', 'Logo', 'Image picker and width. Works in portrait and landscape.'),
    ('Theme settings', 'Colors', 'Four schemes (background, text, accent, button), each with a matching foreground.'),
    ('Theme settings', 'Typography', 'Heading and body font pickers from the Shopify font library (default DM Sans).'),
    ('Theme settings', 'Corner style', 'Rounded or square.'),
    ('Theme settings', 'Section spacing', 'Top and bottom padding per section (desktop 75 px, tablet 60 px, mobile 48 px), with a “remove top padding” option.'),
    ('Theme settings', 'Image overlay', 'Overlay strength for text on images, default 40%.'),
    ('Theme settings', 'Cart', 'Drawer or page, free-shipping threshold, cart upsell (product recommendations or a chosen collection), gift wrap product picker.'),
    ('Header', 'Layout', 'Centered logo, sticky on/off, mega menu with promo image, account icon (shopify-account) on every breakpoint.'),
    ('Announcement bar', 'Messages', 'Up to 3 text blocks with links; country and language selectors on/off.'),
    ('Slideshow', 'Slides', 'Image, heading, text, button per block; autoplay (pausable) and speed. First slide is the LCP image.'),
    ('Featured product', 'Product', 'Product picker, media (image, video, 3D), variant picker, buy buttons, @app blocks.'),
    ('Main product', 'Blocks', 'Title, price, variant picker, purchase options (selling plans), engraving field, quantity, buy buttons, pickup, USP list, collapsible tabs, true-size view, worn-with strip, share, @app and Custom Liquid.'),
    ('Main product', 'Sticky add to cart', 'On or off.'),
    ('Shop the look', 'Hotspots', 'Image plus up to 6 hotspot blocks, each with a product and X/Y position.'),
    ('Stack builder', 'Steps', 'Up to 4 step blocks, each with a product list. Discount label off by default and shown only when the merchant has created the automatic discount.'),
    ('Multicolumn', 'Columns', 'Number, suffix, heading and text per block; optional image.'),
    ('Testimonials', 'Quotes', 'Merchant-written quote, name and optional product link. No ratings or “verified” labels.'),
    ('Collection', 'Filters', 'Filter drawer with counts; story tile on or off.'),
    ('Every template', 'Custom Liquid', 'Custom Liquid section and block available on all section templates.'),
]


def states():
    def block(n, title, note, inner):
        return f'<section class="stcard"><header><span class="stcard__n">{n:02d}</span><h2>{title}</h2></header><p class="muted">{note}</p><div class="stcard__demo">{inner}</div></section>'
    blocks = [
        block(1, 'Hover', 'Mouse over the image for the jeweller’s loupe; the add button expands.', '<ul class="product-grid st-grid" data-st-hover></ul>'),
        block(2, 'Focus', 'Every interactive element has a visible 2px focus ring. Press Tab anywhere on the site.', '<div class="st-row"><button class="btn btn--primary is-focus">Primary button</button><button class="btn btn--outline is-focus">Outline</button><a class="link-arrow is-focus" href="page.html">Text link →</a></div><div class="field st-mt"><label for="st-f">Text field</label><input id="st-f" class="is-focus" value="Focused field"></div>'),
        block(3, 'Loading', 'Skeleton cards while filters update, and a spinner inside buttons while a request runs.', '<ul class="product-grid st-grid st-grid--2" data-st-loading aria-busy="true"></ul><div class="st-row st-mt"><button class="btn btn--primary is-loading" disabled aria-busy="true">Add to bag</button><button class="btn btn--outline is-loading" disabled>Saving</button></div>'),
        block(4, 'Empty collection', 'Live example: <a class="link-btn" href="collection.html?c=archive">The Archive</a>.', '<div class="state-empty"><h3 class="h4">This collection is empty</h3><p class="muted">There are no products here yet.</p><a class="btn btn--primary" href="collections.html">Browse collections</a></div>'),
        block(5, 'Error', 'Inline field errors with an error summary, and a stock limit message.', '<div class="error-summary" role="alert"><p><strong>Please fix 1 error:</strong></p><ul><li><a href="#st-e">Enter a valid email address, like name@example.com.</a></li></ul></div><div class="field has-error"><label for="st-e">Email</label><input id="st-e" value="name@" aria-invalid="true" aria-describedby="st-e-err"><p class="field__error" id="st-e-err">Enter a valid email address, like name@example.com.</p></div><p class="form-msg is-error">You can only add 3 of this item to your bag.</p>'),
        block(6, 'Sold out / unavailable variant', 'Crossed-out options, a notice and an “Email me when it’s available” link. Try the options below.', '<div class="st-variant" data-st-variant></div>'),
        block(7, 'Empty cart', 'Live: <a class="link-btn" href="index.html?cart=open">open the cart drawer</a> with nothing in it.', '<div class="cart-empty st-cart-empty"><p class="h4">Your bag is empty</p><p class="muted">Not sure where to start? Our most-worn piece is a good first one.</p><a class="btn btn--primary" href="collection.html">Shop the collection</a></div>'),
        block(8, 'Search no results', 'Live example: <a class="link-btn" href="search.html?q=xyz">search “xyz”</a>.', '<div class="state-empty"><h3 class="h4">No results for “xyz”</h3><p class="muted">Check the spelling or try one of these:</p><ul class="chips chips--center"><li><a href="search.html?q=ring">ring</a></li><li><a href="search.html?q=pearl">pearl</a></li></ul></div>'),
        block(9, 'Long product title', 'Titles are never truncated; the grid stays aligned.', '<ul class="product-grid st-grid" data-st-long></ul>'),
        block(10, 'Product without image', 'A branded placeholder keeps the card the same size.', '<ul class="product-grid st-grid" data-st-noimg></ul>'),
        block(11, 'Sold-out product', 'Badge, muted image and a disabled add button.', '<ul class="product-grid st-grid" data-st-sold></ul>'),
        block(12, 'Video media', 'Poster with a play badge; plays inline with controls. Also used for YouTube and Vimeo media.', '<div class="st-media" data-st-media></div>'),
        block(13, '3D and AR media', 'Opens a 3D view with button controls (rotate, zoom, reset) as a single-tap alternative to gestures, and “View in your space” on phones.', '<div class="st-media" data-st-media3d></div>'),
        block(14, 'Selling plan and gift card', 'Purchase options on the product page, plan name on cart lines; gift card with recipient form.', '<div class="st-row"><a class="btn btn--outline" href="product.html?id=1">Selling plan</a><a class="btn btn--outline" href="product.html?id=20">Gift card product</a><a class="btn btn--outline" href="password.html?state=error">Password error</a><a class="btn btn--outline" href="gift-card.html?state=expired">Expired gift card</a></div>'),
    ]
    rows = ''.join(f'<tr><td>{a}</td><th scope="row">{b}</th><td>{c}</td></tr>' for a, b, c in SETTINGS)
    from partials import TEMPLATES
    links = ''.join(f'<li><a href="{u}">{t}</a></li>' for u, t in TEMPLATES)
    return f"""<section class="phead" data-section="Page header"><div class="container">
  {breadcrumbs([('Home', 'index.html'), ('Theme states', None)])}
  <h1 class="phead__title">Theme states and settings</h1>
  <p class="phead__lead">Every state reviewers check, every template preview, and the merchant settings behind them.</p>
</div></section>
<section class="section section--tight" data-section="Preview links"><div class="container"><ul class="stlinks">{links}</ul></div></section>
<section class="section section--tight" data-section="States"><div class="container"><div class="stgrid">{''.join(blocks)}</div></div></section>
<section class="section section--tight" data-section="Settings map"><div class="container">
  <div class="section-head"><div><h2 class="h2">Settings map</h2><p class="muted">What merchants can change in the theme editor. The live ones are in the Theme settings button.</p></div></div>
  <div class="otbl-wrap" tabindex="0" role="region" aria-label="Merchant settings"><table class="otbl settings-table"><caption class="visually-hidden">Merchant settings</caption><thead><tr><th scope="col">Where</th><th scope="col">Setting</th><th scope="col">Options</th></tr></thead><tbody>{rows}</tbody></table></div>
</div></section>"""
