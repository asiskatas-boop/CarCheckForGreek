# CarCheck — Master Design System

**Source of truth:** Apple design analysis + the uploaded accessibility/UI skills + CarCheck product requirements.  
**Direction:** Apple-inspired, warm, quiet, light-only car-buying advisor. Product information leads; chrome recedes.

## Core principles

- One visual language across Advisor, Vehicles, Marketplace, Comparison, Garage, and Details.
- **No red brand color and no dark theme.** The product stays on warm whites, ivory, parchment, beige, and graphite.
- **Apple blue (`#0066CC`) is the only interactive brand color.** Use it for primary actions, links, focus, and selected state borders—not as decoration.
- Greek is the default locale. Every customer-facing control and status supports Greek and English.
- Never present static marketplace samples as live, verified, or current availability. Use “reference”, “snapshot”, “saved sample”, or “indicative range” wording and point to the source for confirmation.
- Minimum 44×44px target for frequent mobile interactions. Visible keyboard focus on every interactive element.
- No emoji as structural icons; use Lucide consistently.
- Respect `prefers-reduced-motion`.
- Favor whitespace, calm hierarchy, and a narrow reading measure over dense dashboard presentation.

## Tokens

| Role | Value | Purpose |
|---|---|---|
| Canvas | `#F4F1EA` | warm page background |
| Surface | `#FBF9F4` | primary cards and navigation |
| Raised surface | `#FFFDF9` | inputs, floating controls, elevated panels |
| Subtle surface | `#EEE9DF` | grouped controls, selected neutral regions |
| Strong neutral | `#E5DED2` | progress tracks / nested surfaces |
| Primary text | `#1D1D1F` | headings and body |
| Muted text | `#68645D` | secondary copy; WCAG-friendly on warm surfaces |
| Border | `#DED8CD` | quiet separators |
| Strong border | `#BBB3A6` | hover/strong separation |
| Action blue | `#0066CC` | primary CTA / selected / links |
| Action hover | `#0071E3` | hover / active |
| Success | `#456B57` | factual positive state only |
| Warning | `#765B2D` | caution state only |
| Danger | `#6B4F3B` | destructive state only; deliberately not red |

Use semantic CSS variables from `src/index.css`; do not introduce raw brand colors inside customer-facing components.

## Typography

- Family: Apple system stack (`-apple-system`, BlinkMacSystemFont, SF Pro where available, Helvetica Neue/system fallback).
- Display: 40–56px, weight 600, compact tracking.
- Section headings: 20–32px, weight 600.
- Body: 16–17px / ~1.5 line height.
- Secondary body: 14–15px / ~1.45 line height.
- Labels/meta: 12–13px only for supporting metadata.
- Avoid extra-bold weights and long all-caps labels. Greek body copy should remain sentence case and relaxed.

## Shape, spacing, motion

- Controls: 11px radius or pill for primary/segmented actions.
- Cards/dialogs: 18px radius.
- Pills: fully rounded for tags, chips, compact actions, and selected states.
- Spacing follows a 4/8px ladder: 4, 8, 12, 16, 24, 32, 48, 80.
- Standard UI motion: 150–220ms, primarily opacity/color. Avoid decorative scaling.
- Under reduced motion, remove decorative transforms and make transitions effectively instant.

## Image treatment

- Vehicle photography is content, not a dark-theme canvas.
- Do not add black gradients unless absolutely required for source imagery.
- Floating image controls use translucent ivory (`rgba(255,253,249,.92)`), graphite text, a white hairline, and blur.
- Titles and important controls belong on warm surfaces below imagery, not over high-contrast photo overlays.
- If the licensed model image cannot be resolved, show the labelled neutral placeholder rather than a potentially wrong stock image.

## Component rules

### Buttons
- Primary = Apple blue filled with white text, usually pill-shaped.
- Secondary = warm raised surface + visible neutral border + graphite text.
- Do not use red as CTA, selected state, hover, or brand accent.
- Icon-only controls require accessible names and a 44px target.
- Toggle controls expose `aria-pressed`; disclosure controls expose `aria-expanded`.

### Navigation
- Warm translucent top navigation, quiet border, restrained active state.
- Desktop uses text navigation; mobile uses fixed labelled bottom navigation.
- Production navigation must not expose developer/export tooling.
- The customer experience is light-only; do not expose a theme toggle.

### Dialogs & drawers
All overlays use the shared accessible dialog primitive:
- `role="dialog"`, `aria-modal="true"`, labelled heading.
- Focus moves inside on open, is trapped while open, Escape closes, and focus returns to the trigger.
- Body scroll is locked while open.
- Panels use warm surfaces; vehicle titles/actions sit below the image instead of on black overlays.

### Forms
- Every input has a persistent label.
- 44px minimum input/control height on mobile.
- Selected state is exposed programmatically and can use blue border/check + warm surface.
- Error/help/status text cannot depend on color alone.

### Marketplace/trust language
- Static dataset: “reference listing”, “saved snapshot”, “market sample”, “indicative range”.
- Never: “live”, “verified listing”, “available today”, or freshness claims without a genuine feed/timestamp.
- Provide a source action when a user needs current availability.

## Accessibility release checks

- Normal text contrast ≥ 4.5:1.
- Keyboard-only operation for navigation, filters, comparison, saved garage, tabs, checklists, and dialogs.
- At 200% text zoom, no controls/content overlap or disappear.
- Screen-reader state for selected/saved/compared/filter controls.
- `html[lang]` follows the active locale.
- Test responsive layouts at 375, 768, 1024, and 1440px.
