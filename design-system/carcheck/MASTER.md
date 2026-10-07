# CarCheck — Master Design System

**Source of truth:** UI/UX Pro Max audit guidance + CarCheck automotive product requirements.  
**Direction:** dark-first automotive advisor; calm, trustworthy, information-dense without looking like a trading dashboard.

## Core principles

- One visual language across Advisor, Vehicles, Marketplace, Comparison, Garage, and Details.
- Dark slate foundation with **one red action accent**. Green/amber/rose are semantic status colors only.
- Greek is the default locale. Every customer-facing control and status must support Greek and English.
- Never present static marketplace samples as live, verified, or current availability. Use “reference”, “snapshot”, or “saved sample” wording and point users to the source for confirmation.
- Minimum 44×44px target for primary mobile interactions. Visible keyboard focus on every interactive element.
- No emoji as structural icons; use Lucide consistently.
- Respect `prefers-reduced-motion`.

## Tokens

| Role | Light | Dark |
|---|---|---|
| Canvas | `#F8FAFC` | `#0F1115` |
| Surface | `#FFFFFF` | `#171A20` |
| Subtle surface | `#F1F5F9` | `#20242C` |
| Raised surface | `#FFFFFF` | `#252A33` |
| Primary text | `#0F172A` | `#F8FAFC` |
| Muted text | `#475569` | `#CBD5E1` |
| Border | `#CBD5E1` | `#343B47` |
| Accent | `#B91C1C` | `#DC2626` |
| Accent text | `#991B1B` | `#FCA5A5` |
| Success | `#047857` | `#34D399` |
| Warning | `#B45309` | `#FBBF24` |
| Danger | `#B91C1C` | `#F87171` |

Use semantic CSS variables from `src/index.css`; do not introduce new raw brand colors inside components.

## Typography

- Family: **Plus Jakarta Sans** for UI and content; JetBrains Mono only for technical/dev surfaces.
- Body: 16px / 24px.
- Secondary body: 14px / 20px.
- Labels/meta: 12–13px / 16px; never use tiny type for essential explanations.
- Section headings: 20–24px, 700–800.
- Display: 40–56px, compact tracking.
- Keep Greek body copy readable; avoid all-caps for long Greek labels.

## Shape, spacing, motion

- Controls: 12px radius.
- Cards/dialogs: 16px radius.
- Pills: fully rounded, only for tags/segmented controls.
- Spacing follows a 4/8px ladder: 4, 8, 12, 16, 24, 32, 48.
- Standard UI motion: 160–220ms, opacity/color/transform only; no layout-shifting hover effects.
- Under reduced motion, eliminate decorative transforms and near-instant all transitions/animations.

## Component rules

### Buttons
- Primary = red filled with white text.
- Secondary = neutral surface + visible border.
- Semantic green is not a general CTA color.
- Icon-only controls require accessible names and 44px target size.
- Toggle controls expose `aria-pressed`; disclosure controls expose `aria-expanded`.

### Navigation
- Desktop: top navigation with clear active state.
- Mobile: fixed labelled bottom navigation, maximum five destinations, never icon-only.
- Production navigation must not expose developer/export tooling.

### Dialogs & drawers
All overlays use the shared accessible dialog primitive:
- `role="dialog"`, `aria-modal="true"`, labelled heading.
- Focus moves inside on open, is trapped while open, Escape closes, and focus returns to the trigger.
- Body scroll is locked while open.
- Backdrop click may close only when clicking the backdrop itself.

### Forms
- Every input has a persistent label (visible preferred; `sr-only` only for compact specialist controls).
- 44px minimum input/control height on mobile.
- Selected state is exposed programmatically.
- Error/help/status text cannot depend on color alone.

### Marketplace/trust language
- Static dataset: “reference listing”, “saved snapshot”, “market sample”, “indicative range”.
- Never: “live”, “verified listing”, “available today”, or a freshness claim without a genuine feed/timestamp.
- Provide a source action when a user needs current availability.

## Accessibility release checks

- Normal text contrast ≥ 4.5:1.
- Keyboard-only operation for navigation, filters, comparison, saved garage, tabs, checklists and dialogs.
- At 200% text zoom, no controls/content overlap or disappear.
- Screen-reader state for selected/saved/compared/filter controls.
- `html[lang]` follows the active locale.
- Test responsive layouts at 375, 768, 1024 and 1440px.
