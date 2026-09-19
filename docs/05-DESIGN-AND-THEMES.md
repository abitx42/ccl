# 05 — Design and Themes

## Design Philosophy

- **Zero visual friction**: High legibility, mobile-first, respects slow networks and device constraints.
- **District-specific theming**: Each district has its own unique color palette, cultural motifs, and tone, while sharing the same underlying template and accessible structure.
- **Trilingual typography**: Native support for Devanagari script (Marathi and Hindi) without clipping or font display anomalies.

## Theme Tokens

Themes only change design tokens (colors, borders, accents, decorative motifs), never the HTML hierarchy or accessibility landmarks.

```css
/* Example District Token Schema */
:root[data-theme="palghar"] {
  --color-primary: #8B4513;      /* Warli earth ochre */
  --color-secondary: #2E5A44;    /* Forest canopy green */
  --color-accent: #D4A373;       /* Straw & terracotta */
  --color-surface: #FAF8F5;      /* Warm clay background */
  --color-text: #1F2421;
  --motif-pattern: url('/motifs/palghar-warli.svg');
}
```

## Accessibility (WCAG 2.2 AA)

- Contrast ratio ≥ 4.5:1 for body text, ≥ 3:1 for large headers.
- Interactive elements min 44x44 px touch targets.
- Visible focus rings for keyboard navigation.
- Respects `prefers-reduced-motion`.
