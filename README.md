# neobrutalism-css

A **softened-neobrutalism** CSS pack: thick black borders, hard offset shadows, bold type, rounded corners, a calm palette, and a satisfying *press* effect on interactive surfaces. Framework-agnostic — drop it into plain HTML, React, Vue, Svelte, anything. No build step required to consume, and the whole look reskins from a handful of CSS custom properties.

```
┌─────────────┐
│  Press me   │──┐   border: 4px solid #000
└─────────────┘  │   box-shadow: 8px 8px 0 #000
   └─────────────┘   :hover → shifts in · :active → flattens
```

## Install

**From GitHub (no npm publish needed):**

```bash
npm install github:tbollinger/neobrutalism-css#v1.0.0
```

```js
import 'neobrutalism-css/css';          // styles
import 'neobrutalism-css/js';           // optional behavior helper (modals/dropdowns)
// minified variants:
import 'neobrutalism-css/css/min';
import 'neobrutalism-css/js/min';
```

**Via CDN (jsDelivr serves the repo directly):**

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/tbollinger/neobrutalism-css@v1.0.0/dist/neobrutalism.min.css">
<script src="https://cdn.jsdelivr.net/gh/tbollinger/neobrutalism-css@v1.0.0/dist/neobrutalism.min.js"></script>
```

**Or just copy** `dist/neobrutalism.css` (+ `dist/neobrutalism.js`) into your project and link them.

## Use

Add component classes to your markup. The optional JS helper auto-wires modals and dropdowns; the CSS works fully without it.

```html
<button class="nb-btn nb-btn--primary">Save</button>

<div class="nb-card">
  <h3>Card title</h3>
  <p>Hover to press it in.</p>
</div>

<span class="nb-chip" style="--nb-pill-color: var(--nb-success)">Active</span>
```

**[See the live showcase →](https://tbollinger.github.io/neobrutalism-css/)** — every component rendered, with copy-paste snippets, install instructions, and the full token reference. (Source: [`docs/index.html`](docs/index.html).)

## Components

| Class | What |
|---|---|
| `.nb-card` · `--lg` · `--static` | Surfaces with the press effect (`--static` = no interaction) |
| `.nb-btn` · `--primary` `--secondary` `--danger` `--sm` `--block` | Buttons (`<button>`, `<a>`, submit) |
| `.nb-chip` · `.nb-pill` · `--interactive` | Tags/badges; set `--nb-pill-color` to fill |
| `.nb-input` · `.nb-label` · `.nb-error` | Text inputs, `<textarea>`, `<select>` |
| `.nb-checkbox` (+ `__input` `__box`) | Custom checkbox |
| `.nb-modal` (+ `__panel` `__close`) | Dialog — `data-nb-open="#id"`, `data-nb-close` |
| `.nb-dropdown` (+ `__trigger` `__panel` `__item` `__divider`) | Menu — `data-nb-toggle` |

### JS helper

Include `neobrutalism.js` and it auto-wires, on `DOMContentLoaded`:

- **Modals** — `[data-nb-open="#id"]` opens, `[data-nb-close]` / backdrop click / **Esc** closes.
- **Dropdowns** — `[data-nb-toggle]` toggles, outside-click / **Esc** closes.

Injecting markup later? Call `Neobrutalism.init()` again (idempotent). You can also drive things manually: `Neobrutalism.open(el)` / `Neobrutalism.close(el)`, or just toggle `.is-open` yourself if you skip the helper.

## Theming

Every value is a custom property. Override in your own `:root` (globally) or on any scoped container:

```css
:root {
  --nb-border-color: #1a1a2e;
  --nb-radius: 0;            /* hard-edge variant */
  --nb-accent: #ff5470;
  --nb-shadow-size: 6px;
}
```

Key tokens: `--nb-border-width` / `-sm`, `--nb-border-color`, `--nb-radius` / `-sm` / `-pill`, `--nb-shadow-size` / `-md` / `-sm`, `--nb-shadow-color`, `--nb-surface`, `--nb-ink`, `--nb-accent` (+ `--nb-success` `--nb-info` `--nb-danger` `--nb-warning`), `--nb-font`. Full list with comments in [`src/tokens.css`](src/tokens.css).

> **Font:** the look uses [Figtree](https://fonts.google.com/specimen/Figtree). Load it yourself (Google Fonts or self-hosted) to match exactly; otherwise it falls back to a system sans stack.

## Develop

```bash
node build.js     # bundle src/*.css → dist/, copy + minify the JS,
                  # and mirror the min files into docs/assets/
```

Source lives in `src/` (one file per component). `dist/` is committed so GitHub installs and the CDN work without a build. Edit source, rebuild, commit `dist/`.

The showcase site is a single static page in [`docs/`](docs/index.html) (the build copies the minified pack into `docs/assets/`). It's published via **GitHub Pages → Settings → Pages → Source: `main` / `/docs`** at <https://tbollinger.github.io/neobrutalism-css/>.

## License

MIT © tbollinger
