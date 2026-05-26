from datetime import datetime

from pydantic import BaseModel

class PageLinkCreate(BaseModel):
    source_page_id: int
    target_page_id: int

class PageLinkRead(BaseModel):
    id: int
    source_page_id: int
    target_page_id: int
    created_at: datetime