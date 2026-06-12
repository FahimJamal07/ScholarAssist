from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional

class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="The user's chosen display name.")
    email: EmailStr = Field(..., description="The user's email address.")
    password: str = Field(..., min_length=6, description="A secure password (at least 6 characters).")

class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="The user's registered email address.")
    password: str = Field(..., description="The user's password.")

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user query for RAG QA.")
    paper_ids: Optional[List[str]] = Field(default=[], description="Filter chunks by specified papers.")

class ComparisonRequest(BaseModel):
    paper_ids: List[str] = Field(..., min_items=2, description="List of paper identifiers to compare.")
    aspects: Optional[List[str]] = Field(default=[], description="Specific metrics to compare (e.g. results, data).")

class LiteratureReviewRequest(BaseModel):
    prompt: str = Field(..., description="Theme or focus for the literature review synthesis.")
    paper_ids: Optional[List[str]] = Field(default=[], description="Source papers to compile from.")

class NoveltyRequest(BaseModel):
    paper_id: str = Field(..., description="Target paper identifier for checking gap analysis.")
