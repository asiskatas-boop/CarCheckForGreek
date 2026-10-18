# Price data

The price guide is built from listing CSVs. Raw listings are **never committed**
(this repo is public); only `public/price-index.json`, which holds averages and
counts, goes online.

## CSV the car.gr scraper should write

One row per ad. Template: `public/cargr-template.csv` (also downloadable from the
site's «Δεδομένα» page).

| column | required | example | notes |
|---|---|---|---|
| id | yes | 40012345 | car.gr ad number, so repeat scrapes merge |
| make | yes | Toyota | as car.gr writes it |
| model | yes | Yaris | |
| year | yes | 2014 | first registration; "03/2014" also fine |
| price | yes | 8900 | "8.900 €" also fine; skip "Ρωτήστε" |
| km | strongly | 98000 | "98.000 km" also fine |
| fuel | strongly | Βενζίνη | Greek or English |
| gearbox | strongly | Χειροκίνητο | Αυτόματο / Χειροκίνητο |
| origin | strongly | Ελληνικό | Ελληνικό / Εισαγωγής (car.gr shows this) |
| scraped_at | strongly | 2026-10-20 | date of the scrape; scrape weekly and keep all |
| url, version, cc, hp, body, region, seller_type | optional | | |

Headers can be Greek (Μάρκα, Μοντέλο, Χρονολογία, Χιλιόμετρα, Τιμή…), the
separator `,` or `;`, UTF-8 with or without BOM. Never include seller names,
phone numbers or photos.

## Building the index

- In the browser: open the site at `#data`, drop the CSVs, check the report,
  click «Λήψη price-index.json».
- Or locally: `npm run prices:build -- cargr.csv collector.csv --out public/price-index.json`

Then commit `public/price-index.json`. Until real data arrives the committed
index is built from synthetic sample data (`npm run prices:sample`) and the
site says so.
