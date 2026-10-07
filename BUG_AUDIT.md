# CarCheck bug audit — startup + runtime hardening

## Critical fixes applied

1. **Host-assigned port was ignored.** The previous `dev`/`start` scripts forced port 3000. The original AI Studio project used the host-provided `PORT`, so managed previews could wait forever for a server on a different port. `server.mjs` and `vite.config.ts` now use `process.env.PORT` with a 3000 local fallback and `strictPort`.
2. **Persisted browser data could crash startup.** Old or malformed `carcheck_*` localStorage values were trusted as valid application state. Currency, market, preferences, saved IDs, notes, and favorites are now validated/sanitized, and writes are guarded for sandbox/private-browser environments.
3. **No render-level recovery existed.** A React error boundary now gives users a recoverable screen and a one-click CarCheck-storage reset instead of leaving the UI unusable.
4. **TypeScript config excluded Node globals.** `vite.config.ts` reads `process.env`, but `tsconfig.json` only loaded `vite/client` types. Node typings are now included.
5. **Deployment dependencies could be omitted.** Tailwind is now a runtime/build dependency so a production install that omits devDependencies still has the CSS package needed by Vite/Tailwind.
6. **Dependency ranges could drift between deployments.** Direct package versions are pinned instead of using caret ranges.

## Functional bugs fixed

7. **“Automatic only” advisor requests did nothing.** Transmission smart filters are now applied to recommendation results, including vehicles where both transmissions are available.
8. **Make filters omitted valid cars.** The recommendation filter hard-coded makes and omitted Fiat and Nissan. Makes and fuel types are now derived from the actual recommendation set.
9. **Clearing an empty result did not always clear the max-price filter.** The empty-state reset now clears `maxPriceEUR` too.
10. **Custom budget could become inverted.** Raising the custom minimum above the existing maximum now raises the maximum as well.
11. **Currency display and budget math disagreed.** Budget choices now display converted values; custom budget inputs are converted back to canonical EUR before scoring so changing the currency does not silently change purchasing power.
12. **Questionnaire preferences could keep stale market/currency values.** The questionnaire now synchronizes those props into its local preference state.
13. **Stale saved IDs inflated Garage counts.** Saved vehicle/listing IDs are filtered against records that actually exist in the current dataset.

## Validation performed in this environment

- Full TS/TSX source parse/type-contract pass using local stubs for external packages: **pass**.
- All relative imports checked: **0 missing**.
- Node syntax checks for `server.mjs` and maintenance scripts: **pass**.
- Vehicle/listing relationship checks: **20 vehicles, 19 listings, 0 duplicate/orphan failures**.
- Recommendation engine exercised across **220 preference combinations**: **0 exceptions / invalid outputs**.
- Local advisor, comparison logic, currency helpers, Greek tax helper, and corrupted-storage recovery smoke-tested: **pass**.

## Remaining environment limitation

The sandbox cannot resolve `registry.npmjs.org`, so it cannot install the npm dependency tree and execute a real Vite production bundle here. The source is configured for the host to install the pinned packages normally.
