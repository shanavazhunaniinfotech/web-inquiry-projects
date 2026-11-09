/* Sell HOU 2 You Team — shared content for both design versions.
   Listings, reviews, team and areas come from the team's current site (hou2you.rmxgrand.com). */
(function () {
  var U = function (id, w) { return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 900) + '&q=72'; };
  var IDX = 'https://hou2you.rmxgrand.com/';

  window.SH_DATA = {
    idx: {
      search: IDX + 'index.php?advanced=1',
      map: IDX + 'index.php?showagency=1&rtype=map',
      ours: IDX + 'index.php?showagency=1#rslt',
      login: IDX + 'login.php?login=1',
      testimonials: IDX + 'testimonials.php',
      roster: IDX + 'agents.php',
      resources: IDX + 'resources.php',
      home: IDX
    },
    img: U,
    listings: {
      ours: [
        { city: 'Katy', price: 945000, type: 'Single Family', beds: 4, baths: 3.5, sqft: 4403, img: U('1599809275671-b5942cabc7a2', 1400), tag: 'Featured' },
        { city: 'Fulshear', price: 650000, type: 'Single Family', beds: 4, baths: 3.5, sqft: 2776, img: U('1598228723793-52759bba239c') },
        { city: 'Katy', price: 465000, type: 'Single Family', beds: 5, baths: 3.5, sqft: 3166, img: U('1558036117-15d82a90b9b1') },
        { city: 'Fulshear', price: 415000, type: 'Single Family', beds: 4, baths: 3, sqft: 2369, img: U('1449844908441-8829872d2607') },
        { city: 'Houston', price: 205000, type: 'Single Family', beds: 2, baths: 2, sqft: 1362, img: U('1430285561322-7808604715df') }
      ],
      just: [
        { city: 'Katy', price: 415000, type: 'Single Family', beds: 3, baths: 2, sqft: 2218, img: U('1570129477492-45c003edd2be'), tag: 'Just listed' },
        { city: 'Richmond', price: 350000, type: 'Single Family', beds: 4, baths: 2.5, sqft: 2616, img: U('1605276374104-dee2a0ed3cd6'), tag: 'Just listed' },
        { city: 'Houston', price: 1885000, type: 'Single Family', beds: 4, baths: 4.5, sqft: 4743, img: U('1613490493576-7fde63acd811'), tag: 'Just listed' },
        { city: 'Conroe', price: 727000, type: 'Single Family', beds: 5, baths: 5.5, sqft: 4436, img: U('1512917774080-9991f1c4c750'), tag: 'Just listed' },
        { city: 'Richmond', price: 442500, type: 'Single Family', beds: 4, baths: 3, sqft: 2388, img: U('1583608205776-bfd35f0d9f83'), tag: 'Just listed' },
        { city: 'La Porte', price: 749900, type: 'Single Family', beds: 4, baths: 4.5, sqft: 3890, img: U('1602343168117-bb8ffe3e2e9f'), tag: 'Just listed' }
      ],
      open: [
        { city: 'Houston', price: 565000, type: 'Single Family', beds: 4, baths: 2.5, sqft: 2324, img: U('1576941089067-2de3c901e126'), tag: 'Open house' },
        { city: 'Manvel', price: 630000, type: 'Single Family', beds: 4, baths: 3.5, sqft: 3680, img: U('1568605114967-8130f3a36994'), tag: 'Open house' },
        { city: 'Tomball', price: 675000, type: 'Single Family', beds: 3, baths: 3.5, sqft: 2950, img: U('1572120360610-d971b9d7767c'), tag: 'Open house' },
        { city: 'Houston', price: 1195000, type: 'Single Family', beds: 5, baths: 3, sqft: 3511, img: U('1600596542815-ffad4c1539a9'), tag: 'Open house' },
        { city: 'Rosenberg', price: 330000, type: 'Single Family', beds: 3, baths: 2, sqft: 2092, img: U('1592595896551-12b371d546d5'), tag: 'Open house' },
        { city: 'Spring', price: 400000, type: 'Single Family', beds: 3, baths: 2, sqft: 2498, img: U('1564013799919-ab600027ffc6'), tag: 'Open house' }
      ]
    },
    reviews: [
      { name: 'Nicole S.', role: 'Buyer', text: "We've interacted with many realtors over the years. Colby Hebert, however, is top-notch. His level of customer service is incredible. He juggles many clients at the same time, however he makes you feel like you're the only one." },
      { name: 'Mark Sluz', role: '3-time client', text: "We cannot rave about Colby enough! We have used Colby for three real estate transactions and we have never had an experience that was short of exceptional." },
      { name: 'Melanie Bowers', role: 'First-time seller', text: "I had never sold a home before and Colby made the experience seamless and enjoyable. He is knowledgeable in the real estate market and of property values." },
      { name: 'Vanessa D.', role: 'Out-of-town seller', text: "Colby and Kaylon were very kind and extremely professional every step of the way. I was an out-of-town seller during the February 2021 freeze in Houston. They made sure everything was taken care of for me." },
      { name: 'Jeff B.', role: 'Relocated from Tennessee', text: "I think “The Bow Tie Guy” did a great job at finding my family a place to stay. Colby did a fantastic job of listening to our needs and making an urgent push to get us in a home." },
      { name: 'Seth J.', role: 'Client', text: "The speed, the clarity of communication, and the attention to detail far exceeded any expectations I had." },
      { name: 'William', role: 'Out-of-state buyer', text: "Colby was very knowledgeable and helpful. We purchased from out of state and he made everything easy and effortless!" },
      { name: 'Simon C.', role: '4-time client', text: "Fourth time I've used Colby. He stops any hiccups turning into burps before you've even seen them." },
      { name: 'Kim Sudduth', role: 'Seller', text: "Their knowledge of the market helped keep the stress of selling our home to a minimum. They were easy to communicate with." },
      { name: 'Amy Jackson', role: '3-time client', text: "Super knowledgeable, always makes himself available. Each time he is able to help me find exactly what I am looking for." },
      { name: 'Rick A.', role: 'Client', text: "Colby and Kaylon were proactive and responsive, answering my questions and providing guidance from the very beginning." },
      { name: 'Erin A.', role: 'Buyer', text: "The entire process went smoothly, and he went above and beyond to help us find what we were looking for." },
      { name: 'Ricky H.', role: 'Seller', text: "Great experience getting my property sold in a difficult market. Would definitely recommend to friends and family." },
      { name: 'Connor Morgan', role: 'Buyer', text: "Colby went above and beyond for me and my wife. 10/10 would use him again." },
      { name: 'Jacob Ruiz', role: 'Client', text: "Everything and more I can ask for from a realtor." }
    ],
    team: [
      { name: 'Colby Hebert', role: 'Realtor® · “The Bow Tie Guy”', img: 'colby.jpg', cell: '832-260-5118', lic: '683019' },
      { name: 'Kaylon Hebert', role: 'Realtor® · Co-founder', img: 'kaylon.jpg', cell: '832-693-0123', lic: '628691' },
      { name: 'Tinsley Alexander', role: 'Realtor®', img: 'tinsley.jpg', cell: '281-788-9055', lic: '531845' }
    ],
    hoods: [
      { name: 'Cinco Ranch', tag: 'Katy ISD · Master-planned', text: 'Lakes, trails and a beach club, minutes from I-10 and LaCenterra.', img: U('1592595896551-12b371d546d5') },
      { name: 'Cross Creek Ranch', tag: 'Fulshear · Nature trails', text: 'Green space everywhere, resort-style amenities, small-town feel.', img: U('1572120360610-d971b9d7767c') },
      { name: 'Elyson', tag: 'New construction', text: 'Newer homes, community events and a big welcome for young families.', img: U('1605276374104-dee2a0ed3cd6') },
      { name: 'Cane Island', tag: 'Near Old Katy', text: "Modern builds near historic downtown Katy's shops and festivals.", img: U('1583608205776-bfd35f0d9f83') },
      { name: 'Fulshear', tag: 'More space · Acreage', text: 'Room to breathe and bigger lots in a fast-growing town.', img: U('1570129477492-45c003edd2be') },
      { name: 'Old Katy', tag: 'Historic charm', text: 'Walkable streets, local eateries and the heart of Katy events.', img: U('1449844908441-8829872d2607') }
    ],
    areas: ['Katy', 'Fulshear', 'Richmond', 'Rosenberg', 'Cypress', 'Sugar Land', 'Brookshire', 'Houston']
  };

  window.SH_FMT = {
    price: function (n) { return '$' + n.toLocaleString('en-US'); },
    short: function (n) { return n >= 1000000 ? '$' + (n / 1000000).toFixed(n % 1000000 ? 2 : 0).replace(/0$/, '') + 'M' : '$' + Math.round(n / 1000) + 'K'; },
    num: function (n) { return n.toLocaleString('en-US'); }
  };
})();
