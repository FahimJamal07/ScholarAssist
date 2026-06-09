from pydantic import BaseModel
from typing import Any, Optional

class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = ""
    data: Optional[Any] = None

class APIErrorResponse(BaseModel):
    success: bool = False
    error: str
