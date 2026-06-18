# CLAUDE.md — Boat Fishing League

## Claude Directives

- Zawsze generuj pełne pliki — nigdy nie używaj `// reszta kodu` ani `...`.
- Pisz wiadomości commitów w formacie Conventional Commits: `feat:`, `fix:`, `style:`, `chore:`.
- Po dodaniu nowych zdjęć do `media/gallery/` lub `media/sponsors/` — uruchom odpowiedni skrypt generujący.
- Każdy nowy tekst widoczny użytkownikowi musi być dodany do wszystkich trzech języków w `i18n.js` (`en`, `pl`, `no`).
- Nie dodawaj frameworków, bundlerów ani narzędzi NPM — projekt jest celowo vanilla JS/HTML/CSS bez build step.
- Optymalizuj zdjęcia do formatu WebP przed dodaniem do `media/`.

---

## Commands

### Lokalny development

```bash
# Brak serwera deweloperskiego – otwórz bezpośrednio w przeglądarce:
start index.html

# Lub serwuj lokalnie przez dowolny serwer HTTP, np.:
npx serve .
python -m http.server 8080
```

### Generowanie HTML dla galerii i sponsorów

```bash
# Po dodaniu zdjęć do media/gallery/
node scripts/generate-gallery.js

# Po dodaniu logo do media/sponsors/
node scripts/generate-sponsors.js
```

> Skrypty nadpisują bloki HTML między znacznikami `<!-- GALLERY:START -->...<!-- GALLERY:END -->` i `<!-- SPONSORS:START -->...<!-- SPONSORS:END -->` w `index.html`.

### Testy i linting

Projekt nie ma skonfigurowanego testera ani lintera. Waliduj kod ręcznie lub użyj:

```bash
# Walidacja HTML (jeśli zainstalowane)
npx html-validate index.html tournaments/*.html

# Sprawdzenie CSS
npx stylelint "**/*.css"
```

---

## Architektura i Stack

| Warstwa | Technologia |
|---|---|
| Markup | HTML5 semantyczny |
| Styling | CSS3, CSS Custom Properties |
| Logika | Vanilla JS (ES6) — bez frameworków |
| i18n | Własny system w `i18n.js` (localStorage) |
| Ikony | Font Awesome 6.4.0 (CDN) |
| Fonty | Google Fonts — Montserrat (CDN) |
| Obrazy | WebP (wszystkie pliki w `media/`) |
| Deploy | Pliki statyczne — bez procesu budowania |

### Struktura katalogów

```
BoatFishingLeague/
├── index.html                  # Strona główna (wszystkie sekcje)
├── style.css                   # Główny arkusz stylów
├── i18n.js                     # System wielojęzyczności (EN/PL/NO)
├── media/
│   ├── gallery/                # Zdjęcia galerii (.webp) — auto-generowane
│   ├── sponsors/               # Loga sponsorów — auto-generowane
│   ├── glomma/                 # Media dla Glomma Classic
│   └── vansjo/                 # Media dla Vansjø
├── tournaments/
│   ├── tournament_style.css    # Style wspólne dla stron turniejów
│   ├── glomma_classic_2.html   # Strona turnieju Glomma Classic Stage 2
│   └── vansjo_30.html          # Strona turnieju Vansjø 30
└── scripts/
    ├── generate-gallery.js     # Generator HTML galerii
    └── generate-sponsors.js    # Generator HTML sponsorów
```

---

## Konwencje kodowania

### Nazewnictwo

| Element | Konwencja | Przykład |
|---|---|---|
| Pliki HTML/CSS/JS | `snake_case` z myślnikiem | `glomma_classic_2.html`, `tournament_style.css` |
| Klasy CSS | `kebab-case` | `.nav-container`, `.event-card` |
| ID HTML | `kebab-case` | `#zapisy`, `#najblizsze-zawody` |
| Funkcje JS | `camelCase` | `getLang()`, `applyLang()` |

### Internacjonalizacja (i18n)

Każdy nowy tekst wymaga:

1. Atrybutu `data-i18n="klucz"` (lub `data-i18n-html` dla HTML) na elemencie w `.html`
2. Wpisu w obiekcie `translations` w `i18n.js` dla wszystkich trzech języków:

```javascript
// i18n.js
translations.en.klucz = "Text in English";
translations.pl.klucz = "Tekst po polsku";
translations.no.klucz = "Tekst på norsk";
```

### CSS — zmienne i wzorce

```css
/* Paleta kolorów — zawsze używaj zmiennych, nie hardkoduj */
--primary-color: #1a2a40;
--secondary-color: #4a90e2;
--text-color: #333333;
--text-light: #666666;
--bg-light: #f4f7f6;
--transition: all 0.3s ease-in-out;

/* Breakpointy (max-width) */
/* Tablet  : 768px */
/* Mobile  : 480px */
/* SM phone: 380px */
```

### Nowa strona turnieju

Kopiuj istniejącą stronę turnieju jako szablon:

```bash
copy tournaments\vansjo_30.html tournaments\nowy_turniej.html
```

Strona turnieju powinna zawierać:
- Blok hero z datą, lokalizacją i statusem
- Sekcję opisu i harmonogramu
- Sidebar z detalami (opłata, deadline, formularz Google Forms)
- Link do powrotu do `index.html`
- Import `../tournaments/tournament_style.css`

### HTML — znaczniki dla skryptów auto-generujących

```html
<!-- GALLERY:START -->
<!-- tu wstawi generate-gallery.js — nie edytuj ręcznie -->
<!-- GALLERY:END -->

<!-- SPONSORS:START -->
<!-- tu wstawi generate-sponsors.js — nie edytuj ręcznie -->
<!-- SPONSORS:END -->
```
