from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# This is used by SQLAlchemy to connect to the PostgreSQL database. It is the access gateway.
engine = create_engine(settings.database_url)

# Sessionmaker is SQLAlchemy's tool for creating sessions. 
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)