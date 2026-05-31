from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
import os

router = APIRouter()

COUNTER_FILE = os.path.join(os.path.dirname(__file__), '..', 'chart_counter.json')


def get_next_chart_number() -> int:
    if not os.path.exists(COUNTER_FILE):
        _save_counter(0)
    with open(COUNTER_FILE, 'r') as f:
        data = json.load(f)
    next_num = data.get('count', 0) + 1
    _save_counter(next_num)
    return next_num


def _save_counter(count: int):
    with open(COUNTER_FILE, 'w') as f:
        json.dump({'count': count}, f)


def suggest_chart(message: str, column_names: List[str]) -> dict:
    message_lower = message.lower()

    if "pie" in message_lower:
        chart_type = "pie"
    elif "line" in message_lower or "trend" in message_lower:
        chart_type = "line"
    elif "scatter" in message_lower or "correlation" in message_lower:
        chart_type = "scatter"
    elif "histogram" in message_lower or "distribution" in message_lower:
        chart_type = "histogram"
    else:
        chart_type = "bar"

    numeric_cols = []
    text_cols = []

    for col in column_names:
        col_lower = col.lower()
        if any(word in col_lower for word in ['age', 'salary', 'price', 'count', 'amount', 'value', 'score', 'total', 'num', 'qty']):
            numeric_cols.append(col)
        else:
            text_cols.append(col)

    x_col = text_cols[0] if text_cols else column_names[0]
    y_col = numeric_cols[0] if numeric_cols else column_names[-1]

    return {"chart_type": chart_type, "x_col": x_col, "y_col": y_col}


def build_chart(chart_type: str, df_data: List[dict], x_col: str, y_col: str, title: str) -> dict:
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

        plotly_json = build_chart(
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