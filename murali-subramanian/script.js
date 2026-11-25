(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var title = function (s) { return s.replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* Wildlife classes the demo model knows, grouped */
  var GROUPS = {
    'Big Cats': ['tiger', 'leopard', 'snow leopard', 'jaguar', 'lion', 'cheetah', 'cougar'],
    'Wild Cats': ['lynx'],
    'Birds': ['hornbill', 'toucan', 'bee eater', 'jacamar', 'hummingbird', 'peacock', 'flamingo', 'crane', 'spoonbill', 'pelican', 'bald eagle', 'kite', 'vulture', 'great grey owl', 'ostrich', 'goldfinch', 'house finch', 'indigo bunting', 'robin', 'bulbul', 'jay', 'magpie', 'chickadee', 'water ouzel', 'black grouse', 'ptarmigan', 'ruffed grouse', 'prairie chicken', 'quail', 'partridge', 'african grey', 'macaw', 'sulphur-crested cockatoo', 'lorikeet', 'coucal', 'drake', 'red-breasted merganser', 'goose', 'black swan', 'white stork', 'black stork', 'little blue heron', 'american egret', 'bittern', 'limpkin', 'bustard', 'ruddy turnstone', 'red-backed sandpiper', 'redshank', 'dowitcher', 'oystercatcher', 'albatross', 'king penguin', 'brambling', 'junco'],
    'Mammals': ['african elephant', 'indian elephant', 'tusker', 'zebra', 'hippopotamus', 'gazelle', 'impala', 'hartebeest', 'ibex', 'bighorn', 'water buffalo', 'bison', 'warthog', 'wild boar', 'brown bear', 'american black bear', 'ice bear', 'sloth bear', 'giant panda', 'lesser panda', 'red fox', 'grey fox', 'arctic fox', 'kit fox', 'timber wolf', 'white wolf', 'red wolf', 'coyote', 'dhole', 'african hunting dog', 'hyena', 'meerkat', 'mongoose', 'otter', 'badger', 'porcupine', 'hare', 'wood rabbit', 'langur', 'macaque', 'baboon', 'chimpanzee', 'gorilla', 'orangutan', 'gibbon', 'three-toed sloth', 'koala', 'wallaby', 'beaver', 'marmot', 'fox squirrel', 'armadillo', 'arabian camel'],
    'Reptiles': ['african crocodile', 'american alligator', 'komodo dragon', 'king cobra', 'indian cobra', 'green mamba', 'rock python', 'loggerhead', 'leatherback turtle', 'mud turtle', 'terrapin', 'box turtle', 'common iguana', 'green lizard', 'african chameleon', 'frilled lizard'],
    'Insects': ['monarch', 'admiral', 'ringlet', 'cabbage butterfly', 'sulphur butterfly', 'lycaenid', 'dragonfly', 'damselfly', 'mantis', 'ladybug']
  };
  var RENAME = { 'tusker': 'Elephant', 'indian elephant': 'Asian Elephant', 'ice bear': 'Polar Bear', 'tiger': 'Tiger', 'great grey owl': 'Great Grey Owl', 'monarch': 'Monarch Butterfly', 'drake': 'Duck' };
  function lookup(className) {
    var key = className.split(',')[0].trim().toLowerCase();
    for (var g in GROUPS) if (GROUPS[g].indexOf(key) > -1) return { name: RENAME[key] || title(key), group: g };
    return { name: title(key), group: null };
  }

  /* Sample photos (public domain) with their approved tags */
  var ALBUMS = ['Big Cats', 'Birds', 'Mammals', 'Bardiya National Park', 'Uncategorised'];
  var SAMPLES = [
    { id: 'tiger-walk', label: 'Tiger', species: 'Tiger', group: 'Big Cats', album: 'Big Cats', extra: ['Grassland'] },
    { id: 'tiger-water', label: 'Tiger in water', species: 'Tiger', group: 'Big Cats', album: 'Big Cats', extra: ['Water'] },
    { id: 'kingfisher-post', label: 'Kingfisher', species: 'Sacred Kingfisher', group: 'Birds', album: 'Birds', extra: ['Perched'] },
    { id: 'kingfisher-reeds', label: 'Kingfisher', species: 'Common Kingfisher', group: 'Birds', album: 'Birds', extra: ['Wetland'] },
    { id: 'hornbill', label: 'Hornbill', species: 'Great Hornbill', group: 'Birds', album: 'Bardiya National Park', extra: ['Nepal', 'Forest'] }
  ];

  function buildTags(o) {
    var t = [o.species, o.group || 'Wildlife', o.album].concat(o.extra || []);
    if (o.exif && o.exif.year) t.push(String(o.exif.year), MONTHS[o.exif.month]);
    t.push('Wildlife Photography');
    var seen = {}; return t.filter(function (x) { if (!x || x === 'Uncategorised') return false; var k = x.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; });
  }
  function hashtag(s) { return '#' + s.replace(/[^A-Za-z0-9 ]/g, '').replace(/(^| )(\w)/g, function (m, a, b) { return b.toUpperCase(); }).replace(/ /g, ''); }
  function hashtags(o, tags) {
    var h = tags.filter(function (x) { return !/^\d{4}$/.test(x) && MONTHS.indexOf(x) < 0; }).map(hashtag);
    if (o.group === 'Birds') h.push('#BirdPhotography', '#BirdsOfInstagram');
    if (o.group === 'Big Cats' || o.group === 'Wild Cats') h.push('#BigCatsOfInstagram');
    h.push('#NatureLovers', '#WildlifeLovers');
    if (o.exif && o.exif.year) h.push('#Wildlife' + o.exif.year);
    return h.filter(function (x, i) { return h.indexOf(x) === i; }).slice(0, 15);
  }
  function altText(o) {
    var a = 'Wildlife photograph of a ' + o.species.toLowerCase();
    if (o.album && !/^(Big Cats|Birds|Mammals|Uncategorised)$/.test(o.album)) a += ' in ' + o.album;
    if (o.exif && o.exif.year) a += ', ' + MONTHS[o.exif.month] + ' ' + o.exif.year;
    return a + '.';
  }

  /* Gallery */
  var gallery = SAMPLES.map(function (s) { var o = Object.assign({ src: 'assets/' + s.id + '.jpg' }, s); o.tags = buildTags(o); return o; });
  var filt = { q: '', album: 'All', tag: '' };
  function drawGallery() {
    $('#albums').innerHTML = ['All'].concat(ALBUMS.filter(function (a) { return gallery.some(function (g) { return g.album === a; }); })).map(function (a) { return '<button type="button" data-a="' + esc(a) + '" aria-pressed="' + (filt.album === a) + '">' + esc(a) + '</button>'; }).join('');
    var counts = {}; gallery.forEach(function (g) { g.tags.forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
    $('#cloud').innerHTML = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); }).slice(0, 24).map(function (t) { return '<button type="button" data-t="' + esc(t) + '" aria-pressed="' + (filt.tag === t) + '">#' + esc(t.replace(/ /g, '')) + '<b>' + counts[t] + '</b></button>'; }).join('');
    var q = filt.q.toLowerCase();
    var list = gallery.filter(function (g) {
      if (filt.album !== 'All' && g.album !== filt.album) return false;
      if (filt.tag && g.tags.indexOf(filt.tag) < 0) return false;
      if (q && (g.species + ' ' + g.album + ' ' + g.tags.join(' ')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    $('#grid').innerHTML = list.map(function (g) { return '<article class="ph"><img src="' + g.src + '" alt="' + esc(altText(g)) + '" loading="lazy"><div><b>' + esc(g.species) + '</b><small>' + esc(g.album) + '</small><p class="t">' + g.tags.map(function (t) { return '<span>#' + esc(t.replace(/ /g, '')) + '</span>'; }).join('') + '</p></div></article>'; }).join('');
    $('#empty').hidden = list.length > 0;
  }
  $('#albums').addEventListener('click', function (e) { var b = e.target.closest('[data-a]'); if (b) { filt.album = b.dataset.a; drawGallery(); } });
  $('#cloud').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { filt.tag = filt.tag === b.dataset.t ? '' : b.dataset.t; drawGallery(); } });
  $('#q').addEventListener('input', function () { filt.q = this.value.trim(); drawGallery(); });
  drawGallery();

  /* Try it */
  $('#pick').innerHTML = SAMPLES.map(function (s, i) { return '<button type="button" data-i="' + i + '" aria-pressed="false"><img src="assets/' + s.id + '.jpg" alt="' + esc(s.label) + ' sample"><span>' + esc(s.label) + '</span></button>'; }).join('');
  $('#album').innerHTML = ALBUMS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('');

  var modelP = null, cur = null, objURL = '';
  function model() { if (!modelP) modelP = mobilenet.load({ version: 2, alpha: 1.0, modelUrl: 'model/model.json' }); return modelP; }
  function step(name, state) { var li = $('#steps [data-s="' + name + '"]'); li.classList.remove('on', 'done'); if (state) li.classList.add(state); }

  async function run(src, file, sample) {
    $('#run').hidden = false; $('#result').hidden = true;
    ['exif', 'ai', 'tags'].forEach(function (s) { step(s, ''); });
    var img = $('#runImg'); img.src = src; img.alt = 'Photo being tagged';
    $('#run').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    await img.decode().catch(function () {});

    step('exif', 'on');
    var exif = null;
    try {
      var blob = file || await (await fetch(src)).blob();
      var d = await exifr.parse(blob, { gps: true });
      if (d) {
        var dt = d.DateTimeOriginal || d.CreateDate;
        exif = { camera: [d.Make, d.Model].filter(Boolean).join(' '), lens: d.LensModel || '', lat: d.latitude, lon: d.longitude };
        if (dt instanceof Date) { exif.year = dt.getFullYear(); exif.month = dt.getMonth(); }
      }
    } catch (e) { exif = null; }
    step('exif', 'done');

    step('ai', 'on');
    var preds = [];
    try { preds = await (await model()).classify(img, 3); } catch (e) { preds = []; }
    step('ai', 'done');

    step('tags', 'on');
    var top = preds[0], hit = top ? lookup(top.className) : { name: '', group: null };
    var p = top ? top.probability : 0, sure = !!hit.group && p >= 0.5;
    cur = { species: hit.name || 'Unknown', group: hit.group || (sample ? sample.group : null), album: hit.group === 'Big Cats' ? 'Big Cats' : hit.group === 'Birds' ? 'Birds' : hit.group === 'Mammals' ? 'Mammals' : 'Uncategorised', extra: [], exif: exif, src: src, removed: {} };
    $('#species').value = cur.species;
    $('#conf').textContent = top ? 'AI confidence: ' + Math.round(p * 100) + '%' + (preds[1] ? ' · next guess: ' + lookup(preds[1].className).name : '') : 'The AI could not read this photo.';
    $('#flag').hidden = sure;
    $('#why').textContent = sure
      ? 'Confident match. You would just approve it.'
      : 'The AI isn\'t sure here, so this photo waits for you. Type the correct species above and every tag updates. (This is exactly where the stronger AI in the full version makes a big difference.)';
    $('#album').value = cur.album;
    var ex = 'No camera details found.';
    if (exif && (exif.camera || exif.year)) {
      ex = [exif.year != null ? MONTHS[exif.month] + ' ' + exif.year : '', exif.camera, exif.lens].filter(Boolean).join(' · ');
      if (exif.lat != null) ex += ' · Location: about ' + Math.abs(exif.lat).toFixed(1) + '°' + (exif.lat >= 0 ? 'N' : 'S') + ', ' + Math.abs(exif.lon).toFixed(1) + '°' + (exif.lon >= 0 ? 'E' : 'W') + ' (exact spot hidden)';
    } else if (!file) ex += ' Web copies like this sample usually have them removed; your original camera files include the date, camera and lens.';
    $('#exif').textContent = ex;
    refresh();
    step('tags', 'done');
    $('#result').hidden = false;
  }
  function refresh() {
    if (!cur) return;
    cur.species = $('#species').value.trim() || 'Unknown';
    cur.album = $('#album').value;
    var typed = lookup(cur.species); if (typed.group) cur.group = typed.group;
    var tags = buildTags(cur).filter(function (t) { return !cur.removed[t]; });
    cur.tags = tags;
    $('#tags').innerHTML = tags.map(function (t) { return '<button type="button" data-t="' + esc(t) + '" title="Remove tag">' + esc(t) + ' ×</button>'; }).join('');
    $('#alt').textContent = altText(cur);
    $('#hash').textContent = hashtags(cur, tags).join(' ');
  }
  $('#species').addEventListener('input', function () { $('#flag').hidden = true; refresh(); });
  $('#album').addEventListener('change', refresh);
  $('#tags').addEventListener('click', function (e) { var b = e.target.closest('[data-t]'); if (b) { cur.removed[b.dataset.t] = 1; refresh(); } });

  var tt;
  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('on'); }, 2200); }
  $('#copy').addEventListener('click', function () {
    var txt = $('#hash').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('Hashtags copied'); }, function () { toast('Select and copy the hashtags'); });
    else toast('Select and copy the hashtags');
  });
  $('#approve').addEventListener('click', function () {
    if (!cur) return;
    gallery.unshift({ src: cur.src, species: cur.species, group: cur.group, album: cur.album, tags: cur.tags.slice(), exif: cur.exif });
    filt = { q: '', album: 'All', tag: '' }; $('#q').value = '';
    drawGallery(); toast('Added to the gallery');
    $('#gallery').scrollIntoView({ behavior: 'smooth' });
  });

  $('#pick').addEventListener('click', function (e) {
    var b = e.target.closest('[data-i]'); if (!b) return;
    document.querySelectorAll('#pick button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    var s = SAMPLES[+b.dataset.i]; run('assets/' + s.id + '.jpg', null, s);
  });
  $('#file').addEventListener('change', function () {
    var f = this.files && this.files[0]; if (!f) return;
    document.querySelectorAll('#pick button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
    objURL = URL.createObjectURL(f); run(objURL, f, null);
  });

  /* Warm up the model in the background once the page is idle */
  (window.requestIdleCallback || function (f) { setTimeout(f, 1500); })(function () { model().catch(function () {}); });
})();
