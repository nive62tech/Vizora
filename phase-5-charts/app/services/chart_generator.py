import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json
from typing import List


def generate_chart(chart_type: str, df_data: List[dict], x_col: str, y_col: str, title: str) -> dict:
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


def suggest_chart(message: str, column_names: List[str]) -> dict:
    message_lower = message.lower()

    if "pie" in message_lower:
        chart_type = "pie"
    elif "line" in message_lower or "trend" in message_lower or "over time" in message_lower:
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

    return {
        "chart_type": chart_type,
        "x_col": x_col,
        "y_col": y_col,
    }