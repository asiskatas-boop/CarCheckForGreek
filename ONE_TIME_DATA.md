# One-time vehicle data plan

CarCheck can run entirely from local files. No live vehicle-data API is required.

## Recommended handoff

1. Buy or obtain a **European vehicle database snapshot** in CSV/JSON/SQL form with a commercial-use licence.
2. Upload that raw file to the project handoff. Keep supplier IDs and source fields intact.
3. Use the **European Environment Agency passenger-car CO2 dataset** as the authoritative cross-check for Greek/EU WLTP emissions, engine capacity and power where available.
4. Store licensed/local image URLs or local paths in `vehicle.imageUrl`. `VehicleImage` now prefers those supplied images and does not present the old generic Unsplash images as exact vehicles.

The app does not need continued access to the supplier after the snapshot has been normalized into its local data files/database.
