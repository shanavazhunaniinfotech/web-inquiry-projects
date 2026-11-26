/* Design notes: why each section is where it is (shown via the "Design notes" button and on /strategy/) */
window.NOTES = [
  {
    key: 'topbar',
    title: 'Phone number above everything',
    why: 'Most rental leads in this market still come in by phone. The number is the first thing visitors see, on every screen size, and is tap-to-call on mobile.',
    cro: ['A green "live" dot signals a real person is reachable', 'Promises "personal advice from the owner": your biggest edge over national chains']
  },
  {
    key: 'header',
    title: 'Sticky header with a quote list',
    why: 'The menu follows the visitor down the page, so the phone number and the "Offerte" button are never more than one tap away. The counter works like a shopping cart: visitors collect wagons, then request one quote for all of them.',
    cro: ['Menu items are the real questions people have: range, how many, prices, process, FAQ', 'Replaces the old flat "Uw offerte aanvraag" page with an e-commerce style flow WooCommerce can support (quote cart plugin)']
  },
  {
    key: 'hero',
    title: 'Hero: benefit first, price anchor visible',
    why: 'The old site opens with a keyword-heavy headline. The new one sells the outcome ("toilets your guests talk about"), then answers the three questions every visitor has within 5 seconds: what does it cost (from €225), who does the work (we deliver, place and collect), and what is included (toilet paper, soap, dryers).',
    cro: ['Real photo of your VIP Hout wagon instead of stock photos: builds trust', 'Two CTAs: one for people who need advice, one for people who already know what they want', 'Floating cards highlight the bestseller and what is included']
  },
  {
    key: 'booking',
    title: 'Hotel-style booking bar',
    why: 'Borrowed from hotel and car-rental sites, which convert very well. Visitors enter event type, date, guests and location in 30 seconds. Clicking the button fills in the advisor and the quote form for them, so they never type the same thing twice.',
    cro: ['Small "micro-commitment" that pulls people into the funnel', '"Vrijblijvend · geen account nodig" removes fear of commitment']
  },
  {
    key: 'proof',
    title: 'Proof in numbers',
    why: 'Only real facts from your current site: 13 models, events up to 1000+ guests, 3 countries, from €225 a day. Big numbers make a small family business look established and capable of large events.',
    cro: ['Event types scroll past to show "we have done your kind of event"', 'Can later add: years in business, number of events per year, Google score']
  },
  {
    key: 'advisor',
    title: 'Toilet advisor (the key conversion tool)',
    why: 'The number one question customers ask is "how many toilets do I need?". Today they have to call or guess. The advisor answers it instantly with your real models and prices, and puts the advice in the quote with one click. Interactive tools like this keep people on the page and turn uncertain visitors into leads.',
    cro: ['Uses common event guidelines (about 1 toilet per 75–100 guests, more with alcohol or long events)', 'Shows an indicative price right away: no surprise later', 'Upsells naturally: plaszuilen for big events, MIVA when guests have a disability', 'The formula is easy to adjust to your own experience']
  },
  {
    key: 'products',
    title: 'All 13 products with prices, filters and quick view',
    why: 'All products, prices and specs come straight from your current WooCommerce store. Each card shows the layout (ladies / gents / urinals) and the price, so visitors can compare without opening 13 pages. "Snel bekijken" opens photos and full specs in a popup.',
    cro: ['Filters by need (small party, luxury, large events, accessible) instead of by technical name', 'Day / weekend price switch', 'Badges guide the choice: "Meest gekozen", "Laagste prijs", "Nieuw"', '"+ Offerte" adds to the quote list without leaving the page']
  },
  {
    key: 'luxe',
    title: 'Luxury details: justify the premium',
    why: 'Your VIP wagons cost €100–170 more per day than a mini. This dark, premium section shows why: LED lighting, wooden floors, design washbasins, waterless urinals. It moves the conversation from price to quality.',
    cro: ['Interior photos (from your site) prove the claims', 'Strong line: "Not a site hut. A bathroom on wheels."', 'Button takes visitors straight to the luxury filter']
  },
  {
    key: 'occasions',
    title: 'Choose by occasion',
    why: 'People think in events, not in wagon types. Each tile shows what others usually choose. One click pre-fills the advisor for that type of event, so a bride and a festival organiser each get relevant advice.',
    cro: ['Also good for SEO: later each tile can link to its own landing page ("toiletwagen huren bruiloft")', 'Event photos are placeholders from Unsplash: we can swap in your own event photos']
  },
  {
    key: 'process',
    title: 'Process + what you need on site',
    why: 'Four simple steps remove the fear that renting a toilet wagon is complicated. The "what do you need on location" box answers the technical questions (power, drainage, space) before they become a reason to delay.',
    cro: ['Mentions the septic tank and the no-drain models, so nobody drops out because there is no sewer']
  },
  {
    key: 'pricing',
    title: 'Clear pricing table',
    why: 'Price is the main search intent ("toiletwagen huren prijs"). Showing all prices openly builds trust and pre-qualifies leads, so you spend less time on people who were never going to book. Click a row to see the full details.',
    cro: ['Clear "always included" and "optional" lists', 'Good for Google: a clear price table can appear in search results']
  },
  {
    key: 'reviews',
    title: 'Reviews (PLACEHOLDERS)',
    why: 'Social proof is one of the strongest conversion factors. The three reviews shown are example texts only. They must be replaced with your real Google reviews (or a live Google reviews widget) before going live.',
    cro: ['Each review mentions the event type, the number of guests and the model, so visitors find a review that matches their situation']
  },
  {
    key: 'area',
    title: 'Service area + distance check',
    why: 'Visitors from Belgium or Germany often wonder whether you deliver to them. The distance check answers instantly and shows the transport rate (€1 per km), so there are no surprises.',
    cro: ['Shows you are local (Boxtel) and cover 3 countries', 'Distances are approximate and easy to adjust']
  },
  {
    key: 'faq',
    title: 'FAQ: handles objections + SEO',
    why: 'Answers the questions that stop people from booking: how many, how much, no sewer, accessibility, Belgium/Germany, long-term rental. In WordPress we add FAQ schema so Google can show these answers in search results.',
    cro: ['WhatsApp button for people who prefer chatting']
  },
  {
    key: 'final',
    title: 'Personal closing: the owner replies',
    why: 'Your biggest advantage over large national companies is personal service. The final section puts you (Daan) in front, with phone, WhatsApp and a short form. The quote list is attached automatically. A real photo of you replaces the "DS" avatar.',
    cro: ['Only 3 required fields: fewer fields means more requests', 'Clear "Vrijblijvend" label and a privacy line reduce hesitation', 'In WordPress this connects to Gravity Forms / WPForms + email notification']
  },
  {
    key: 'footer',
    title: 'Footer with your network of sites',
    why: 'Keeps the links to Douchewagen Huren, Smulders Verhuur and Aquacore (cross-selling and SEO), plus complete contact details, which also help local SEO.'
  },
  {
    key: 'mbar',
    title: 'Mobile action bar',
    why: 'On phones a bar with Call, WhatsApp and Quote appears after the hero. Most event planning happens on mobile, and this keeps the main action one tap away at all times.'
  }
];
