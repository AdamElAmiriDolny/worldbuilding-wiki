from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.project import Project
from app.models.page import Page
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.schemas.page import PageRead

# Creation of the router for the project endpoints.
router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectRead)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = Project(
        user_id = 1,
        title = project_data.title,
        description = project_data.description
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project

@router.get("/", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects

@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project

@router.put("/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project_data: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_data is not None:
        project.title = project_data.title

    if project_data is not None:
        project.description = project_data.description

    db.commit()
    db.refresh(project)
    
    return project

@router.delete("/{project_id}", response_model=ProjectRead)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()

    return project

@router.get("/{project_id}/pages", response_model=list[PageRead])
def list_project_pages(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    pages = db.query(Page).filter(Page.project_id == project_id).all()

    return pages