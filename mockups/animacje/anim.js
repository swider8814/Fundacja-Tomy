// Propozycje delikatnych animacji — podgląd
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js-anim');

  // Hasło: podział na słowa
  var h1 = document.querySelector('.hero h1');
  if (h1) h1.innerHTML = h1.textContent.trim().split(/\s+/).map(function (w, i) {
    return '<span class="w" style="--i:' + i + '">' + w + '</span>';
  }).join(' ');

  // Strzałka w przycisku
  document.querySelectorAll('.btn').forEach(function (b) {
    b.innerHTML = b.innerHTML.replace('→', '<span class="arr">→</span>');
  });

  // Kafelki: pojawiają się, gdy wjadą w ekran; te widoczne naraz — po kolei
  var tiles = [].slice.call(document.querySelectorAll('.tile:not(.hero)'));
  var batch = 0, timer;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--d', (batch++ * 110) + 'ms');
      e.target.classList.add('is-in');
      io.unobserve(e.target);
      clearTimeout(timer); timer = setTimeout(function () { batch = 0; }, 150);
    });
  }, { threshold: 0.15 });
  tiles.forEach(function (t) { io.observe(t); });
})();
