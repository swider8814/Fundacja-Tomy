// Fundacja Tomy — nawigacja bez zmiany adresu w pasku przeglądarki.
(function () {
  // Rok w stopce
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Adres e-mail składany dopiero w przeglądarce (w kodzie strony jest zapisany od tyłu),
  // żeby roboty zbierające adresy do spamu nie znalazły go w HTML.
  document.querySelectorAll('.js-mail').forEach(function (a) {
    var rev = function (s) { return (s || '').split('').reverse().join(''); };
    var addr = rev(a.getAttribute('data-u')) + '@' + rev(a.getAttribute('data-d'));
    a.href = 'mailto:' + addr;
    a.textContent = addr;
  });

  var cleanUrl = function () {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  };

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Logo: na stronie głównej przewiń na górę, adres bez "#"
    if (link.hasAttribute('data-home') && (location.pathname === '/' || /\/index\.html$/.test(location.pathname))) {
      e.preventDefault();
      window.scrollTo({ top: 0 });
      cleanUrl();
      return;
    }

    // Linki do sekcji (#o-fundacji, #dzialania, #kontakt): przewiń, nie zmieniając adresu
    var hash = link.getAttribute('href');
    if (!hash || hash.charAt(0) !== '#' || hash.length < 2) return;
    var target = document.getElementById(hash.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ block: 'start' });
  });

  // Ktoś wszedł starym linkiem z "#..." — pokaż sekcję i wyczyść adres
  if (location.hash) {
    var start = document.getElementById(location.hash.slice(1));
    if (start) start.scrollIntoView({ block: 'start' });
    cleanUrl();
  }

  // ---------- animacje ----------
  var root = document.documentElement;
  if (root.classList.contains('js-anim')) {
    // Kafelki pojawiają się, gdy wjadą na ekran; te widoczne naraz — po kolei, co 110 ms
    var batch = 0, reset;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target, d = batch++ * 110;
        t.style.setProperty('--d', d + 'ms');
        t.classList.add('is-in');
        setTimeout(function () { t.classList.add('settled'); }, d + 900);
        io.unobserve(e.target);
        clearTimeout(reset); reset = setTimeout(function () { batch = 0; }, 150);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.tile:not(.hero)').forEach(function (t) { io.observe(t); });
    root.classList.add('anim-ready');

    // Różowa plama: przy przewijaniu unosi się szybciej niż strona (efekt głębi).
    // Nowe przeglądarki robią to same w CSS (animation-timeline w style.css);
    // ten kod działa tylko w starszych, które tego nie potrafią.
    var blob = document.querySelector('.hero .blob.two');
    var cssScroll = window.CSS && CSS.supports && CSS.supports('(animation-timeline: scroll()) and (animation-range: entry)');
    if (blob && !cssScroll && 'translate' in blob.style) {
      var ticking = false;
      var move = function () {
        ticking = false;
        var y = Math.min(window.scrollY, 900);
        blob.style.translate = '0 ' + (-y * 0.25).toFixed(1) + 'px';
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(move); }
      }, { passive: true });
      move();
    }
  }
})();
