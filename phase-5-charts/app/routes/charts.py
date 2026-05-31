from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

router = APIRouter()

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'services'))
from chart_generator import generate_chart, suggest_chart
from chart_numbering import get_next_chart_number


class ChartRequest(BaseModel):
    message: str
    column_names: List[str]
    data: List[dict]
    filename: str


class ChartResponse(BaseModel):
    chart_number: int
    chart_type: str
    title: str
    x_col: str
    y_col: str
    plotly_json: dict


@router.post("/charts/generate", response_model=ChartResponse)
async def generate_chart_endpoint(request: ChartRequest):
    try:
        suggestion = suggest_chart(request.message, request.column_names)

        chart_number = get_next_chart_number()
        title = f"Chart #{chart_number} — {suggestion['y_col']} by {suggestion['x_col']}"

        plotly_json = generate_chart(
            chart_type=suggestion["chart_type"],
            df_data=request.data,
            x_col=suggestion["x_col"],
            y_col=suggestion["y_col"],
            title=title,
        )

        return ChartResponse(
            chart_number=chart_number,
            chart_type=suggestion["chart_type"],
            title=title,
            x_col=suggestion["x_col"],
            y_col=suggestion["y_col"],
            plotly_json=plotly_json,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart generation failed: {str(e)}")