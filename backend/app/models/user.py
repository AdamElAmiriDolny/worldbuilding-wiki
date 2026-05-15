# TYPE_CHECKING import lets the editor resolve related models without causing runtime circular imports.
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

# Merely for VSCode's editor to understand what "Project" refers to. It does not affect runtime because TYPE_CHECKING is FALSE.
if TYPE_CHECKING:
    from app.models.project import Project

# Model used by the ORM that represents a table inside the database. Each mapped attribute represents a column.
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    '''
    Relationship between users and projects. The objects inside the list will be treated as forward references,
    thus disabling the possibility of circular imports.
    '''
    projects: Mapped[list["Project"]] = relationship(back_populates="user")