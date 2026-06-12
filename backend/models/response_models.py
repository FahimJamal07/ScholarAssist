from pydantic import BaseModel
from typing import Any, Optional

class APIResponse(BaseModel):
    success: bool
    message: Optional[str] = ""
    data: Optional[Any] = None

class APIErrorResponse(BaseModel):
    success: bool = False
    error: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str

class TokenResponse(BaseModel):
    token: str
    user: UserResponse
