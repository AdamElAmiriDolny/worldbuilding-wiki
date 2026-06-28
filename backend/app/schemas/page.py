from datetime import datetime

from pydantic import BaseModel, Field

class PageCreate(BaseModel):
    project_id: int
    parent_id: int | None = None
    title: str = Field(min_length=1)
    content: str | None = None

class PageUpdate(BaseModel):
    parent_id: int | None = None
    title: str | None = Field(default=None, min_length=1)
    content: str | None = None

class PageRead(BaseModel):
    id: int
    project_id: int
    parent_id: int | None = None
    title: str
    slug: str
    content: str | None = None
    created_at: datetime
    updated_at: datetime