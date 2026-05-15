# Project progress
This document tracks what has been implemented so far.

# Completed backend setup
- Installed Git
- Installed Python
- Installed Node.js and npm
- Installed PostgreSQL
- Added PostgreSQL to PATH
- Created project folder structure
- Created backend virtual environment
- Installed backend dependencies
- Created initial FastAPI app
- Created health check endpoint
- Set up ".env" configuration
- Connected backend to PostgreSQL using SQLAlchemy
- Created database "worldbuilding_wiki"
- Created SQLAlchemy models
- Created database tables
- Added model relationships
- Added database session dependency
- Built project CRUD
- Built page CRUD
- Added page hierarchy logic
- Added automatic slug generation
- Added endpoint to list pages inside a project
- Added endpoint to list direct children of a page

# Current backend models

## User
Represents an application user.

Fields:

- id
- username
- email
- password_hash
- created_at

## Project
Represents a worldbuilding project.

Fields:

- id
- user_id
- title
- description
- created_at

## Page
Represents a wiki-like page inside a project.

Fields:

- id
- project_id
- parent_id
- title
- slug
- content
- created_at
- updated_at

## Current relationships

### User -> Project
One user can have many projects.

### Project -> Page
One project can have many pages.

### Page -> Page
A page can have one parent page and many child pages.

This allows a tree-like structure, like so:
Characters
  Aldor
    Early Life
Locations
  Capital City