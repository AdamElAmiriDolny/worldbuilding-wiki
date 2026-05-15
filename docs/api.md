# API endpoints
This document lists the current backend endpoints.

## Root

### GET /
Basic backend test.

Response:

{
  "message": "Backend is running"
}

## Health

### GET /health
Checks if routing properly works.

Response:

{
  "status": "ok"
}

## Projects

### POST /projects/
Creates a project.

Request body:

{
  "title": "Ashen World",
  "description": "Dark fantasy setting."
}

Response:

{
  "id": 1,
  "user_id": 1,
  "title": "Ashen World",
  "description": "Dark fantasy setting.",
  "created_at": "..."
}

*user_id* is hard-coded until authentification is implemented.

### GET /projects/
Lists all projects.

Response:

[
  {
    "id": 1,
    "user_id": 1,
    "title": "Ashen World",
    "description": "Dark fantasy setting.",
    "created_at": "..."
  }
]

### GET /projects/{project_id}
Gets one project by id.

Example: GET /projects/1

If the project does not exist, it returns 404. (not found)

### PUT /projects/{project_id}
Updates a project.

Request body can contain one or both fields, like so:

{
  "title": "Updated Title",
  "description": "Updated description."
}

If the project does not exist, it returns 404. (not found)

### GET /projects/{project_id}/pages
Lists all pages belonging to one project.

Example: GET /projects/1/pages

Response:

[
  {
    "id": 1,
    "project_id": 1,
    "parent_id": null,
    "title": "Characters",
    "slug": "characters",
    "content": null,
    "created_at": "...",
    "updated_at": "..."
  }
]

### DELETE /projects/{project_id}
Deletes a project.

If the project does not exist, it returns 404. (not found)

## Pages

### POST /pages/
Creates a page.

Top level/father node page example:

{
  "project_id": 1,
  "parent_id": null,
  "title": "Characters",
  "content": null
}

Child page example:

{
  "project_id": 1,
  "parent_id": 1,
  "title": "Aldor",
  "content": "Exiled prince of the northern kingdoms."
}

Rules: 

- project_id must reference an existing project
- parent_id can be null
- if parent_id is provided, it must reference an existing page
- parent page must belong to the same project
- slug is generated automatically from title

## GET /pages/{page_id}
Gets one page by id.

Example: GET /pages/1

If the page does not exist, it returns 404. (not found)

## PUT /pages/{page_id}
Updates one page.

Example: 

{
  "title": "Aldor the Exiled",
  "content": "Updated content."
}

When moving a page under another parent:

{
  "parent_id": 3
}

When moving a page back to top level:

{
  "parent_id": null
}

Rules:

- omitted fields are not changed
- sending "parent_id: null" moves the page to top level
- sending a number as "parent_id" moves the page under that parent
- a page cannot become its own parent
- parent must belong to the same project

## DELETE /pages/{page_id}
Deletes one page.

If the page does not exist, it returns 404. (not found)

Deleting a page that has child pages will require additional handling later.

## GET /pages/{page_id}/children
Lists direct children of a page.

Example: GET /pages/1/children

Response:

[
  {
    "id": 2,
    "project_id": 1,
    "parent_id": 1,
    "title": "Aldor",
    "slug": "aldor",
    "content": "Exiled prince.",
    "created_at": "...",
    "updated_at": "..."
  }
]

If the page exists, but has no children, response is:

[]

