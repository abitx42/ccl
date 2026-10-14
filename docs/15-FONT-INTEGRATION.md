# 15 — Devanagari font integration

## Current decision

The supplied AMS files are retained in `public/fonts/` as source assets, but they are **not
used by the site CSS**. The build currently contains Unicode Marathi text, so a webfont must
provide Unicode Devanagari glyphs and shaping tables. Applying a legacy-encoded font to
Unicode text can produce missing glyphs or incorrect Latin fallback behaviour.

The local inspection result for both supplied files is:

| File | Devanagari code points | GSUB | GPOS |
|---|---:|---|---|
| `public/fonts/AMS-Kashi-Regular.ttf` | 0 | no | no |
| `public/fonts/AMS-Samanya-Regular.ttf` | 0 | yes | yes |

The check is reproducible with:

```bash
npm run inspect:fonts
```

The specimen includes Marathi letters, conjuncts, matras, Marathi-specific letters, and
Devanagari digits. Both files currently miss every specimen character in their Unicode cmap.

## Safe next step

Obtain a Unicode Devanagari webfont version or written permission and a conversion/source
font that has a Unicode cmap. Then verify `GSUB`, `GPOS`, glyph coverage, and embedding rights
before adding an `@font-face` rule. Keep `font-display: swap` and a Unicode-capable fallback.

AMS Kashi may be reconsidered as a display font only after it passes this check. AMS Samanya
is not safe for the current Unicode Marathi content until its encoding is resolved. Niagara
Solid is not used for Marathi text because it is a Latin display font and would reduce
readability.

The active fallback stack is deliberately explicit in `src/styles/global.css`:

```css
"Noto Sans Devanagari", "Kohinoor Devanagari", "Nirmala UI", Mangal, system-ui, sans-serif
```
