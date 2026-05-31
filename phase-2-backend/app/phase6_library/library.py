from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter()

LIBRARY_FILE = os.path.join(os.path.dirname(__file__), '..', 'chart_library.json')


def load_library() -> List[dict]:
    if not os.path.exists(LIBRARY_FILE):
        return []
    with open(LIBRARY_FILE, 'r') as f:
        return json.load(f)


def save_library(charts: List[dict]):
    with open(LIBRARY_FILE, 'w') as f:
        json.dump(charts, f)


class SaveChartRequest(BaseModel):
    chart_number: int
    chart_type: str
    title: str
    x_col: str
    y_col: str
    plotly_json: dict
    filename: str


class RenameChartRequest(BaseModel):
    title: str


@router.post("/library/save")
async def save_chart(request: SaveChartRequest):
    try:
        charts = load_library()
        chart = request.dict()
        chart['id'] = f"chart_{request.chart_number}"
        charts.append(chart)
        save_library(charts)
        return {"message": "Chart saved", "id": chart['id']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chart: {str(e)}")


@router.get("/library/charts")
async def get_all_charts():
    try:
        charts = load_library()
        return {"charts": charts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load charts: {str(e)}")


@router.delete("/library/charts/{chart_id}")
async def delete_chart(chart_id: str):
    try:
        charts = load_library()
        charts = [c for c in charts if c.get('id') != chart_id]
        save_library(charts)
        return {"message": "Chart deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete chart: {str(e)}")


@router.patch("/library/charts/{chart_id}")
async def rename_chart(chart_id: str, request: RenameChartRequest):
    try:
        charts = load_library()
        for chart in charts:
            if chart.get('id') == chart_id:
                chart['title'] = request.title
                break
        save_library(charts)
        return {"message": "Chart renamed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rename chart: {str(e)}")