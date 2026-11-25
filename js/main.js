/* Verónica Höft – Menü, Lightbox, Einblend-Effekte */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  /* --- Kopfzeile: Linie beim Scrollen ---------------------------------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Mobiles Menü ----------------------------------------------------- */
  var toggle = document.querySelector('.menu-toggle');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Schließen' : 'Menü';
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* --- Einblenden beim Scrollen ---------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* --- Lightbox ----------------------------------------------------------
     Jedes <button class="work__frame" data-full="…"> öffnet die Großansicht.
     Die Bildunterschrift wird aus dem <figcaption> der Abbildung übernommen. */
  var frames = Array.prototype.slice.call(document.querySelectorAll('.work__frame[data-full]'));
  if (!frames.length || typeof HTMLDialogElement === 'undefined') return;

  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Großansicht');
  dialog.innerHTML =
    '<div class="lightbox__bar">' +
      '<span class="lightbox__count" aria-live="polite"></span>' +
      '<button type="button" class="lightbox__close">Schließen</button>' +
    '</div>' +
    '<div class="lightbox__stage"><img alt=""></div>' +
    '<div class="lightbox__foot">' +
      '<div class="lightbox__caption"></div>' +
      '<div class="lightbox__nav">' +
        '<button type="button" data-step="-1" aria-label="Vorheriges Bild">←</button>' +
        '<button type="button" data-step="1" aria-label="Nächstes Bild">→</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(dialog);

  var stage = dialog.querySelector('.lightbox__stage');
  var image = stage.querySelector('img');
  var caption = dialog.querySelector('.lightbox__caption');
  var count = dialog.querySelector('.lightbox__count');
  var current = 0;
  var opener = null;

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function show(index) {
    current = (index + frames.length) % frames.length;
    var frame = frames[current];
    var thumb = frame.querySelector('img');
    var figcaption = frame.parentNode.querySelector('figcaption');

    image.classList.add('is-loading');
    image.onload = function () { image.classList.remove('is-loading'); };
    image.src = frame.getAttribute('data-full');
    image.alt = thumb ? thumb.alt : '';
    caption.innerHTML = figcaption ? figcaption.innerHTML : '';
    count.textContent = pad(current + 1) + ' / ' + pad(frames.length);

    // Nachbarbild vorladen
    var next = frames[(current + 1) % frames.length];
    new Image().src = next.getAttribute('data-full');
  }

  frames.forEach(function (frame, i) {
    frame.addEventListener('click', function () {
      opener = frame;
      show(i);
      root.classList.add('no-scroll');
      dialog.showModal();
    });
  });

  dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
  dialog.querySelectorAll('[data-step]').forEach(function (btn) {
    btn.addEventListener('click', function () { show(current + Number(btn.getAttribute('data-step'))); });
  });
  stage.addEventListener('click', function (e) {
    if (e.target === stage) dialog.close();
  });
  dialog.addEventListener('close', function () {
    root.classList.remove('no-scroll');
    image.removeAttribute('src');
    if (opener) opener.focus();
  });
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  // Wischgesten
  var startX = null;
  stage.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
