# CarCheck UI/UX Audit Implementation

Implemented from the uploaded UI/UX Pro Max guidance and the CarCheck audit.

## Completed

- Unified the customer UI around a dark slate automotive system with one red action accent and semantic status colors.
- Added semantic design tokens, consistent radii, accessible focus rings, 44px touch-target utilities, and reduced-motion handling.
- Reworked the hero, catalog, marketplace, recommendation cards, comparison, garage, and navigation to use the shared system.
- Added a labelled mobile bottom navigation so primary destinations remain available below the desktop breakpoint.
- Removed screen-export tooling from production UI; it remains development-only.
- Added product-wide Greek/English locale handling and keeps the document `lang` attribute synchronized.
- Localized the principal catalog, marketplace, results, comparison, garage, detail controls, empty states, and advisor UI.
- Replaced exposed preference IDs with human-readable localized labels.
- Replaced structural emoji with Lucide icons.
- Added `AccessibleDialog` with focus trapping, Escape close, focus restoration, body-scroll locking, dialog semantics, and backdrop behavior.
- Migrated vehicle details, comparison, and garage overlays to the shared accessible dialog behavior.
- Converted the vehicle inspection checklist from clickable divs to semantic pressed buttons.
- Added accessible tabs with roving focus and arrow/Home/End keyboard navigation.
- Added `aria-pressed`, `aria-expanded`, associated form labels, live result/advisor status, and accessible icon-button names where needed.
- Softened stale marketplace language: static records are now presented as reference/saved snapshots and users are told to verify price/availability at the source.
- Added useful no-results states to catalog/marketplace/recommendations.
- Fixed conversational refinement so SUV/body-style, fuel exclusions, maximum price, and fallback search filters actually affect the displayed recommendations.
- Recompute recommendations when the Greece/EU market changes and persist the updated preference profile.
- Added bookmarkable/back-forward primary views using `#advisor`, `#vehicles`, and `#marketplace` without adding a routing dependency.
- Added responsive hero `srcSet`/`sizes`.
- Updated `design-system/carcheck/MASTER.md` to match the implemented source of truth.

## Validation

- All project TypeScript/TSX files pass a TypeScript transpile/syntax check.
- A secondary local type check with dependency stubs passes, including component prop contracts and internal project types.
- Static audit confirms no customer-facing old blue action accent remains, no structural emoji remains, and no clickable `<div>` remains in production customer components.
- A normal `npm run lint` / `npm run build` could not be completed in this environment because dependencies are not installed and npm registry requests fail with DNS `EAI_AGAIN`. Run `npm install && npm run lint && npm run build` in a networked development environment before deployment.

## Data accuracy, imagery and readability pass — 2026-10-07

- Replaced customer-facing hand-picked Unsplash vehicle photos with `VehicleImage`, an IMAGIN.studio CDN integration keyed by model identity/year and Greek country context.
- Added responsive image `srcSet` and an explicit labelled fallback so an unrelated stock car is never silently shown as the selected model.
- Removed the generic stock-photo hero and replaced it with a calmer, text-first landing layout.
- Defaulted the app to a warm off-white light theme; retained a softened charcoal dark mode and theme toggle.
- Increased dense supporting text from ~11–14px to ~12–15px across core buying flows and narrowed major reading layouts to `max-w-6xl`.
- Reduced colored visual noise in vehicle details by consolidating status and surface colors onto semantic design tokens.
- Removed visible fake seller-name emphasis and seller filtering from the reference-listing demo.
- Removed stale Car.gr classified-count / saved benchmark claims from customer-facing vehicle cards/details; current market searches remain linked for verification.
- Added `DataTrustNote` to catalog, recommendation, marketplace and vehicle-detail flows so seed data cannot be mistaken for a live commercial feed.
- Added `DataProvenance`, `VehicleProvenance` and `dataSourcePolicy.ts` to support provider IDs, market, timestamps and methodology per data domain.
- Added `VITE_VERIFIED_VEHICLE_DATA` production gate and `VITE_IMAGIN_CUSTOMER_KEY` configuration.
- Corrected the Greek road-tax helper to apply the published band rate to the full certified CO2 value rather than using a progressive/marginal calculation.
