# Setup notes
This document contains the necessary commands to successfully run the backend locally.

# Project structure
worldbuilding-wiki/
  backend/
    app/
      api/
      core/
      db/
      models/
      schemas/
    requirements.txt
    .env
  frontend/
  docs/
  README.md
  .gitignore

The backend stack being the following:
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Uvicorn

# Virtual environment startup 
INSIDE /backend --> .\venv\Scripts\Activate.ps1 --> (venv) deactivate

# FastAPI development server startup
uvicorn app.main:app --reload --> http://127.0.0.1:8000

# PostgreSQL database 
Name: worldbuilding_wiki

In order to open it from the terminal: psql -U postgres -d worldbuilding_wiki

list tables: \dt - exit PostgreSQL : \q

# Environment variables
The backend uses a .env file containing necessary information for the project's usability. Such as the connection to the database and 
secret keys.

