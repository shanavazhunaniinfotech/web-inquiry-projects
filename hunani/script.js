(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  /* ---------- Nav shadow + sticky mobile buy bar ---------- */
  var nav = $('.nav');
  var sticky = $('#stickyBuy');
  var shop = $('#shop');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    var r = shop.getBoundingClientRect();
    var inShop = r.top < window.innerHeight && r.bottom > 0;
    sticky.classList.toggle('is-visible', y > 600 && !inShop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Toast ---------- */
  var toast = $('#toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 2800);
  }

  /* ---------- Product configurator ---------- */
  var state = { color: '#0f4c81', colorName: 'Ocean', size: '750 ml', price: 39, was: 49, scale: 1, qty: 2 };
  var discounts = { 1: 0, 2: 0.15, 4: 0.25 };
  var shopBottle = $('#shopBottle');
  var glow = $('#shopGlow');
  var money = function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, ''); };

  function render() {
    var d = discounts[state.qty] || 0;
    var unit = state.price * (1 - d);
    $('#priceNow').textContent = money(unit);
    $('#priceWas').textContent = money(state.was);
    $('#priceSave').textContent = 'Save ' + Math.round((1 - unit / state.was) * 100) + '%';
    $('#ctaTotal').textContent = '$' + (state.price * state.qty * (1 - d)).toFixed(2);
    $('#colorName').textContent = state.colorName;
    $('#sizeName').textContent = state.size;
  }

  function setBottleColor(c) {
    shopBottle.style.setProperty('--c', c);
    $('#stickyThumb').style.setProperty('--c', c);
    glow.style.background = c;
  }

  $$('.swatch').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.swatch').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      state.color = btn.dataset.color;
      state.colorName = btn.dataset.name;
      render();
      if (hasGsap && !reduce) {
        gsap.timeline()
          .to(shopBottle, { scaleX: 0, duration: 0.18, ease: 'power2.in', onComplete: function () { setBottleColor(state.color); } })
          .to(shopBottle, { scaleX: 1, duration: 0.45, ease: 'back.out(2)' });
      } else {
        setBottleColor(state.color);
      }
    });
  });

  $$('.size').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.size').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-checked', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-checked', 'true');
      state.size = btn.dataset.size;
      state.price = +btn.dataset.price;
      state.was = +btn.dataset.was;
      state.scale = +btn.dataset.scale;
      render();
      if (hasGsap && !reduce) {
        gsap.to(shopBottle, { scale: state.scale, duration: 0.6, ease: 'elastic.out(1, .6)' });
      } else {
        shopBottle.style.transform = 'scale(' + state.scale + ')';
      }
    });
  });

  $$('input[name="qty"]').forEach(function (inp) {
    inp.addEventListener('change', function () { state.qty = +inp.value; render(); });
  });

  var cartCount = 0;
  $('#addToCart').addEventListener('click', function () {
    cartCount += state.qty;
    var badge = $('#cartCount');
    badge.textContent = cartCount;
    $('#cartBtn').setAttribute('aria-label', 'Cart, ' + cartCount + ' items');
    showToast('✓ Added ' + state.qty + ' × ' + state.size + ' ' + state.colorName + ' to your cart');
    if (hasGsap && !reduce) {
      gsap.fromTo(badge, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, .4)' });
      gsap.fromTo(shopBottle, { y: 0 }, { y: -24, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' });
    }
  });
  render();

  /* ---------- Dispatch countdown (to 3pm local) ---------- */
  var cd = $('#countdown');
  function tick() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(15, 0, 0, 0);
    if (now >= end) end.setDate(end.getDate() + 1);
    var s = Math.floor((end - now) / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    cd.textContent = [h, m, sec].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Newsletter ---------- */
  $('#signup').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#email');
    var msg = $('#signupMsg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      msg.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }
    msg.textContent = '🎉 You\'re in! Use code HELLO10 at checkout.';
    email.value = '';
  });

  /* ---------- Counters (fallback without GSAP) ---------- */
  function setFinalCounts() {
    $$('.count').forEach(function (el) { el.textContent = (+el.dataset.to).toLocaleString(); });
    $$('.chart__fill').forEach(function (el) { el.style.width = el.dataset.w + '%'; });
  }

  if (!hasGsap || reduce) { setFinalCounts(); return; }

  /* =====================================================
     GSAP animations
     ===================================================== */
  gsap.registerPlugin(ScrollTrigger);

  // Bubbles in hero
  var bubbleWrap = $('#bubbles');
  for (var i = 0; i < 14; i++) {
    var b = document.createElement('span');
    var size = gsap.utils.random(8, 34);
    b.style.width = b.style.height = size + 'px';
    b.style.left = gsap.utils.random(0, 100) + '%';
    bubbleWrap.appendChild(b);
    gsap.to(b, {
      y: function () { return -(window.innerHeight + 200); },
      x: 'random(-40, 40)',
      duration: gsap.utils.random(9, 18),
      delay: gsap.utils.random(0, 10),
      repeat: -1,
      ease: 'none'
    });
  }

  // Hero intro
  var bottle = $('.hero__bottle');
  var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.from('.hero__title .word', { yPercent: 120, rotate: 4, duration: 1.1, stagger: 0.07 })
    .from('.hero-reveal', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 }, '-=0.8')
    .from('.hero__ring', { scale: 0.6, opacity: 0, duration: 1.2 }, 0.1)
    .from(bottle, { y: 140, rotate: -14, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.2)
    .from('.float-badge', { scale: 0.4, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(2.2)' }, 0.9)
    .from('.nav', { y: -30, opacity: 0, duration: 0.8 }, 0);

  // Idle float
  gsap.to(bottle, { y: -18, rotate: 2, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
  $$('.float-badge').forEach(function (el, idx) {
    gsap.to(el, { y: idx % 2 ? 12 : -12, duration: 2.6 + idx * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 });
  });

  // Mouse parallax on hero visual (desktop)
  var visual = $('.hero__visual');
  if (window.matchMedia('(pointer: fine)').matches) {
    var qx = gsap.quickTo(visual, 'x', { duration: 0.8, ease: 'power3' });
    var qy = gsap.quickTo(visual, 'y', { duration: 0.8, ease: 'power3' });
    $('.hero').addEventListener('mousemove', function (e) {
      qx((e.clientX / window.innerWidth - 0.5) * 30);
      qy((e.clientY / window.innerHeight - 0.5) * 20);
    });

    // Magnetic primary CTA
    $$('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4 });
      });
      btn.addEventListener('mouseleave', function () { gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, .4)' }); });
    });
  }

  // Hero bottle drifts as you scroll away
  gsap.to('.hero__visual', {
    yPercent: 18, rotate: 6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Section headings + blocks
  $$('.reveal').forEach(function (el) {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  ScrollTrigger.batch('.reveal-card', {
    start: 'top 88%',
    once: true,
    onEnter: function (els) {
      gsap.from(els, { y: 60, opacity: 0, scale: 0.96, duration: 0.9, stagger: 0.12, ease: 'power3.out', overwrite: true });
    }
  });

  // Counters
  $$('.count').forEach(function (el) {
    var obj = { v: 0 };
    var to = +el.dataset.to;
    gsap.to(obj, {
      v: to, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString(); }
    });
  });

  // Temperature chart bars
  gsap.to('.chart__fill', {
    width: function (i, el) { return el.dataset.w + '%'; },
    duration: 1.6, ease: 'power3.out', stagger: 0.2,
    scrollTrigger: { trigger: '.chart', start: 'top 80%', once: true }
  });

  // Rising bubbles inside the insulation tile
  $$('.temp-drops i').forEach(function (d, idx) {
    gsap.set(d, { x: (idx - 2) * 14, scale: gsap.utils.random(0.4, 1), opacity: 0 });
    gsap.timeline({ repeat: -1, delay: idx * 0.45 })
      .fromTo(d, { y: 0 }, { y: -150, duration: 2.4, ease: 'sine.out' }, 0)
      .to(d, { opacity: 0.9, duration: 0.6 }, 0)
      .to(d, { opacity: 0, duration: 0.8 }, 1.6);
  });

  // Shop bottle entrance
  gsap.from('#shopBottle', {
    y: 120, rotate: 10, opacity: 0, duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: '.shop__stage', start: 'top 75%' }
  });

  // Marquee speeds up while scrolling
  var marquee = $('.marquee__track');
  ScrollTrigger.create({
    trigger: '.marquee',
    start: 'top bottom', end: 'bottom top',
    onUpdate: function (self) {
      var speed = 1 + Math.min(Math.abs(self.getVelocity()) / 600, 4);
      marquee.getAnimations().forEach(function (a) { a.playbackRate = speed; });
    }
  });

  // Impact wave
  gsap.to('.impact__wave svg', { xPercent: -50, duration: 8, repeat: -1, ease: 'none' });

  // Final bottles rise in
  gsap.from('.final__bottles svg', {
    y: 220, rotate: function (i) { return [-12, 0, 12][i]; }, duration: 1.2, stagger: 0.15, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.final', start: 'top 70%' }
  });

  // Guarantee seal pop
  gsap.from('.seal', {
    scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.guarantee', start: 'top 80%' }
  });
})();
