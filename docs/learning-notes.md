# Learning notes
This document contains concepts learned during backend development.

## Git
Git is a version control system.

It will track the changes that occur in the project and allows for creating checkpoints called commits.

Useful commands:

git status
git add .
git commit -m "message"

## Virtual environment
The backend uses a Python virtual environment.

The purpose of this is to isolate the project dependencies. That way we avoid conflicts with other Python projects and track the needed packages to run this program locally.

In order to activate the virtual environment: .\venv\Scripts\Activate.ps1
To deactivate it: deactivate

## FastAPI
FastAPI is the Python web framework used for the backend.

It allows for the creation of endpoints such as GET /projects/ or GET /pages/

## Endpoint
An endpoint is a specific API route and method.

method: GET
path: /projects/
purpose: list projects

## API
The API is the collection of routes exposed by the backend, so later there can be interaction between it and the clients.

## Uvicorn
Uvicorn runs FastAPI locally.

Command: uvicorn app.main:app --reload

app = Python package folder
main = main.py
final app = FastAPI app object
--reload = restart server when code changes

__init__.py file marks a folder as a Python package.
It can be empty, and it allows for imports like: from app.models.page import Page

The .env file stores environment specific values like the app name, database URL and the secret key for authentification.

config.py loads the values from .env and exposes them to Python code.

## SQLAlchemy ORM
ORM means Object-Relational Mapping.

It maps Python classes to database tables.

Example:

User class -> users table
Project class -> projects table
Page class -> pages table

## Model
A model is a Python class that represents a database table.

class Project(Base):
    __tablename__ = "projects"

Base is the common SQLAlchemy parent class for all models.

Mapped[...] means the attribute is managed by SQLAlchemy ORM.

## Foreign key
A foreign key connects one table to another.

Example: user_id: Mapped[int] = mapped_column(ForeignKey("users.id")) --> This means the project belongs to a real user

## Relationship
A SQLAlchemy relationship allows navigation between related models in Python.

Example: 

user.projects
project.pages
page.children

Foreign keys define database-level links.

relationship() defines Python ORM-level navigation.

## Session
A database session is the working object used to perform database operations.

It can:

add rows
query rows
update rows
delete rows
commit changes

Basically, everything that is needed to have a functioning database.

SessionLocal is a session factory. It creates a new database session when needed.

get_db() is a FastAPI dependency that creates the database session, gives it a route and closes it when the request finishes.

model_dump(exclude_unset=True) is a Pydantic method that converts a schema object into a Python dictionary containing only fields that were actually sent by the client.
Making it useful for partial updates.

This helps distinguish omitted fields from fields explicitly sent as null.

## Password hashing
Passwords are not stored directly. A hash occurs and that is what is saved by the database.

## JWT token
A JWT token is returned after login. It is signed with a secret key. The token stores the user's id in the "sub" field.

## Authorization header
Protected requests send the token in the HTTP Authorization header: Authorization: Bearer <token>

## get_current_user()
FastAPI dependency that reads the token from the request, decodes, validates, and extracts the user id. It also loads the user from the database after this process.
Returning the user object. Routes use it with: current_user: User = Depends(get_current_user)