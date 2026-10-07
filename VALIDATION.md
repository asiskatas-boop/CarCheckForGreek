# Validation notes — 2026-10-07

## Completed in this sandbox

- Source-level TypeScript/TSX parser check: **0 syntax errors**.
- Static source scan: **no red/rose utility styling, dark-mode variants, dark-theme class, or black/slate photo-overlay styling in active customer components**.
- Data import template: **0 validator errors, 0 warnings**.
- Checked customer-facing components for direct `Unsplash` / legacy `imageUrl` use: **none**. Vehicle imagery routes through `VehicleImage`.
- Checked customer-facing components for `<div onClick>` / `<span onClick>` patterns: **none found**.
- WCAG-oriented source checks from the uploaded AccessLint skill are present: global `:focus-visible`, 44px `.touch-target`, 320px minimum/reflow handling, and `prefers-reduced-motion` handling.
- Data trust messaging is rendered in Recommendations, Catalog, Marketplace and Vehicle Detail.
- Greek road-tax helper updated to the published per-gram band method (selected rate × full certified CO2 figure).

## Not completed here

A real Vite production build and live-DOM accessibility audit could not be completed because package installation timed out and this sandbox does not have the project's npm dependencies installed. The uploaded accessibility skill recommends a live-DOM verification pass because it can catch issues source review cannot.

On a networked development machine run:

```bash
npm install
npm run lint
npm run build
```

Then run the app and verify at minimum:

- keyboard-only navigation and visible focus;
- modal focus trap / Escape / focus restoration;
- 320px reflow without horizontal scrolling;
- 200% and 400% zoom;
- text-spacing overrides;
- reduced-motion mode;
- warm light-theme contrast across canvas, cards, controls, overlays, and focus states;
- Greek and EU market modes;
- IMAGIN image matching for every canonical model profile;
- verify that no customer-facing surface reintroduces a red or dark theme token.
