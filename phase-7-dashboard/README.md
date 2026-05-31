# Phase 7 — Dashboard Builder

## What this phase covers

- POST /dashboard/build detects chart numbers from message
- Fetches those charts from library and assembles dashboard
- Dashboard stored in dashboards.json
- GET /dashboard/all returns all saved dashboards
- PATCH /dashboard/{id} renames a dashboard
- DELETE /dashboard/{id} deletes a dashboard
- Frontend detects "dashboard" keyword in chat
- DashboardView renders charts in a responsive grid
- Dashboard title is editable inline
- Dashboards listed in sidebar, clickable to reopen

## How to use

Generate some charts first (say "show me a bar chart").
Then say: "create a dashboard with charts 1 and 2"
The dashboard opens automatically in the main area.

## Status

Phase 7 complete. Ready for Phase 8 — Live dashboard chat.