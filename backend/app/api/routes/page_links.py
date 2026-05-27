from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.page import Page
from app.models.page_link import PageLink
from app.models.project import Project
from app.models.user import User
from app.schemas.page_link import PageLinkCreate, PageLinkRead

router = APIRouter(prefix="/page-links", tags=["page-links"])

@router.post("/", response_model=PageLinkRead)
def create_page_link(link_data: PageLinkCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    source_page = db.query(Page).filter(Page.id == link_data.source_page_id).first()

    if source_page is None:
        raise HTTPException(status_code=404, detail="Source page not found")
    
    source_project = db.query(Project).filter(Project.id == source_page.project_id).first()

    if source_project is None:
        raise HTTPException(status_code=404, detail="Source project not found")

    if source_project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to create links from this page")
    
    target_page = db.query(Page).filter(Page.id == link_data.target_page_id).first()

    if target_page is None:
        raise HTTPException(status_code=404, detail="Target page not found")
    
    if source_page.id == target_page.id:
        raise HTTPException(status_code=400, detail="A page cannot link to itself")
    
    if source_page.project_id != target_page.project_id:
        raise HTTPException(status_code=400, detail="Pages must belong to the same project")
    
    existing_link = (db.query(PageLink).filter(PageLink.source_page_id == link_data.source_page_id, PageLink.target_page_id == link_data.target_page_id).first())

    if existing_link is not None:
        raise HTTPException(status_code=400, detail="This page link already exists")
    
    page_link = PageLink(source_page_id = link_data.source_page_id, target_page_id = link_data.target_page_id)

    db.add(page_link)
    db.commit()
    db.refresh(page_link)

    return page_link

@router.get("/pages/{page_id}/links", response_model=list[PageLinkRead])
def get_page_links(page_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    project = db.query(Project).filter(Project.id == page.project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to access this page")
    
    links = db.query(PageLink).filter(PageLink.source_page_id == page_id).all()

    return links

@router.get("/pages/{page_id}/backlinks", response_model=list[PageLinkRead])
def get_page_backlinks(page_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    page = db.query(Page).filter(Page.id == page_id).first()

    if page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    
    project = db.query(Project).filter(Project.id == page.project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to access this page")
    
    backlinks = db.query(PageLink).filter(PageLink.target_page_id == page_id).all()

    return backlinks

@router.delete("/{link_id}", response_model=PageLinkRead)
def delete_page_link(link_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    page_link = db.query(PageLink).filter(PageLink.id == link_id).first()

    if page_link is None:
        raise HTTPException(status_code=404, detail="Page link not found")
    
    source_page = db.query(Page).filter(Page.id == page_link.source_page_id).first()

    if source_page is None:
        raise HTTPException(status_code=404, detail="Source page not found")

    project = db.query(Project).filter(Project.id == source_page.project_id).first()

    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed to delete this page link")

    db.delete(page_link)
    db.commit()

    return page_link