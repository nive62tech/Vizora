from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import re
import pandas as pd
import plotly.express as px

router = APIRouter()

LIBRARY_FILE = os.path.join(os.path.dirname(__file__), '..', 'chart_library.json')
DASHBOARD_FILE = os.path.join(os.path.dirname(__file__), '..', 'dashboards.json')
COUNTER_FILE = os.path.join(os.path.dirname(__file__), '..', 'chart_counter.json')


def load_library() -> List[dict]:
    if not os.path.exists(LIBRARY_FILE):
        return []
    with open(LIBRARY_FILE, 'r') as f:
        return json.load(f)


def load_dashboards() -> List[dict]:
    if not os.path.exists(DASHBOARD_FILE):
        return []
    with open(DASHBOARD_FILE, 'r') as f:
        return json.load(f)


def save_dashboards(dashboards: List[dict]):
    with open(DASHBOARD_FILE, 'w') as f:
        json.dump(dashboards, f)


def save_library(charts: List[dict]):
    with open(LIBRARY_FILE, 'w') as f:
        json.dump(charts, f)


def get_next_chart_number() -> int:
    if not os.path.exists(COUNTER_FILE):
        with open(COUNTER_FILE, 'w') as f:
            json.dump({'count': 0}, f)
    with open(COUNTER_FILE, 'r') as f:
        data = json.load(f)
    next_num = data.get('count', 0) + 1
    with open(COUNTER_FILE, 'w') as f:
        json.dump({'count': next_num}, f)
    return next_num


def extract_chart_numbers(message: str) -> List[int]:
    return [int(n) for n in re.findall(r'\b(\d+)\b', message)]


def build_plotly_chart(chart_type: str, df_data: List[dict], x_col: str, y_col: str, title: str) -> dict:
    df = pd.DataFrame(df_data)
    chart_type = chart_type.lower().strip()

    if chart_type == "bar":
        fig = px.bar(df, x=x_col, y=y_col, title=title)
    elif chart_type == "line":
        fig = px.line(df, x=x_col, y=y_col, title=title)
    elif chart_type == "scatter":
        fig = px.scatter(df, x=x_col, y=y_col, title=title)
    elif chart_type == "pie":
        fig = px.pie(df, names=x_col, values=y_col, title=title)
    elif chart_type == "histogram":
        fig = px.histogram(df, x=x_col, title=title)
    else:
        fig = px.bar(df, x=x_col, y=y_col, title=title)

    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(26,29,39,1)',
        font_color='#e2e8f0',
        title_font_color='#ffffff',
        xaxis=dict(gridcolor='#2d3148', color='#a0aec0'),
        yaxis=dict(gridcolor='#2d3148', color='#a0aec0'),
    )
    return json.loads(fig.to_json())


class LiveEditRequest(BaseModel):
    message: str
    dashboard_id: str


class LiveEditResponse(BaseModel):
    action: str
    dashboard: dict
    message: str


@router.post("/dashboard/edit", response_model=LiveEditResponse)
async def live_edit_dashboard(request: LiveEditRequest):
    try:
        dashboards = load_dashboards()
        dashboard = None
        for d in dashboards:
            if d['id'] == request.dashboard_id:
                dashboard = d
                break

        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")

        message = request.message
        lower = message.lower()

        # --- RENAME DASHBOARD ---
        if any(word in lower for word in ['rename', 'call it', 'name it', 'title']):
            words = message.split()
            new_title = None
            for i, word in enumerate(words):
                if word.lower() in ['rename', 'called', 'named', 'title', 'it'] and i + 1 < len(words):
                    new_title = ' '.join(words[i+1:]).strip('"\'')
                    break
            if new_title:
                dashboard['title'] = new_title
                save_dashboards(dashboards)
                return LiveEditResponse(
                    action="renamed",
                    dashboard=dashboard,
                    message=f'Dashboard renamed to "{new_title}".'
                )

        # --- ADD CHART TO DASHBOARD ---
        if any(word in lower for word in ['add', 'include', 'insert']):
            numbers = extract_chart_numbers(message)
            if numbers:
                library = load_library()
                added = []
                for num in numbers:
                    already_in = any(c.get('chart_number') == num for c in dashboard['charts'])
                    if not already_in:
                        for chart in library:
                            if chart.get('chart_number') == num:
                                dashboard['charts'].append(chart)
                                if num not in dashboard['chart_numbers']:
                                    dashboard['chart_numbers'].append(num)
                                added.append(num)
                                break
                save_dashboards(dashboards)
                if added:
                    return LiveEditResponse(
                        action="added_charts",
                        dashboard=dashboard,
                        message=f'Added chart{"s" if len(added) > 1 else ""} {", ".join("#"+str(n) for n in added)} to the dashboard.'
                    )
                else:
                    return LiveEditResponse(
                        action="no_change",
                        dashboard=dashboard,
                        message="Those charts are already in the dashboard or not found in your library."
                    )

        # --- REMOVE CHART FROM DASHBOARD ---
        if any(word in lower for word in ['remove', 'delete', 'take out']):
            numbers = extract_chart_numbers(message)
            if numbers:
                before = len(dashboard['charts'])
                dashboard['charts'] = [c for c in dashboard['charts'] if c.get('chart_number') not in numbers]
                dashboard['chart_numbers'] = [n for n in dashboard['chart_numbers'] if n not in numbers]
                save_dashboards(dashboards)
                removed = before - len(dashboard['charts'])
                return LiveEditResponse(
                    action="removed_charts",
                    dashboard=dashboard,
                    message=f'Removed {removed} chart{"s" if removed > 1 else ""} from the dashboard.'
                )

        # --- CHANGE CHART TYPE ---
        chart_types = ['bar', 'line', 'scatter', 'pie', 'histogram']
        detected_type = None
        for ct in chart_types:
            if ct in lower:
                detected_type = ct
                break

        if detected_type and any(word in lower for word in ['make', 'change', 'convert', 'turn']):
            numbers = extract_chart_numbers(message)
            if numbers:
                library = load_library()
                updated = []
                for num in numbers:
                    for i, chart in enumerate(dashboard['charts']):
                        if chart.get('chart_number') == num:
                            if chart.get('plotly_json') and chart.get('x_col') and chart.get('y_col'):
                                new_title = f"Chart #{num} — {chart['y_col']} by {chart['x_col']}"
                                new_plotly = build_plotly_chart(
                                    detected_type,
                                    chart['plotly_json']['data'][0].get('x', []),
                                    chart['x_col'],
                                    chart['y_col'],
                                    new_title
                                )
                                dashboard['charts'][i]['plotly_json'] = new_plotly
                                dashboard['charts'][i]['chart_type'] = detected_type
                                updated.append(num)

                                # Update in library too
                                for j, lc in enumerate(library):
                                    if lc.get('chart_number') == num:
                                        library[j]['plotly_json'] = new_plotly
                                        library[j]['chart_type'] = detected_type
                                        break
                                save_library(library)
                            break

                save_dashboards(dashboards)
                if updated:
                    return LiveEditResponse(
                        action="changed_type",
                        dashboard=dashboard,
                        message=f'Changed chart{"s" if len(updated) > 1 else ""} {", ".join("#"+str(n) for n in updated)} to {detected_type}.'
                    )

        # --- FALLBACK ---
        return LiveEditResponse(
            action="unknown",
            dashboard=dashboard,
            message="I didn't understand that edit. Try: 'add chart 3', 'remove chart 1', 'make chart 2 a line chart', or 'rename this dashboard to Sales Report'."
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Live edit failed: {str(e)}")