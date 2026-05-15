from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes.health import router as health_router
from app.api.routes.projects import router as projects_router
from app.api.routes.pages import router as pages_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
import app.models

# Lifespan method for the beginning of the program. SQLAlchemy creates all models if they do not already exist. 
# It does nothing on shutdown, since nothing is needed so far.
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title=settings.app_name, lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

app.include_router(health_router)
app.include_router(projects_router)
app.include_router(pages_router)