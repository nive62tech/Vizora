import pandas as pd
from pathlib import Path


def parse_file(filepath: str) -> dict:
    path = Path(filepath)
    suffix = path.suffix.lower()

    if suffix == ".csv":
        # Try UTF-8 first, fall back to latin-1 which handles all byte values
        try:
            df = pd.read_csv(filepath, encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(filepath, encoding="latin-1")
    elif suffix in [".xlsx", ".xls"]:
        df = pd.read_excel(filepath)
    elif suffix == ".json":
        df = pd.read_json(filepath)
    else:
        raise ValueError(f"Unsupported file type: {suffix}")

    df = df.where(pd.notnull(df), None)

    preview = df.head(5).to_dict(orient="records")

    return {
        "filename": path.name,
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "preview": preview,
    }