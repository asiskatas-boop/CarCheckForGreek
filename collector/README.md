# ChekCAReto Collector (Chrome)

Saves price, km, year and model from car ads you scroll past on Facebook
(car groups and Marketplace), to build the ChekCAReto used-car price guide.

- Works only while you browse. It never clicks, opens or scrolls anything by itself.
- Reads text with plain rules, no AI, so it costs nothing to run.
- Does not store names, phone numbers (removed from the text) or photos.
- Everything stays in your browser until you download it as CSV or JSON.

## Install (no terminal)

1. Download `chekcareto-collector.zip` and unzip it. You get a folder `chekcareto-collector`.
2. In Chrome open `chrome://extensions`.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `chekcareto-collector` folder.
5. Pin the extension (puzzle icon, then the pin) so the counter is visible.

To update later: replace the folder with the new one and click the reload arrow
on the extension card. Saved ads are kept.

## Daily use

1. Open a car group or Marketplace › Vehicles on Facebook.
2. Scroll as usual. Each saved ad gets a small yellow label with what was read.
   A white dashed label means something is missing (e.g. year): tap
   "Δείτε περισσότερα" on the post if the text is cut, and it re-reads it.
3. Open comments on posts you care about: the seller's "πουλήθηκε" or
   "έπεσε στα 7.500" and buyers' offers are picked up too.
4. The number on the icon is today's new ads. Click it for totals and downloads.

Tip: scroll the same groups every day. Ads that vanish after you have
scanned their group again for 3+ days are marked `maybe_gone` (probably sold).

## What is saved per ad

`source, group, post id, link, first/last seen, days seen, make, model, year, km,
price history (from the ad and from the seller's comments), fuel, gearbox, cc, hp,
place, region, Greek or imported, sold, buyer offers, missing fields, ad text`.

## For developers

- `src/parser.js`: Greek ad rules (also used by the web app later). Tests: `node --test collector/test/parser.test.cjs`
- `src/extract.js`: reads posts from the page using roles and link shapes, not Facebook class names.
- `src/content.js`: watches scrolling, sends new or changed ads to `src/background.js`, which stores them.
- Browser test with mock pages: `python3 collector/test/e2e/run.py collector`
