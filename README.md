# Fundacja Tomy – strona internetowa

Prosta, statyczna strona (czysty HTML + CSS, bez żadnych narzędzi do budowania).

```
site/
  index.html      ← treść strony
  css/style.css   ← wygląd (kolory na górze pliku)
  fonts/          ← czcionka Bricolage Grotesque (hostowana lokalnie, bez Google Fonts)
  js/main.js      ← przewijanie bez zmiany adresu, animacje kafelków i plamy, rok w stopce
  favicon.ico     ← ikona karty przeglądarki (dla starszych przeglądarek)
  img/            ← logo, ikony (favicon.png, icon-512.png, apple-touch-icon.png), og-image.png (podgląd linku, 2400×1260)
  404.html        ← strona błędu 404
  .htaccess       ← ustawienia serwera Apache: HTTPS, przekierowanie domen na fundacjatomy.pl, 404, nagłówki, cache
  robots.txt, sitemap.xml ← dla wyszukiwarek
.github/workflows/
  deploy-ftp.yml  ← automatyczny deploy na serwer FTP
```

Na serwer trafia **tylko** zawartość katalogu `site/`.

## Edycja treści

Cała treść jest w `site/index.html`.

- **E-mail** jest w HTML zapisany od tyłu (`data-u`, `data-d` w linku `.js-mail`) i składany przez `js/main.js` — ochrona przed robotami zbierającymi adresy. Przy zmianie adresu odwróć nowe części, np. `kontakt` → `tkatnok`.
- **Dane dla wyszukiwarek** (JSON-LD, typ `NGO`) są w `<head>` strony głównej — przy zmianie danych rejestrowych zaktualizuj je też tam.
- **Statystyki odwiedzin:** skrypt `wykr.es` w `<head>` (`index.html`, `404.html`), bez plików cookies.
  Jego adres jest też w nagłówku Content-Security-Policy w `site/.htaccess` (`script-src` i `connect-src`) — przy zmianie trzeba go poprawić w obu miejscach.
- **Skrypt wpisany w `<head>` strony głównej** (włączanie animacji) jest dopuszczony przez Content-Security-Policy po swoim skrócie `sha256-…`
  w `site/.htaccess`. Po zmianie tego skryptu trzeba tam wpisać nowy skrót — workflow przed wysyłką sprawdza to sam i w razie
  rozbieżności przerywa deploy, pokazując właściwy skrót. Nie dodawaj atrybutów `style="…"` ani bloków `<style>` w HTML — CSP je blokuje; style tylko w `css/style.css`.
- **sitemap.xml:** przy dodaniu nowej podstrony dopisz jej adres.

**Tryb ciemny:** strona sama przełącza się na ciemne kolory, gdy taki wygląd jest ustawiony w systemie. Kolory obu trybów są
na górze `css/style.css` (`:root` i blok `prefers-color-scheme: dark`).

**Logo:** `site/img/logo.png` (kolor), `logo-dark.png` (jasne litery i czerwone „M”, do trybu ciemnego) i `logo-white.png`
(całe białe, na ciemne tła), z przezroczystym tłem. Na stronie wyświetlane są pomniejszone kopie `logo-150.avif/.webp`,
`logo-300.avif/.webp`, `logo-300.png` oraz `logo-dark-150.avif/.webp`, `logo-dark-300.avif/.webp`, `logo-dark-300.png`
(PNG to zapas dla starych przeglądarek) — przy zmianie logo wygeneruj je na nowo z `logo.png` i `logo-dark.png` (szerokość 150 i 300 px). Ikony: `favicon.png`, `apple-touch-icon.png`. Kolor marki z logo: `#b12341` (zmienna `--brand` w `css/style.css`).

Podgląd lokalnie: wystarczy otworzyć `site/index.html` w przeglądarce.

**Wersje plików CSS i JS:** w HTML adresy mają postać `css/style.css?v=__HASH__`. Przy wysyłce na serwer workflow
zamienia `__HASH__` na skrót zawartości pliku, więc po każdej zmianie CSS lub JS przeglądarki od razu pobierają nową wersję
(a niezmienione pliki trzymają w pamięci podręcznej przez rok). Przy dodawaniu nowego pliku CSS/JS dopisz go do pętli
w kroku „Wersje plików CSS i JS” w `.github/workflows/deploy-ftp.yml`.

## Deploy na serwer FTP (zalecane)

Po każdym pushu do gałęzi `main` (zmiana w `site/`) GitHub sam wyśle pliki na serwer.

Jednorazowa konfiguracja – w repozytorium na GitHubie:
**Settings → Secrets and variables → Actions**

1. Zakładka **Secrets** → *New repository secret*, dodaj trzy sekrety:
   | Nazwa          | Wartość                                   |
   |----------------|-------------------------------------------|
   | `FTP_SERVER`   | adres serwera, np. `ftp.twojadomena.pl`   |
   | `FTP_USERNAME` | login FTP                                 |
   | `FTP_PASSWORD` | hasło FTP                                 |
2. Zakładka **Variables** → *New repository variable* (opcjonalnie):
   | Nazwa            | Wartość                                                  |
   |------------------|----------------------------------------------------------|
   | `FTP_REMOTE_DIR` | katalog strony na serwerze, np. `public_html` lub `/`     |

   Jeśli nie ustawisz, pliki trafią do katalogu, w którym ląduje się po zalogowaniu na FTP.
   Sprawdź w panelu hostingu, który katalog jest podpięty pod domenę.

Gotowe. Deploy można też uruchomić ręcznie: **Actions → Deploy na serwer FTP → Run workflow**.
Dopóki sekrety nie są ustawione, workflow kończy się ostrzeżeniem i niczego nie wysyła.

Uwagi:
- Połączenie jest szyfrowane (FTPS), jeśli serwer to obsługuje.
- Pliki usunięte z repozytorium **nie są** kasowane z serwera (żeby przypadkiem nie usunąć innych plików na koncie).
- Jeśli deploy kończy się błędem certyfikatu (częste na hostingach współdzielonych), w `deploy-ftp.yml`
  dopisz linię `set ssl:verify-certificate false;` pod `set ftp:ssl-allow true;`.
