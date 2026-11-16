(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var MAX_PAGES = 20, TIMEOUT = 20000;
  var data = null, lastReport = '';

  function decode(s) { var t = document.createElement('textarea'); t.innerHTML = s || ''; return t.value; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) { return decode(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ''); }
  function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
  function progress(p, t) { $('#progress').hidden = false; $('#pbar').style.width = p + '%'; $('#ptext').textContent = t; }

  /* ---------- Fetching (public WordPress REST API, read-only) ---------- */
  function get(url) {
    var ctrl = 'AbortController' in window ? new AbortController() : null, to = setTimeout(function () { if (ctrl) ctrl.abort(); }, TIMEOUT);
    return fetch(url, { signal: ctrl ? ctrl.signal : undefined, credentials: 'omit' }).then(function (r) {
      clearTimeout(to);
      if (!r.ok) { var e = new Error('HTTP ' + r.status); e.status = r.status; throw e; }
      return r.json().then(function (j) { return { json: j, pages: +(r.headers.get('X-WP-TotalPages') || 1), total: +(r.headers.get('X-WP-Total') || 0) }; });
    });
  }
  function make(base, pretty) {
    return function (route, params) {
      var q = Object.keys(params || {}).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
      return pretty ? base + '/wp-json/' + route + (q ? '?' + q : '') : base + '/?rest_route=/' + route + (q ? '&' + q : '');
    };
  }
  function pageAll(api, route, params, label, from, to) {
    var out = [];
    function one(p) {
      var pr = Object.assign({}, params, { per_page: 100, page: p });
      return get(api(route, pr)).then(function (r) {
        out = out.concat(r.json);
        var tot = Math.min(r.pages, MAX_PAGES);
        progress(from + (to - from) * p / Math.max(1, tot), label + ' ' + out.length + (r.total ? ' of ' + r.total : ''));
        return p < tot ? one(p + 1) : { items: out, total: r.total, capped: r.pages > MAX_PAGES };
      });
    }
    return one(1);
  }

  function scan(raw) {
    var host = raw.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
    if (!host) return;
    var base = 'https://' + host;
    $('#fail').hidden = true; $('#report').hidden = true; $('#go').disabled = true;
    progress(4, 'Connecting to ' + host + '…');
    var api = make(base, true), root;
    get(api('', {})).catch(function () { api = make(base, false); return get(api('', {})); })
      .then(function (r) {
        root = r.json || {};
        var ns = root.namespaces || [];
        if (ns.indexOf('wp/v2') === -1) throw new Error('nowp');
        progress(12, 'Reading categories…');
        return pageAll(api, 'wp/v2/product_cat', { _fields: 'id,name,slug,parent,count,link', hide_empty: 'false' }, 'Categories read:', 12, 35)
          .catch(function (e) { e.where = 'cats'; throw e; });
      })
      .then(function (cats) {
        return pageAll(api, 'wp/v2/product', { _fields: 'id,title,product_cat,link', status: 'publish' }, 'Products read:', 35, 95)
          .then(function (prods) { return { cats: cats, prods: prods }; })
          .catch(function () { return { cats: cats, prods: null }; });
      })
      .then(function (res) {
        progress(100, 'Analysing…');
        var ns = root.namespaces || [];
        render({
          site: decode(root.name) || host, host: host,
          cats: res.cats.items.map(function (c) { return { id: c.id, name: decode(c.name), slug: c.slug, parent: c.parent, count: c.count, link: c.link }; }),
          prods: res.prods ? res.prods.items.map(function (p) { return { id: p.id, title: decode(p.title && p.title.rendered), cats: p.product_cat || [], link: p.link }; }) : null,
          capped: res.prods && res.prods.capped,
          elementor: ns.indexOf('elementor/v1') > -1, elementorPro: ns.indexOf('elementor-pro/v1') > -1, woo: ns.some(function (n) { return /^wc\//.test(n); })
        });
      })
      .catch(function (e) {
        $('#progress').hidden = true;
        var msg = e && e.message === 'nowp' ? 'This doesn\'t look like a WordPress site, or its public data is switched off.' :
          e && e.where === 'cats' ? 'The site is WordPress, but its product categories aren\'t shared publicly (common with security plugins).' :
          'The site blocked the check from outside (a security plugin or firewall) or didn\'t answer in time.';
        $('#failText').textContent = msg; $('#fail').hidden = false;
      })
      .then(function () { $('#go').disabled = false; setTimeout(function () { $('#progress').hidden = true; }, 600); });
  }

  /* ---------- Analysis ---------- */
  function analyse(d) {
    var byId = {}; d.cats.forEach(function (c) { byId[c.id] = c; c.kids = []; c.found = 0; c.flags = []; });
    d.cats.forEach(function (c) { if (c.parent && byId[c.parent]) byId[c.parent].kids.push(c); });
    function depth(c) { var n = 0, p = c; while (p && p.parent && byId[p.parent] && n < 20) { p = byId[p.parent]; n++; } return n; }
    var I = [];

    // duplicates
    var groups = {}; d.cats.forEach(function (c) { (groups[norm(c.name)] = groups[norm(c.name)] || []).push(c); });
    var dupGroups = Object.keys(groups).map(function (k) { return groups[k]; }).filter(function (g) { return g.length > 1; });
    var slugDup = d.cats.filter(function (c) { var m = c.slug.match(/^(.*)-(\d+)$/); return m && d.cats.some(function (o) { return o.slug === m[1]; }) && !dupGroups.some(function (g) { return g.indexOf(c) > -1; }); });
    dupGroups.forEach(function (g) { g.forEach(function (c) { c.flags.push('bad'); }); }); slugDup.forEach(function (c) { c.flags.push('bad'); });
    if (dupGroups.length || slugDup.length) I.push({ sev: 'bad', key: 'dup', n: dupGroups.length + slugDup.length, title: 'Duplicate categories', why: 'The same category exists more than once, so products are split between the copies and pages look half-empty or mixed.', items: dupGroups.map(function (g) { return g.map(function (c) { return c.name + ' (' + c.slug + ', ' + c.count + ')'; }).join('  ⇄  '); }).concat(slugDup.map(function (c) { return c.name + ' (' + c.slug + ')'; })), min: 12 * (dupGroups.length + slugDup.length) });

    // orphans + depth
    var orphans = d.cats.filter(function (c) { return c.parent && !byId[c.parent]; });
    orphans.forEach(function (c) { c.flags.push('bad'); });
    if (orphans.length) I.push({ sev: 'bad', key: 'orphan', n: orphans.length, title: 'Categories pointing to a missing parent', why: 'Their parent was deleted or is hidden, so they float in the wrong place in menus and filters.', items: orphans.map(function (c) { return c.name; }), min: 5 * orphans.length });
    var deep = d.cats.filter(function (c) { return depth(c) >= 3; });
    if (deep.length) I.push({ sev: 'warn', key: 'deep', n: deep.length, title: 'Categories nested 4+ levels deep', why: 'Very deep trees confuse shoppers and many Elementor widgets only show 1–2 levels.', items: deep.map(function (c) { return c.name; }), min: 5 * deep.length });

    var unc = d.cats.filter(function (c) { return c.slug === 'uncategorized' || /^uncategori[sz]ed$/i.test(c.name); })[0];

    if (d.prods) {
      d.prods.forEach(function (p) { p.cats.forEach(function (id) { if (byId[id]) byId[id].found++; }); });
      var none = d.prods.filter(function (p) { return !p.cats.length || (unc && p.cats.length === 1 && p.cats[0] === unc.id); });
      if (unc) unc.flags.push(none.length ? 'bad' : 'ok');
      if (none.length) I.push({ sev: 'bad', key: 'unc', n: none.length, title: 'Products with no real category ("Uncategorized")', why: 'They show up in "All products" and search, but in none of the category pages, so the shop looks incomplete.', items: none.map(function (p) { return p.title; }), min: Math.max(10, 2 * none.length) });

      var many = d.prods.filter(function (p) { return p.cats.length >= 5; });
      if (many.length) I.push({ sev: 'warn', key: 'many', n: many.length, title: 'Products filed in 5+ categories', why: 'They appear in pages where they don\'t belong, which is often what makes categories look "mixed".', items: many.map(function (p) { return p.title + ' (' + p.cats.length + ')'; }), min: 3 * many.length });

      var parentOnly = d.prods.filter(function (p) { return p.cats.some(function (id) { var c = byId[id]; return c && c.kids.length && !p.cats.some(function (k) { return byId[k] && byId[k].parent === id; }); }); });
      if (parentOnly.length) I.push({ sev: 'warn', key: 'parent', n: parentOnly.length, title: 'Products sitting in a parent but in none of its subcategories', why: 'They show on the main category page but disappear when shoppers click a subcategory.', items: parentOnly.map(function (p) { return p.title; }), min: 2 * parentOnly.length });

      var mixed = d.prods.filter(function (p) { var tops = {}; p.cats.forEach(function (id) { var c = byId[id], n = 0; while (c && c.parent && byId[c.parent] && n++ < 20) c = byId[c.parent]; if (c) tops[c.id] = 1; }); return Object.keys(tops).length >= 3; });
      if (mixed.length) I.push({ sev: 'warn', key: 'mixed', n: mixed.length, title: 'Products spread across 3+ unrelated sections', why: 'For example a sofa also filed under Lighting and Sale. This is the classic "products and categories mixed" look.', items: mixed.map(function (p) { return p.title; }), min: 3 * mixed.length });

      var titles = {}; d.prods.forEach(function (p) { var k = norm(p.title); (titles[k] = titles[k] || []).push(p); });
      var dupP = Object.keys(titles).map(function (k) { return titles[k]; }).filter(function (g) { return g.length > 1; });
      if (dupP.length) I.push({ sev: 'warn', key: 'dupp', n: dupP.length, title: 'Products listed twice', why: 'Two products with the same name show side by side in category pages.', items: dupP.map(function (g) { return g[0].title + ' ×' + g.length; }), min: 4 * dupP.length });

      if (!d.capped) {
        var off = d.cats.filter(function (c) { return Math.abs(c.count - c.found) > 0; });
        off.forEach(function (c) { c.flags.push('warn'); });
        if (off.length) I.push({ sev: 'warn', key: 'count', n: off.length, title: 'Category counts don\'t match the real products', why: 'Counts shown to shoppers are out of date or include hidden products, so pages promise items that aren\'t there.', items: off.map(function (c) { return c.name + ': shows ' + c.count + ', has ' + c.found; }), min: 15 });
      }
    } else {
      I.push({ sev: 'info', key: 'noprod', n: '–', title: 'Product list isn\'t public', why: 'Categories were scanned; product assignments are checked once logged in.', items: [], min: 45 });
    }
    var empty = d.cats.filter(function (c) { return c.count === 0 && !c.kids.some(function (k) { return k.count > 0; }) && c !== unc; });
    empty.forEach(function (c) { c.flags.push('warn'); });
    if (empty.length) I.push({ sev: 'warn', key: 'empty', n: empty.length, title: 'Empty categories', why: 'They still appear in menus, filters and Elementor category grids, leading shoppers to empty pages.', items: empty.map(function (c) { return c.name; }), min: 2 * empty.length });

    I.push({ sev: 'info', key: 'el', n: d.elementorPro ? 'Pro' : d.elementor ? 'Free' : '–', title: d.elementor ? 'Elementor' + (d.elementorPro ? ' Pro' : '') + ' detected: archive templates to check' : 'No Elementor detected publicly', why: d.elementor ? 'Category pages built with Elementor can use the wrong template or a fixed product query. We check display conditions and loop queries once logged in.' : 'We\'ll still check the theme\'s category templates once logged in.', items: [], min: d.elementor ? 40 : 15 });

    var order = { bad: 0, warn: 1, info: 2, ok: 3 };
    I.sort(function (a, b) { return order[a.sev] - order[b.sev]; });
    var problems = I.filter(function (i) { return i.sev === 'bad' || i.sev === 'warn'; });
    var minutes = 45 + I.reduce(function (s, i) { return s + i.min; }, 0) + 30 + 15;
    var lo = Math.max(2, Math.ceil(minutes / 30) / 2), hi = Math.ceil(lo * 1.25 * 2) / 2;
    return { I: I, problems: problems, lo: lo, hi: hi, byId: byId };
  }

  /* ---------- Render ---------- */
  function render(d) {
    data = d; var A = analyse(d); data.A = A;
    $('#siteName').textContent = d.site + ' · ' + d.host;
    var bad = A.problems.filter(function (i) { return i.sev === 'bad'; }).length;
    $('#verdict').textContent = !A.problems.length ? 'The category data looks clean' : bad ? A.problems.length + ' problems found, ' + bad + ' of them causing the mess' : A.problems.length + ' smaller problems found';
    $('#verdictSub').textContent = !A.problems.length ? 'The mess is most likely in the Elementor templates or query settings, not the data itself.' : 'Each one is listed below with the exact categories and products affected.';
    $('#hours').textContent = A.lo === A.hi ? A.lo + ' h' : A.lo + '–' + A.hi + ' h';
    var days = Math.max(1, Math.ceil(A.hi / 6));
    $('#days').textContent = 'Done within ' + days + ' working day' + (days > 1 ? 's' : '') + ' of access';
    $('#k-cats').textContent = d.cats.length;
    $('#k-prods').textContent = d.prods ? d.prods.length + (d.capped ? '+' : '') : 'Not public';
    $('#k-issues').textContent = A.problems.length;
    $('#k-builder').textContent = d.elementorPro ? 'Elementor Pro' : d.elementor ? 'Elementor' : 'Not detected';

    $('#issues').innerHTML = A.I.map(function (i) {
      var ic = { bad: '!', warn: '!', info: 'i', ok: '✓' }[i.sev];
      return '<details class="issue ' + i.sev + '"' + (i.sev === 'bad' ? ' open' : '') + '><summary><span class="ic">' + ic + '</span><span><b>' + esc(i.title) + '</b><span class="why">' + esc(i.why) + '</span></span><span class="n">' + i.n + '</span></summary>' +
        (i.items.length ? '<div class="list">' + i.items.slice(0, 120).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + (i.items.length > 120 ? '<span class="chip">+' + (i.items.length - 120) + ' more</span>' : '') + '</div>' : '') + '</details>';
    }).join('');

    var roots = d.cats.filter(function (c) { return !c.parent || !A.byId[c.parent]; });
    function node(c) {
      var f = c.flags.indexOf('bad') > -1 ? 'bad' : c.flags.indexOf('warn') > -1 ? 'warn' : 'ok';
      return '<li><div class="node"><span class="dot ' + f + '"></span>' + esc(c.name) + ' <span class="slug">/' + esc(c.slug) + '</span><span class="c">' + c.count + (d.prods && !d.capped && c.found !== c.count ? ' → ' + c.found : '') + '</span></div>' + (c.kids.length ? '<ul>' + c.kids.map(node).join('') + '</ul>' : '') + '</li>';
    }
    $('#tree').innerHTML = roots.map(node).join('');

    $('#search').disabled = !d.prods; $('#search').placeholder = d.prods ? 'Type a product name…' : 'Product list isn\'t public on this site';
    $('#search').value = ''; searchRender('');

    var steps = [['Backup and investigation', 'Full backup, then trace how category pages get their products.', 45]];
    A.I.forEach(function (i) {
      var map = { dup: 'Merge duplicate categories and move their products', orphan: 'Re-attach orphaned categories', deep: 'Flatten very deep category levels', unc: 'File uncategorised products correctly', many: 'Trim products filed in too many categories', parent: 'Assign products to the right subcategories', mixed: 'Remove products from unrelated sections', dupp: 'Merge or remove duplicate products', count: 'Recount categories and clear caches', empty: 'Hide or remove empty categories', noprod: 'Audit product assignments (logged in)', el: 'Fix Elementor archive templates and loop queries' };
      if (map[i.key]) steps.push([map[i.key], i.sev === 'info' ? '' : i.n + ' affected', i.min]);
    });
    steps.push(['Test on desktop, tablet and mobile', 'Every category page and filter.', 30], ['Summary for your client', 'What was wrong, what changed, and how to keep it tidy.', 15]);
    $('#steps').innerHTML = steps.map(function (s) { return '<li><span><b>' + esc(s[0]) + '</b>' + (s[1] ? '<small>' + esc(s[1]) + '</small>' : '') + '</span><span class="t">' + (s[2] >= 60 ? (s[2] / 60).toFixed(1).replace('.0', '') + ' h' : s[2] + ' min') + '</span></li>'; }).join('') +
      '<li class="total"><span><b>Total</b><small>Done within ' + days + ' working day' + (days > 1 ? 's' : '') + ' of getting access</small></span><span class="t">' + $('#hours').textContent + '</span></li>';

    lastReport = buildReport(d, A, days);
    $('#report').hidden = false;
    $('#report').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function searchRender(q) {
    var out = $('#results');
    if (!data || !data.prods) { out.innerHTML = ''; return; }
    q = norm(q);
    var hits = data.prods.filter(function (p) { return !q || norm(p.title).indexOf(q) > -1; }).slice(0, 30);
    out.innerHTML = hits.map(function (p) {
      return '<li><b>' + esc(p.title) + '</b><div class="cats">' + (p.cats.length ? p.cats.map(function (id) { var c = data.A.byId[id]; return '<span class="chip">' + esc(c ? c.name : '#' + id) + '</span>'; }).join('') : '<span class="chip">No category</span>') + '</div></li>';
    }).join('') || '<li>No products match.</li>';
  }
  $('#search').addEventListener('input', function () { searchRender(this.value); });

  function buildReport(d, A, days) {
    var L = ['CATEGORY REPORT: ' + d.site + ' (' + d.host + ')', 'Scanned ' + new Date().toLocaleDateString(), '', d.cats.length + ' categories, ' + (d.prods ? d.prods.length + ' products' : 'products not public') + ', page builder: ' + (d.elementorPro ? 'Elementor Pro' : d.elementor ? 'Elementor' : 'not detected'), '', 'PROBLEMS FOUND (' + A.problems.length + ')'];
    A.I.forEach(function (i) { L.push('- ' + i.title + (i.n !== '–' ? ' [' + i.n + ']' : '') + ': ' + i.why); i.items.slice(0, 8).forEach(function (t) { L.push('    · ' + t); }); if (i.items.length > 8) L.push('    · +' + (i.items.length - 8) + ' more'); });
    L.push('', 'ESTIMATED FIX TIME: ' + $('#hours').textContent + ', done within ' + days + ' working day' + (days > 1 ? 's' : '') + ' of access.');
    return L.join('\n');
  }
  $('#copy').addEventListener('click', function () {
    var done = function () { toast('Report copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lastReport).then(done, function () { prompt('Copy the report:', lastReport); }); else prompt('Copy the report:', lastReport);
  });
  $('#dl').addEventListener('click', function () {
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([lastReport], { type: 'text/plain' })); a.download = 'category-report-' + (data ? data.host : 'shop') + '.txt'; document.body.appendChild(a); a.click(); a.remove();
  });

  /* ---------- Demo data (a deliberately messy example shop) ---------- */
  function demo() {
    var C = [[10, 'Furniture', 'furniture', 0], [11, 'Sofas', 'sofas', 10], [12, 'Tables', 'tables', 10], [13, 'Chairs', 'chairs', 10], [14, 'Dining Chairs', 'dining-chairs', 13], [15, 'Office Chairs', 'office-chairs', 13], [16, 'Kids Chairs', 'kids-chairs', 15], [20, 'Lighting', 'lighting', 0], [21, 'Lamps', 'lamps', 20], [22, 'lamps', 'lamps-2', 0], [23, 'Pendants', 'pendants', 20], [30, 'Decor', 'decor', 0], [31, 'Cushions', 'cushions', 30], [32, 'Vases', 'vases', 30], [33, 'Rugs & Mats', 'rugs-mats', 30], [34, 'Rugs and Mats', 'rugs-and-mats', 0], [40, 'Sale', 'sale', 0], [41, 'Christmas 2023', 'christmas-2023', 0], [42, 'Outdoor', 'outdoor', 0], [43, 'Garden Benches', 'garden-benches', 99], [15 + 100, 'Uncategorized', 'uncategorized', 0]];
    var names = ['Oslo 3-Seat Sofa', 'Bergen Corner Sofa', 'Fjord Loveseat', 'Oak Dining Table', 'Round Café Table', 'Nest Side Table', 'Ash Dining Chair', 'Wishbone Chair', 'Ergo Office Chair', 'Mini Kids Chair', 'Arc Floor Lamp', 'Dome Table Lamp', 'Glow Pendant', 'Linen Pendant', 'Wool Cushion', 'Velvet Cushion', 'Stoneware Vase', 'Glass Vase', 'Jute Rug', 'Wool Runner', 'Teak Bench', 'Rattan Lounge Chair', 'Ceramic Lamp', 'Oak Dining Table', 'Bouclé Armchair', 'Pine Bookshelf', 'Brass Candle Holder', 'Linen Throw'];
    var A2 = [[11, 40], [11], [11, 40], [12, 14], [12], [12, 31, 21, 40, 33, 42], [14], [13], [15], [16], [21], [22], [23], [23, 22], [31], [31, 40, 41], [32], [32], [33], [34], [43, 42], [42, 11, 20], [22], [12], [115], [], [115], [10]];
    return { site: 'Nordic Living (example)', host: 'example-shop.com', elementor: true, elementorPro: true, woo: true, capped: false,
      cats: C.map(function (c) { return { id: c[0], name: c[1], slug: c[2], parent: c[3], count: 0, link: '#' }; }),
      prods: names.map(function (n, i) { return { id: 500 + i, title: n, cats: A2[i] || [], link: '#' }; }) };
  }
  function runDemo() {
    var d = demo(); var counts = {};
    d.prods.forEach(function (p) { p.cats.forEach(function (id) { counts[id] = (counts[id] || 0) + 1; }); });
    d.cats.forEach(function (c) { c.count = (counts[c.id] || 0) + (c.slug === 'sale' ? 3 : 0); });
    $('#fail').hidden = true; render(d); toast('Example scan of a messy demo shop');
  }
  $('#demo').addEventListener('click', runDemo); $('#demo2').addEventListener('click', runDemo);
  $('#scanForm').addEventListener('submit', function (e) { e.preventDefault(); scan($('#url').value); });
  var qp = new URLSearchParams(location.search).get('site'); if (qp) { $('#url').value = qp; scan(qp); }
})();
