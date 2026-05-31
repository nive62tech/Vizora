# Phase 6 — Chart Library

## What this phase covers

- Charts auto-saved to library after every generation
- GET /library/charts returns all saved charts
- POST /library/save saves a chart with ID
- DELETE /library/charts/{id} removes a chart
- PATCH /library/charts/{id} renames a chart
- Sidebar shows mini previews of all saved charts
- Clicking a chart in sidebar displays it in main area
- Delete button on each chart in library

## Storage

Charts saved to chart_library.json in backend app folder.
Chart counter saved to chart_counter.json.

## Status

Phase 6 complete. Ready for Phase 7 — Dashboard builder.