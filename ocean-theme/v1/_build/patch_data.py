"""One-off: bring v1/data.js in line with the Theme Store review (run once)."""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
d = open('data.js').read()

# Ratings come from the standard reviews metafields; null = no ratings yet (card hides stars)
rev = {1: 64, 2: 41, 3: 18, 4: 72, 5: 38, 6: 22, 7: 29, 8: 11, 9: 9, 10: 24, 11: 13, 12: 0, 13: 19, 14: 33, 15: 0, 16: 0, 17: 21, 18: 14, 19: 27}
lines = d.split('\n')
stop = next(i for i, l in enumerate(lines) if 'var COLLECTIONS' in l)
for i, l in enumerate(lines[:stop]):
    m = re.match(r"\s*\{ id: (\d+),", l)
    if m and int(m.group(1)) in rev:
        n = rev[int(m.group(1))]
        l = re.sub(r"reviews: \d+", "reviews: %d" % n, l)
        if n == 0:
            l = re.sub(r"rating: [\d.]+", "rating: null", l)
        lines[i] = l
d = '\n'.join(lines)
d = re.sub(r"\[(0\.\d+), (0\.\d+), (\d(?:\.\d+)?)\]", lambda m: "[%s, %s, %s]" % (m.group(1), m.group(2), m.group(3) if float(m.group(3)) <= 2.4 else '2.4'), d)

rep = {
    "in 18k Yellow Gold with Matching Gift Box": "in 14k Yellow Gold with Matching Gift Box",
    "Rope-twist hoops in solid 14k gold vermeil. Light enough": "Rope-twist hoops in solid 14k recycled gold. Hollow-formed, so they are light enough",
    "A 4 mm comfort-fit band in solid 18k gold, with free engraving inside.": "A 4 mm comfort-fit band in solid 14k recycled gold, with free engraving inside.",
    "Elongated paperclip links in recycled gold vermeil, worn high and short.": "Elongated paperclip links in solid 14k recycled gold, worn high and short.",
    "Interlocking infinity links set with crystals, in rose gold vermeil. Restocking soon.": "Interlocking infinity links pavé-set with white topaz, in 14k rose gold. Restocking soon.",
    "stone: 'Crystal', price: 240": "stone: 'Topaz', price: 240",
    "Pear-cut morganite drops with a crystal halo, on rose gold vermeil hooks.": "Pear-cut morganite drops with a white topaz halo, on 14k rose gold hooks.",
    "handle: 'caring-for-gold-vermeil', title: 'Caring for gold vermeil so it lasts'": "handle: 'caring-for-solid-gold', title: 'Caring for solid gold so it lasts'",
    "excerpt: 'Simple habits that keep the shine for years, plus our free polishing service.'": "excerpt: 'Simple habits that keep 14k gold bright for decades, plus our free polishing service.'",
    "desc: 'Every piece we make, in recycled gold and conflict-free stones.'": "desc: 'Every piece we make, in solid recycled 14k gold.'",
    "desc: 'Hoops, studs and drops, all hypoallergenic and nickel-free.'": "desc: 'Hoops, studs and drops in solid 14k gold, nickel-free.'",
}
for a, b in rep.items():
    assert a in d, a
    d = d.replace(a, b)

# Rich media, true-size dimensions and selling plans, keyed by product id
extra = {
    1: "media: [{ type: 'video', src: 'media/pearl.mp4', poster: 'media/pearl-poster.jpg', alt: 'Tide Pearl Pendant worn, slow close-up' }], size: { shape: 'circle', mm: 9, label: 'Pearl about 9 mm' }, sellingPlans: [{ id: 'mto', name: 'Made to order', note: 'Your pearl is matched by hand. Ships in 3–4 weeks.', off: 0.05 }]",
    2: "media: [{ type: 'model', src: 'media/ring.glb', alt: '3D model of the Halo Solitaire Ring' }], size: { shape: 'ring', mm: 6.5, label: 'Centre stone 6.5 mm (0.5 ct)' }",
    3: "size: { shape: 'ring', mm: 7, label: 'Centre stone 7 × 5 mm' }",
    4: "size: { shape: 'hoop', mm: 20, label: 'Small hoop 20 mm across' }",
    5: "size: { shape: 'bar', mm: 4, label: 'Chain 4 mm wide' }, sellingPlans: [{ id: 'mto', name: 'Made to order in your length', note: 'Cut and finished for you. Ships in 2–3 weeks.', off: 0.05 }]",
    6: "size: { shape: 'circle', mm: 7.5, label: 'Stud 7.5 mm across' }",
    7: "size: { shape: 'circle', mm: 14, label: 'Leaf 14 mm tall' }",
    10: "media: [{ type: 'video', src: 'media/chain.mp4', poster: 'media/chain-poster.jpg', alt: 'Bold Link Chain worn, slow close-up' }], size: { shape: 'bar', mm: 7, label: 'Links 7 mm wide' }",
    13: "size: { shape: 'circle', mm: 12, label: 'Drop 12 mm long' }",
    14: "media: [{ type: 'model', src: 'media/ring.glb', alt: '3D model of a gold ring' }], size: { shape: 'band', mm: 4, label: 'Band 4 mm wide' }",
    15: "size: { shape: 'circle', mm: 16, label: 'Crescent 16 mm across' }",
}
lines = d.split('\n')
out = []
in_products = True
for i, l in enumerate(lines):
    out.append(l)
    if 'var COLLECTIONS' in l: in_products = False
    m = re.match(r"\s*\{ id: (\d+),", l)
    if in_products and m and int(m.group(1)) in extra:
        out.append('      ' + extra[int(m.group(1))] + ',')
d = '\n'.join(out)

d = d.replace("""      desc: 'Elongated paperclip links in solid 14k recycled gold, worn high and short.' }
  ];""", """      desc: 'Elongated paperclip links in solid 14k recycled gold, worn high and short.' },
    { id: 20, handle: 'gift-card', title: 'Ocean Gift Card', type: 'Gift card', stone: 'None', price: 50, compare: 0, rating: null, reviews: 0, badge: '', tags: ['gifts'],
      photo: null, giftCard: true, metals: ['yellow'], sizes: ['$50', '$100', '$250', '$500'], stock: 999, hidden: true,
      desc: 'Delivered by email on the date you choose, with your message. Never expires and can be used on anything in the store.' },
    { id: 21, handle: 'gift-wrap', title: 'Gift wrap', type: 'Gift wrap', stone: 'None', price: 8, compare: 0, rating: null, reviews: 0, badge: '', tags: [],
      photo: null, giftWrap: true, metals: ['yellow'], sizes: ['Ribbon and card'], stock: 999, hidden: true,
      desc: 'Recycled paper, silk ribbon and a handwritten card. A product the merchant picks in theme settings.' }
  ];""")
assert "id: 20" in d and "id: 21" in d
d = d.replace("yellow: { label: '14k Yellow gold'", "yellow: { label: '14k yellow gold'").replace("white: { label: '14k White gold'", "white: { label: '14k white gold'").replace("rose: { label: '14k Rose gold'", "rose: { label: '14k rose gold'")
open('data.js', 'w').write(d)
print('data.js patched')
