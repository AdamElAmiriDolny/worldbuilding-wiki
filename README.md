# Worldbuilding Wiki

A portfolio web application for organizing worldbuilding projects as wiki-like structures.

The goal of the project is to help users create and manage fictional worlds through projects, pages, hierarchy, and links between concepts.

## Current status

The backend currently supports:

- FastAPI app setup
- PostgreSQL database
- SQLAlchemy ORM models
- Project CRUD
- Page CRUD
- Hierarchical pages using `parent_id`
- Automatic slug generation
- Listing pages inside a project
- Listing direct children of a page
- Swagger API documentation

## Tech stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Uvicorn

### Frontend

Not implemented yet.

Planned frontend stack:

- React
- JavaScript or TypeScript
- React Router

## Core idea

A user creates a worldbuilding project.

Inside each project, the user creates pages.

Pages can act as both content and organizational nodes.

Example:

Project: Ashen World

Characters
  Aldor
    Early Life
Locations
  Red Mountains
Religions
  Solar Faith