from pydantic import BaseModel
from typing import List

class UploadResponse(BaseModel):
    filename: str
    rows: int
    columns: int
    column_names: List[str]
    preview: List[dict]