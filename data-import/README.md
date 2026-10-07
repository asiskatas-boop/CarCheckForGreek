# Vehicle data upload workflow

## What to upload

Upload the **raw export from the data provider**. Preferred order:

1. JSON / NDJSON from an API export
2. CSV
3. XLSX

Do not manually rewrite IDs, model names, years, prices, CO2 values, ratings, or source dates before importing. Keep the supplier's original record/derivative ID and include any data dictionary or field-definition file that comes with the export.

For a first integration pass, upload these together when available:

- vehicle/specification export;
- valuation/market-price export;
- Euro NCAP/safety mapping if it is not already in the spec feed;
- tax/emissions inputs or official-rule snapshot;
- image-provider vehicle mapping / IDs;
- supplier data dictionary and licence/usage notes.

## What CarCheck needs per vehicle

The UI model does **not** have to match the supplier schema. Keep the supplier schema intact; an adapter should map it into CarCheck's `Vehicle` shape.

Critical identity fields:

- supplier record / derivative ID;
- market/country;
- make;
- model / model family;
- derivative / trim;
- model year / production dates;
- body style;
- fuel / powertrain;
- transmission;
- engine or motor identifier where available.

Critical facts:

- power;
- displacement where applicable;
- certified CO2 / WLTP value and test basis;
- dimensions / seats / luggage capacity;
- safety rating **plus rating year/protocol**;
- current valuation **plus market, mileage/condition assumptions and retrieved date**;
- official tax calculation inputs and rule/effective date;
- recall/source IDs and refresh date.

## Provenance rule

Every important fact must be traceable. Do not replace several sources with one vague `source` field.

CarCheck supports separate provenance for:

- `specifications`
- `pricing`
- `taxation`
- `emissions`
- `safety`
- `recalls`
- `image`

At minimum each populated provenance record should include `provider`, `kind`, `sourceRecordId` when the provider offers one, `market`, and `retrievedAt`.

## Images

Do not upload random stock image URLs as model truth. For model/reference imagery, configure IMAGIN (or another licensed provider) and map the exact make/model/year/variant. For actual marketplace listings, keep the real listing photos from the licensed listing feed.

## Validation

For normalized JSON, run:

```bash
npm run validate:data -- data-import/vehicles.normalized.json
```

The validator catches missing identity fields, duplicate IDs, impossible ranges, missing provenance, and obviously stale/unsafe normalized records. It does not prove that a supplier fact is correct; it checks that CarCheck can audit where the fact came from.
