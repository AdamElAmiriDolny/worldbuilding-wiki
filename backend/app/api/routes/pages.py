import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.page import Page
from app.models.project import Project
from app.schemas.page import PageCreate, PageRead, PageUpdate

router = APIRouter(prefix="/pages", tags=["pages"])

# Function to generate the slug for each route name assigned to the pages. Example: Aldor the Exiled ---> aldor-the-exiled
def generate_slug(title: str) -> str:
    slug = title.lower().strip() #applies lowercase and strips the spaces from the edges
    slug = re.sub(r"\s+", "-", slug) #replaces spaces for dashes
    slug = re.sub(r"[^a-z0-9\-]", "", slug) #eliminates any invalid characters
    slug = re.sub(r"-+", "-", slug)
    return slug

@router.post("/", response_model=PageRead)
def create_page(page_data: PageCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == page_data.project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if page_data.parent_id is not None:
        parent_page = db.query(Page).filter(Page.id == page_data.parent_id).first()

        if parent_page is None:
            raise HTTPException(status_code=404, detail="Parent page not found")
        
        if parent_page.project_id != page_data.project_id:
            raise HTTPException(status_code=400, detail="Parent page does not belong to this project")
        
    slug = generate_slug(page_data.title)

    page = Page(
        project_id = page_data.project_id,
        parent_id = page_data.parent_id,
        title = page_data.title,
        slug = slug,
        content = page_data.content
    )

    db.add(page)
    db.commit()
    db.refresh(page)

    return page

@router.get("/{page_id}", response_model=PageRead)
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return page

@router.put("/{page_id}", response_model=PageRead)
def update_page(
    page_id: int,
    page_data: PageUpdate,
    db: Session = Depends(get_db),
):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    update_data = page_data.model_dump(exclude_unset=True)

    if "parent_id" in update_data:
        new_parent_id = update_data["parent_id"]
    
        if new_parent_id == page.id:
            raise HTTPException(
                status_code=400,
                detail="A page cannot be its own parent",
            )

        if new_parent_id is not None:
            parent_page = db.query(Page).filter(Page.id == new_parent_id).first()

            if parent_page is None:
                raise HTTPException(status_code=404, detail="Parent page not found")
            
            if parent_page.project_id != page.project_id:
                raise HTTPException(
                    status_code=400,
                    detail="Parent page does not belong to this project",
                )
            
        page.parent_id = new_parent_id

    if "title" in update_data:
        page.title = update_data["title"]
        page.slug = generate_slug(update_data["title"])
    
    if "content" in update_data:
        page.content = update_data["content"]

    db.commit()
    db.refresh(page)

    return page

@router.delete("/{page_id}", response_model=PageRead)
def delete_page(page_id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    child_pages = db.query(Page).filter(Page.parent_id == page_id).first()

    if child_pages is not None:
        raise HTTPException(status_code=400, detail="Cannot delete page with child pages")
    
    db.delete(page)
    db.commit()

    return page

@router.get("/{page_id}/children", response_model=list[PageRead])
def get_page_children(page_id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    children = db.query(Page).filter(Page.parent_id == page_id).all()

    return children