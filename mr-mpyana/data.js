/* =========================================================================
   MR MPYANA — SITE DATA
   This is the ONLY file you need to edit to update contact details or add
   new logo projects. No redesign needed: the Home, Portfolio and Services
   pages read everything from here.
   ========================================================================= */

window.MPYANA = {

  /* ---------------------------------------------------------------------
     CONTACT DETAILS
     PROTOTYPE NOTE: the values below are placeholders until Mr Mpyana
     confirms his real details. Replace them and set `placeholder: false`
     to hide the "details pending" notes on the site.
     - whatsapp: international format, digits only (27 = South Africa)
     --------------------------------------------------------------------- */
  contact: {
    placeholder: true,
    whatsapp: "27000000000",
    email: "hello@mrmpyana.co.za",
    fiverr: "https://www.fiverr.com/",
    location: "South Africa",
    socials: [
      { name: "Instagram", url: "https://www.instagram.com/" },
      { name: "TikTok", url: "https://www.tiktok.com/" },
      { name: "Facebook", url: "https://www.facebook.com/" },
      { name: "X", url: "https://x.com/" }
    ]
  },

  /* ---------------------------------------------------------------------
     CATEGORIES (used by portfolio filters and services)
     --------------------------------------------------------------------- */
  categories: [
    { id: "logo",     label: "Logo Design" },
    { id: "brand",    label: "Brand Logo" },
    { id: "gaming",   label: "Gaming Logo" },
    { id: "business", label: "Business Logo" }
  ],

  /* ---------------------------------------------------------------------
     PROJECTS
     To add a new logo: copy one block, change the values, drop the image
     in /images. Newest first. `featured: true` puts it on the home page.
     `size` controls the editorial layout: "xl", "tall", "wide" or "sq".
     Blocks with `slot: true` are open placeholders shown until real work
     is added — delete them as genuine projects come in.
     --------------------------------------------------------------------- */
  projects: [
    {
      id: "signature-emblem",
      title: "Mr Mpyana Signature Emblem",
      category: ["gaming", "brand"],
      year: "2024",
      image: "images/mr-mpyana-emblem.webp",
      thumb: "images/mr-mpyana-emblem-sm.webp",
      details: ["images/crop-monogram.webp", "images/crop-wordmark.webp"],
      featured: true,
      size: "xl",
      summary: "The designer's own mark: a faceted M monogram set inside a shield and circular neon frame, with a split red-and-white wordmark. Built to read like a collectible: Version 06 / 1000, Limited Edition, Est. 2024.",
      notes: ["Shield-framed M monogram", "Red / white split wordmark", "Neon glow on deep black", "Edition-style typography ring"]
    },
    { id: "slot-business", slot: true, title: "Business Logo", category: ["business"], size: "tall", glyph: "square" },
    { id: "slot-gaming",   slot: true, title: "Gaming Logo",   category: ["gaming"],   size: "sq",   glyph: "shield" },
    { id: "slot-brand",    slot: true, title: "Brand Logo",    category: ["brand"],    size: "wide", glyph: "word" },
    { id: "slot-business-2", slot: true, title: "Business Logo", category: ["business"], size: "wide", glyph: "square" },
    { id: "slot-logo",     slot: true, title: "Logo Design",   category: ["logo"],     size: "sq",   glyph: "circle" }
  ]
};
