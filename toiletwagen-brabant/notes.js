/* Design notes: why each section is where it is (shown via the "Design notes" button and on /strategy/) */
window.NOTES = [
  {
    key: 'header',
    title: 'Floating header: phone + quote always in reach',
    why: 'The header turns into a floating glass bar when you scroll, hides while reading down and comes back the moment you scroll up. The phone number (with a green "live" dot) and the gold "Offerte" button with a counter are always one click away.',
    cro: ['Most toilet-trailer leads still come in by phone: it gets prime position', 'The counter works like a shopping cart: visitors collect models, then send one request']
  },
  {
    key: 'hero',
    title: 'Cinematic hero: premium first impression',
    why: 'Black and gold, a big confident headline ("Toiletwagens met de allure van een vijfsterrenhotel"), and your real wagons rotating in an arch frame. This lifts the brand above the typical "portable toilet" look of competitors and justifies your VIP prices from the very first second.',
    cro: ['Within 5 seconds visitors know: what (luxury toilet trailers), price (from €225), service (delivered, placed, collected) and area (NL, BE, DE)', 'Two CTAs: "Bereken mijn toiletwagen" for people who need help, "Bekijk de collectie" for people who already know', 'The rotating "vanaf €225" seal anchors the price early', 'The "Nieuw: MIVA toilet" pill shows the company is active and current']
  },
  {
    key: 'booking',
    title: 'Hotel-style booking bar',
    why: 'Borrowed from hotel and car-rental sites, which convert very well. Event type, date, guests and location take 30 seconds. One click fills in the advisor and the quote form, so visitors never type anything twice.',
    cro: ['A small first commitment that pulls visitors into the funnel', '"Vrijblijvend · persoonlijk antwoord van de eigenaar" removes hesitation']
  },
  {
    key: 'band',
    title: 'Gold event band',
    why: 'A slanted gold ribbon with event types reacts to scroll speed. It signals energy and shows instantly that you serve weddings, parties, festivals, companies and construction sites.'
  },
  {
    key: 'statement',
    title: 'The brand promise (scroll-revealed)',
    why: '"Niemand onthoudt een goed toilet. Iedereen onthoudt een slecht toilet." The words light up as you scroll. It names the real fear of every host (embarrassing toilets) and positions you as the solution. Below it: big, real numbers (13 models, 1000+ guests, 3 countries, from €225).',
    cro: ['Emotional hook before the product details', 'Numbers make a family business feel established and capable of large events']
  },
  {
    key: 'collection',
    title: 'The collection: pinned horizontal showcase',
    why: 'Instead of a flat product grid, the 13 models are grouped into 7 series that glide sideways as you scroll, like a luxury car configurator. Each series has variant buttons (e.g. Mini: Grijs / Hout / Wit / Vacuüm) that switch the photo, layout and price instantly.',
    cro: ['Fewer choices at once means less choice overload, but all 13 products stay available', 'Layout icons (ladies / gents / urinals) make comparing easy at a glance', 'Day / weekend price switch, "+ Offerte" on every card, detail popup with photos and specs', 'Ends with a "Twijfelt u?" card that sends undecided visitors to the advisor', 'On mobile it becomes a native swipe carousel']
  },
  {
    key: 'advisor',
    title: 'Toilet advisor (the main conversion tool)',
    why: 'The number one question is "how many toilets do I need?". The advisor answers it live: guests, duration, alcohol, accessibility and "luxury look". You see the number of toilet places light up as icons, an expected queue indicator, the recommended models and the price. One click puts it all in the quote.',
    cro: ['Interactive tools keep people on the page and turn doubt into action', 'Shows price straight away: better-qualified leads', 'Natural upsells: plaszuilen for big events, MIVA for accessibility, VIP when "luxe" is on', 'Formula is based on common event guidelines and easy to tune to your experience']
  },
  {
    key: 'luxe',
    title: 'Luxury details: justify the premium',
    why: 'A sticky arch image changes as you read each detail: LED lighting, wooden floors, design washbasins, waterless urinals. All photos are your own interiors. This moves the conversation from price to quality.',
    cro: ['Strong line: "Geen bouwkeet. Een badkamer op wielen."', 'Button jumps straight to the VIP series in the collection']
  },
  {
    key: 'occasions',
    title: 'Choose by occasion (hover reveal)',
    why: 'People think in events, not wagon types. Large rows per occasion show the usual guest count and the models others choose. On desktop a photo follows the cursor. One click fills the advisor for that event.',
    cro: ['Good for SEO later: each row can get its own landing page ("toiletwagen huren bruiloft")', 'Event photos are Unsplash placeholders and can be swapped for your own event photos']
  },
  {
    key: 'process',
    title: 'Four steps + what you need on site',
    why: 'Removes the fear that renting is complicated. The gold line draws itself as you scroll. The chips below answer the technical questions (power, drain, no sewer, no-drain models) before they become a reason to delay.'
  },
  {
    key: 'pricing',
    title: 'Transparent price list',
    why: 'All 13 models with day and weekend prices in one clean table, with "+" buttons to add straight to the quote. Price is the main search intent ("toiletwagen huren prijs"). Showing it openly builds trust and pre-qualifies leads.',
    cro: ['"Always included" vs "optional" removes doubt about hidden costs', 'Click a row to see photos and specifications']
  },
  {
    key: 'reviews',
    title: 'Reviews (PLACEHOLDERS)',
    why: 'Large editorial quotes are social proof. The three reviews are example texts only. They must be replaced with your real Google reviews (or a live Google widget) before going live.'
  },
  {
    key: 'area',
    title: 'Service area + distance check',
    why: 'A radar map from Boxtel shows your reach across NL, BE and DE. Visitors type their town and get an instant answer with the distance and the transport rate.',
    cro: ['Answers "do you deliver to me?" without a phone call', 'Distances are approximate and easy to adjust']
  },
  {
    key: 'faq',
    title: 'FAQ: objections + SEO',
    why: 'Answers the questions that stop people from booking: how many, how much, no sewer, accessibility, Belgium/Germany, long-term rental. In WordPress we add FAQ schema so Google can show these answers in search results.',
    cro: ['WhatsApp button for people who prefer chatting']
  },
  {
    key: 'final',
    title: 'Personal closing: the owner replies',
    why: 'Your biggest edge over large national companies is personal service. A huge closing headline, you (Daan) as the contact, phone and WhatsApp buttons, and a short form that already contains the visitor\'s quote list.',
    cro: ['Only 3 required fields', '"Vrijblijvend" label and a privacy line reduce hesitation', 'Replace the "DS" circle with a real photo of you: faces increase trust']
  },
  {
    key: 'footer',
    title: 'Footer with your network of sites',
    why: 'Full contact details (local SEO), links to Douchewagen Huren, Smulders Verhuur and Aquacore, and a large brand wordmark to close the page with confidence.'
  },
  {
    key: 'mbar',
    title: 'Mobile action bar',
    why: 'On phones a bar with Call, WhatsApp and Quote appears after the hero, so the main action is always one tap away.'
  }
];
