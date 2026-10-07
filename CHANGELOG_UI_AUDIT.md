# CarCheck UI/UX implementation — current state

## Apple / warm-neutral visual system

- Replaced the previous mixed automotive styling with one Apple-inspired, light-only system.
- Removed the red brand accent and theme toggle. Apple blue (`#0066CC`) is the only interactive brand color.
- Moved the entire customer UI onto warm whites, ivory, parchment, beige, and graphite semantic tokens.
- Switched typography to the Apple/system font stack and removed external UI font downloads.
- Reduced extra-bold typography, long all-caps labels, harsh image overlays, and unnecessary color noise.
- Primary CTAs use pill geometry; secondary actions use warm raised surfaces and neutral borders.
- Reworked vehicle image chrome to translucent ivory controls/badges rather than black gradients.
- Reworked vehicle detail so title/actions sit on a warm panel below photography instead of on a dark photo overlay.
- Removed the old Ferrari design document. `design-system/carcheck/MASTER.md` is the current source of truth.

## Accessibility and interaction

- Added consistent semantic design tokens, visible focus rings, 44px touch-target utilities, and reduced-motion handling.
- Added labelled mobile bottom navigation so core destinations stay available below the desktop breakpoint.
- Removed developer screen-export tooling from the application UI.
- Added product-wide Greek/English locale handling and synchronized the document `lang` attribute.
- Added `AccessibleDialog` with focus trapping, Escape close, focus restoration, body-scroll locking, dialog semantics, and backdrop behavior.
- Migrated vehicle details, comparison, and garage overlays to the shared accessible dialog behavior.
- Converted the vehicle inspection checklist to semantic pressed buttons.
- Added accessible tabs with roving focus and arrow/Home/End keyboard navigation.
- Added `aria-pressed`, `aria-expanded`, associated form labels, live result/advisor status, and accessible icon-button names where needed.
- Replaced structural emoji with Lucide icons.

## Data trust and behavior

- Static marketplace records are presented as reference/saved snapshots; users are told to verify price and availability at the source.
- Added useful no-results states to catalog, marketplace, and recommendations.
- Fixed conversational refinement so body-style, fuel exclusions, maximum price, and fallback search filters affect displayed recommendations.
- Recompute recommendations when the Greece/EU market changes and persist the updated preference profile.
- Added bookmarkable/back-forward primary views using `#advisor`, `#vehicles`, and `#marketplace`.
- Vehicle imagery routes through `VehicleImage` / the configured licensed image provider and uses a labelled neutral fallback instead of unrelated stock photos.
- Added `DataProvenance`, `VehicleProvenance`, data-source policy helpers, and a production verification gate.
- Added `data-import/` handoff guidance, a normalized JSON template, and `npm run validate:data` for import/provenance checks.

## Validation status

- Source-level TypeScript/TSX parser check: no syntax diagnostics.
- Normalized data template passes the new validator with zero errors and zero warnings.
- Static scan of active customer source finds no red/rose Tailwind styling, dark-mode variants, dark-theme class, or slate/black image-overlay styling.
- A full Vite build and live-DOM accessibility audit still require project dependencies on a networked development machine.
