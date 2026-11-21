// Fundacja Tomy — nawigacja bez zmiany adresu w pasku przeglądarki.
(function () {
  // Rok w stopce
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

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
})();
