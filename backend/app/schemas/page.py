from datetime import datetime

from pydantic import BaseModel

class PageCreate(BaseModel):
    project_id: int
    parent_id: int | None = None
    title: str
    content: str | None = None

class PageUpdate(BaseModel):
    parent_id: int | None = None
    title: str | None = None
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
