from datetime import datetime

from pydantic import BaseModel

# Here are the Pydantic schema models that will be used to define which data and its types are expected by the frontend/client.
class ProjectCreate(BaseModel):
    title: str
    description: str | None = None

class ProjectRead(BaseModel):
    id: int
    user_id: int
    title: str
    description: str | None
    created_at: datetime

class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None