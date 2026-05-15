from collections.abc import Generator
from sqlalchemy.orm import Session

from app.db.session import SessionLocal

# Now, the variable db is attributed a real database session which will be used by the route to perfrom CRUD actions.
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()