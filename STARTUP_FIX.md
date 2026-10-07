# Startup fix

CarCheck must never depend on an external image source in order to start.

- `npm run dev`, `npm start`, and `npm run build` start/build the app directly.
- No CarImages download runs in `predev`, `prestart`, `prebuild`, `prepare`, or `postinstall`.
- `metadata.json` no longer declares a server-side Gemini capability because this build is frontend-only.
- CarImages importing remains an explicit maintenance task (`npm run images:pull`) and is not required for the app to render.
- If no imported image exists, `VehicleImage` renders a model-labelled placeholder rather than blocking or showing an unrelated car.
