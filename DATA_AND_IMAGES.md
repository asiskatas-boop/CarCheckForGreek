# CarCheck production data & image strategy

The bundled `src/data/*.ts` files are **seed/reference data only**. They are useful for product development, ranking logic, and UI work, but they must not be treated as a production source of truth.

## Source hierarchy

Use a different authority for each data domain. Do not buy one generic dataset and assume it is equally strong for specifications, used prices, tax, recalls, safety, and imagery.

### 1. Vehicle identity, trims and specifications — JATO Dynamics

Use **JATO Index + Specifications** as the canonical Greece/EU vehicle catalogue. JATO covers Greece and supplies market-specific model/derivative identity, equipment, dimensions, powertrain, emissions, options, build rules, and pricing. For used vehicles, retain historical model-year/derivative records rather than mapping everything to the latest model.

Store the JATO Instance/record ID next to CarCheck's internal vehicle ID. Never identify a trim only from display text such as `Corolla Hybrid 1.8`.

Recommended refresh: nightly for active/new models; immutable snapshots for historical derivatives after verification.

### 2. Used-market valuations — autobiz / autobizMarket

Use **autobizMarket** for Greece/EU used-car valuation and market observations. Keep valuation assumptions with every result: market, date, mileage, age, condition, seller channel, and any trim/option adjustments.

Do not derive a "fair price" from the small hand-entered listing sample bundled with this repository.

Recommended refresh: daily or more frequently for actively tracked models.

### 3. Actual marketplace listings — licensed partner feed

For real listings, use an approved partner/dealer feed or commercial agreement with the marketplace. **Do not build the production product around scraping Car.gr pages without permission.** Car.gr publishes XML documentation for sellers importing their own vehicle inventory; that is not the same as a public buyer-side listings API.

Until a feed agreement exists, CarCheck should link users to a fresh marketplace search and describe local listing records only as reference samples.

Recommended refresh: minutes/hours depending on the feed; preserve the source listing ID and `retrievedAt` time.

### 4. Greek taxation and restrictions — official sources

- **AADE**: road-tax rules and myCAR. For an individual car, the value on the licence / Certificate of Conformity is the input of record.
- **gov.gr / competent ministry**: Athens ring rules and permit eligibility.
- Avoid storing a timeless `roadTaxEur` or `athensRingExempt` claim without the rule version, registration date, certified CO2, and retrieval/effective date that produced it.

`src/services/greekVehicleRules.ts` contains helper logic for the currently published bands, but official sources and the vehicle's own documents remain authoritative.

### 5. CO2 / regulatory registration reference — EEA + vehicle documents

Use the **European Environment Agency** datasets for model/registration-level CO2 reference and monitoring. For a specific used car, prefer its registration document or Certificate of Conformity over a model average.

### 6. Crash safety — Euro NCAP

Use **Euro NCAP** directly. Persist the rating year/protocol and adult/child/vulnerable-road-user/safety-assist sub-scores where available. A five-star result is not timeless because protocols change.

### 7. Recalls — EU Safety Gate + manufacturer/VIN check

Use **EU Safety Gate** alert IDs for European recall/safety notices and, when possible, the manufacturer's VIN recall checker for the individual vehicle. Store alert ID, publication date, retrieved date, affected model/date range, and source URL.

### 8. Model imagery — CarImages.org (one-time pull)

CarCheck now uses the public CarImages rights manifest instead of an image API. The archive publishes licence-resolved metadata for its Wikimedia Commons photographs. Run this once on a networked machine:

```bash
npm run images:pull
```

The importer downloads the current CarImages rights CSV, matches the CarCheck seed vehicles, **excludes CC BY-SA / ShareAlike photos**, prefers CC0/public-domain or CC BY images, downloads the selected files into `public/carimages/`, and generates `src/data/carImages.generated.ts`. CC BY credits are then shown directly with the image and linked to the recorded licence.

The app never loads the 50+ MB rights manifest in the browser. This is a data-preparation step, not a runtime API dependency. If no safe exact match is found, CarCheck shows the model placeholder rather than guessing. The combined `Fiat Punto / Panda 1.2 FIRE` seed record is intentionally skipped because it represents two different vehicles and should be split before assigning an image.

For actual marketplace inventory, use the listing's own licensed photographs from the listing source. A CarImages photograph is a model/generation reference image, not evidence of the condition of a specific used car.

See `CARIMAGES_SETUP.md` for the exact licensing policy and rerun instructions.

## Provenance model

The TypeScript model now includes `DataProvenance` / `VehicleProvenance`. Populate it when API contracts are connected. At minimum keep:

- `provider`
- `kind` (`authoritative`, `commercial`, `marketplace`, `reference`)
- `sourceRecordId`
- `sourceUrl` where allowed
- `market`
- `retrievedAt`
- `effectiveFrom` / `effectiveTo` where applicable
- `methodology` / assumptions for valuations

Never collapse specification, asking price, valuation, tax, emissions, recall, safety rating, and image into one generic `source` label. They age at different rates and have different authorities.

## Production gate

Leave `VITE_VERIFIED_VEHICLE_DATA="false"` while using seed records. Switch it to `true` only after the production adapters populate provenance and automated freshness checks are running.

Before release, add automated rules such as:

- reject vehicle specs with no provider record ID;
- reject used valuations older than the chosen freshness window;
- reject legal/tax values with no rule/effective date;
- reject Euro NCAP stars with no rating year;
- warn when recalls have not been refreshed recently;
- never display an image as an exact vehicle image when the provider match is only a generic fallback.

## When you receive the supplier export

Yes: upload the raw supplier data as well. JSON, CSV, or XLSX is fine. Prefer the untouched export plus the provider's data dictionary; do not manually rename or merge rows first.

Use `data-import/README.md` for the handoff checklist and `data-import/vehicle-import-template.json` as the normalized target shape. The supplier file itself can keep its own schema—build an adapter so provider IDs and provenance are not lost.

For normalized JSON, `npm run validate:data -- <file>` performs basic identity, range, duplicate, and provenance checks before the data reaches the UI.
