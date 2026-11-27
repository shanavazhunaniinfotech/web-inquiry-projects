"""One-off: five design fixes from the third re-review."""
import os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
def edit(path, pairs):
    path = os.path.join(ROOT, path); s = open(path).read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:90]); s = s.replace(a, b)
    open(path, 'w').write(s)

# 3. drawer: no "$0.00" placeholder in the markup; only filled when a discount applies
edit('_build/partials.py', [('<strong data-cart-discount>−$0.00</strong>', '<strong data-cart-discount></strong>')])
edit('script.js', [
    ("$('[data-bundle-row]', drawer).hidden = t.disc <= 0;\n      $('[data-cart-discount]', drawer).textContent = '−' + money(t.disc);",
     "var hasDisc = t.disc >= 0.005;\n      $('[data-bundle-row]', drawer).hidden = !hasDisc;\n      $('[data-cart-discount]', drawer).textContent = hasDisc ? '−' + money(t.disc) : '';"),
    # 4. quick view: gift card is delivered by email
    ("'<p class=\"qv__tax\">Tax included. Shipping calculated at checkout.</p>' +",
     "'<p class=\"qv__tax\">' + (p.giftCard ? 'Delivered by email. No shipping needed.' : 'Tax included. Shipping calculated at checkout.') + '</p>' +"),
])
edit('pages.js', [
    # 2. no developer note in the storefront
    ("'<p class=\"plans__note\">Selling plans are created by the merchant in Shopify and shown here automatically.</p></fieldset>'", "'</fieldset>'"),
    # 4. gift card: email delivery wording, recipient email required when sending as a gift
    ("if (st === 'available') return '<p class=\"stock\"><span></span>In stock, ready to ship</p>';",
     "if (st === 'available') return p.giftCard ? '<p class=\"stock\"><span></span>Delivered by email, usually within minutes</p>' : '<p class=\"stock\"><span></span>In stock, ready to ship</p>';"),
    ("'<p class=\"pinfo__tax\">Tax included. <a href=\"' + R + 'page/#shipping\">Shipping</a> calculated at checkout.</p>' +",
     "(p.giftCard ? '<p class=\"pinfo__tax\">Delivered by email. No shipping needed.</p>' : '<p class=\"pinfo__tax\">Tax included. <a href=\"' + R + 'page/#shipping\">Shipping</a> calculated at checkout.</p>') +"),
    ("'<div class=\"field\"><label for=\"g-email\">Recipient email</label><input id=\"g-email\" type=\"email\" autocomplete=\"off\" value=\"' + esc(sel.gEmail || '') + '\"><p",
     "'<div class=\"field\"><label for=\"g-email\">Recipient email <span class=\"muted\">(required)</span></label><input id=\"g-email\" type=\"email\" autocomplete=\"off\" aria-describedby=\"g-email-error\"' + (sel.gift ? ' required aria-required=\"true\"' : '') + ' value=\"' + esc(sel.gEmail || '') + '\"><p"),
    ("if (e.target.id === 'gift-send') { sel.gift = e.target.checked; $('[data-gift-fields]').hidden = !sel.gift; if (sel.gift) $('#g-email').focus(); }",
     "if (e.target.id === 'gift-send') { sel.gift = e.target.checked; $('[data-gift-fields]').hidden = !sel.gift; var gm = $('#g-email'); gm.required = sel.gift; if (sel.gift) { gm.setAttribute('aria-required', 'true'); gm.focus(); } else { gm.removeAttribute('aria-required'); gm.removeAttribute('aria-invalid'); $('#g-email-error').hidden = true; } }"),
])
# 1. price stays inline in the section intro
edit('ready.css', [])
s = open(os.path.join(ROOT, 'ready.css')).read()
s += """
/* review 3: intro paragraph stays one flow of text so the price is inline */
p.section-head__side { display: block; }

/* review 3: phone hero slide tabs on one line, row fits the first screen */
@media (max-width: 749px) {
  .hero__controls { margin-top: 20px; }
  .hero__progress { gap: 8px; }
  .hero__dot { gap: 6px; min-width: 0; }
  .hero__dot em { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: .04em; }
  .hero__dot em b { display: none; }
}
"""
open(os.path.join(ROOT, 'ready.css'), 'w').write(s)
# 5. tab numbers hidden on phones so labels fit on one line
s = open(os.path.join(HERE, 'home.py')).read()
for n, w in (('01', 'Necklaces'), ('02', 'Pearls'), ('03', 'Bridal')):
    a = f'<em>{n} {w}</em>'; assert s.count(a) == 1, a; s = s.replace(a, f'<em><b>{n} </b>{w}</em>')
open(os.path.join(HERE, 'home.py'), 'w').write(s)
print('review-3 patch applied')
