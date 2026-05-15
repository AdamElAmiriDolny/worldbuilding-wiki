# Technical decisions
This document explains important decisions that have been made throughout development.

## Backend stack
The backend uses:

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

My main reasoning behind chosing this stack is that I wanted to make sure that what I had learned in my first ever internship was properly understood and carried out. I invested time and energy into understanding how this side of Python works so I also wanted to create something of my own with it. 

As for the frontend, I was thinking of using JavaScript + React. I feel like my knowledge in those is scarce and I want to learn how to develop there too.

## One page model instead of separate category and entry tables
One of the first decisions that have shaped this project is how to relate the tree-like structure I aim to create. Originally, I was thinking of doing it in two tables. One would represent the "category" or "label", and another would represent the actual page with data on it. 

- categories
- entries

However, after discussion with colleagues and analyzing what would be most efficient for a wiki-like structure, I finally decided to use a single page model with an optional "parent_id". The reasons are the following:

- the app is intended to behave like a wiki, so having two sorts of data categorizations or definitions seemed a little overcomplicated 
- this way, a page can be both content and container
- another big thing was that I wanted users to be free to create their own structures, and so with this decision it provides a little more freedom as to how one decides to organize the pages
- categories such as "characters", "locations" or "religions" should not be hardcoded, this way users can create their own parent pages
- lastly, having a single self-referential page model allows flexible nesting

Example:

Characters
    Aldor
        Early life
Religions
    Solar Faith

In this structure, "Characters", "Aldor" and "Early life" are all pages.

The user can create pages that act as category-like containers. This way, the app becomes more flexible and allows for different worldbuilding styles.

## Slug generation
Users do not manually type slugs. I have created a function for that specific task and so the backend generates it from the page title.
I wanted there to be less user friction and more consistent URLs. It also fits nicely for future wiki-like routes and satisfies my OCD.

## Project pages are listed under the project route
The chosen endpoint to get all pages under a project is the following: GET /projects/{project_id}/pages

This was chosen instead of: GET /pages/project/{project_id}

It seemed like it made more sense since pages belong to projects. The URL reads more naturally and it better represents the data relationship.

## Page hierarchy
A page is top-level if: parent_id = null

A page is a child if: parent_id = another page id

Example:

Characters -> parent_id = null
Aldor -> parent_id = Characters.id
Early life -> parent_id = Aldor.id

During development, there was an important issue with updating the parent_id.

If the client omits parent_id, it should mean: Do not change the parent.

If the client sends:

{
  "parent_id": null
}

It should mean: Move the page to top level.

Because both an omitted optional field and a field explicitly sent as null can appear as None in the Pydantic object, the backend needs to distinguish which fields were actually sent.

update_data = page_data.model_dump(exclude_unset=True)

This creates a dictionary containing only the fields that were actually sent by the client. This way the program properly tracks whether it was omitted because we didn't want to change the parent, or because it should be moved to top level.

## Self-parent validation
A page cannot be its own parent.

PUT /pages/2

{
  "parent_id": 2
}

This is rejected. And error 400 will occur. It would break the tree structure. It would also create a hierarchy loop that would bug the app.

## Parent page must belong to the same project
When assigning a parent page, the backend checks that the parent belongs to the same project.

Invalid example: Page from project 1 uses parent from project 2

Logically, each project will have its own independent page tree. And pages from different projects will not be mixed.