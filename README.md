# Fundacja Tomy – strona internetowa

Prosta, statyczna strona (czysty HTML + CSS, bez żadnych narzędzi do budowania).

```
site/
  index.html      ← treść strony
  css/style.css   ← wygląd (kolory na górze pliku)
  img/logo.svg    ← logo (na razie tymczasowe)
.github/workflows/
  deploy-ftp.yml    ← automatyczny deploy na serwer FTP
  deploy-pages.yml  ← opcjonalny deploy na GitHub Pages
```

Na serwer trafia **tylko** zawartość katalogu `site/`.

## Edycja treści

Wszystkie miejsca do uzupełnienia są w `site/index.html` w nawiasach kwadratowych, np. `[Tu opis fundacji…]`,
numer konta, KRS, NIP, dane kontaktowe.

**Logo:** wgraj plik do `site/img/`. Jeśli to SVG – nadpisz `logo.svg`. Jeśli PNG/JPG – wgraj np. `logo.png`
i w `index.html` zmień `img/logo.svg` na `img/logo.png` (dwa miejsca: `<link rel="icon">` i `<img class="brand-logo">`).

Podgląd lokalnie: wystarczy otworzyć `site/index.html` w przeglądarce.

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

## Deploy na GitHub Pages (alternatywa)

To repozytorium jest **prywatne** – GitHub Pages dla prywatnych repozytoriów wymaga płatnego planu
(GitHub Pro/Team). Przy darmowym koncie trzeba by repozytorium uczynić publicznym.

Jeśli chcesz z tego skorzystać:
1. **Settings → Pages → Build and deployment → Source:** wybierz **GitHub Actions**.
2. **Actions → Deploy na GitHub Pages → Run workflow**.
3. Strona będzie pod adresem `https://<użytkownik>.github.io/Fundacja-Tomy/`.
   Własną domenę ustawisz w **Settings → Pages → Custom domain**.

Żeby Pages publikowało automatycznie po każdym pushu, odkomentuj sekcję `push:` w `deploy-pages.yml`.
