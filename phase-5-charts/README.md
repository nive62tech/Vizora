# Phase 5 — Chart Generation

## What this phase covers

- POST /charts/generate endpoint
- Auto-detects chart type from user message keywords
- Suggests best x and y columns based on column names
- Generates Plotly chart and returns JSON
- Auto-numbered charts (#1, #2, #3...)
- Frontend detects chart keywords and calls chart endpoint
- Charts rendered inline in chat using react-plotly.js

## Chart types supported

- Bar (default)
- Line
- Scatter
- Pie
- Histogram

## Keywords that trigger chart generation

chart, plot, graph, visualize, bar, line, pie, scatter, histogram, show me

## Status

Phase 5 complete. Ready for Phase 6 — Chart library.