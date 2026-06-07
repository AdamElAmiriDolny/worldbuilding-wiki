from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.project import Project
from app.models.page import Page
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectRead, ProjectUpdate
from app.schemas.page import PageRead

# Creation of the router for the project endpoints.
router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("/", response_model=ProjectRead)
def create_project(project_data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(
        user_id = current_user.id,
        title = project_data.title,
        description = project_data.description
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project

@router.get("/", response_model=list[ProjectRead])
def list_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return projects

@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to access this project")
    
    return project

@router.put("/{project_id}", response_model=ProjectRead)
def update_project(project_id: int, project_data: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to update this project")
    
    if project_data is not None:
        project.title = project_data.title

    if project_data is not None:
        project.description = project_data.description

    db.commit()
    db.refresh(project)
    
    return project

@router.delete("/{project_id}", response_model=ProjectRead)
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this project")
    
    existing_page = db.query(Page).filter(Page.project_id == project_id).first()
    
    if existing_page is not None:
        raise HTTPException(status_code=400, detail="Cannot delete project with pages")

    db.delete(project)
    db.commit()

    return project

@router.get("/{project_id}/pages", response_model=list[PageRead])
def list_project_pages(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to access this project")
    
    pages = db.query(Page).filter(Page.project_id == project_id).all()

    return pages