from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import re

router = APIRouter()

LIBRARY_FILE = os.path.join(os.path.dirname(__file__), '..', 'chart_library.json')
DASHBOARD_FILE = os.path.join(os.path.dirname(__file__), '..', 'dashboards.json')


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


def extract_chart_numbers(message: str) -> List[int]:
    numbers = re.findall(r'\b(\d+)\b', message)
    return [int(n) for n in numbers]


def is_dashboard_request(message: str) -> bool:
    lower = message.lower()
    return 'dashboard' in lower


class BuildDashboardRequest(BaseModel):
    message: str
    title: Optional[str] = "My Dashboard"


class UpdateDashboardRequest(BaseModel):
    title: str


class DashboardResponse(BaseModel):
    id: str
    title: str
    charts: List[dict]
    chart_numbers: List[int]


@router.post("/dashboard/build", response_model=DashboardResponse)
async def build_dashboard(request: BuildDashboardRequest):
    try:
        chart_numbers = extract_chart_numbers(request.message)

        if not chart_numbers:
            raise HTTPException(
                status_code=400,
                detail="No chart numbers found in message. Say something like 'create a dashboard with charts 1, 2 and 3'"
            )

        library = load_library()

        selected_charts = []
        for num in chart_numbers:
            for chart in library:
                if chart.get('chart_number') == num:
                    selected_charts.append(chart)
                    break

        if not selected_charts:
            raise HTTPException(
                status_code=404,
                detail=f"None of the chart numbers {chart_numbers} were found in your library. Generate those charts first."
            )

        dashboards = load_dashboards()
        dashboard_id = f"dashboard_{len(dashboards) + 1}"

        title = request.title
        lower = request.message.lower()
        if 'called' in lower or 'named' in lower or 'title' in lower:
            words = request.message.split()
            for i, word in enumerate(words):
                if word.lower() in ['called', 'named', 'title'] and i + 1 < len(words):
                    title = ' '.join(words[i+1:]).strip('"\'')
                    break

        dashboard = {
            "id": dashboard_id,
            "title": title,
            "charts": selected_charts,
            "chart_numbers": chart_numbers,
        }

        dashboards.append(dashboard)
        save_dashboards(dashboards)

        return DashboardResponse(**dashboard)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Dashboard build failed: {str(e)}")


@router.get("/dashboard/all")
async def get_all_dashboards():
    try:
        dashboards = load_dashboards()
        return {"dashboards": dashboards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dashboards: {str(e)}")


@router.get("/dashboard/{dashboard_id}")
async def get_dashboard(dashboard_id: str):
    try:
        dashboards = load_dashboards()
        for d in dashboards:
            if d['id'] == dashboard_id:
                return d
        raise HTTPException(status_code=404, detail="Dashboard not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/dashboard/{dashboard_id}")
async def rename_dashboard(dashboard_id: str, request: UpdateDashboardRequest):
    try:
        dashboards = load_dashboards()
        for d in dashboards:
            if d['id'] == dashboard_id:
                d['title'] = request.title
                break
        save_dashboards(dashboards)
        return {"message": "Dashboard renamed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/dashboard/{dashboard_id}")
async def delete_dashboard(dashboard_id: str):
    try:
        dashboards = load_dashboards()
        dashboards = [d for d in dashboards if d['id'] != dashboard_id]
        save_dashboards(dashboards)
        return {"message": "Dashboard deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))