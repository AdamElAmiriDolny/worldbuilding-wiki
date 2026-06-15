import { useEffect, useState } from "react";
import "./App.css";

function App() {

  // Authentication states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Project and page navigation states
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  // Create form states
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageContent, setNewPageContent] = useState("");
  const [newPageParentId, setNewPageParentId] = useState(""); 

  // Page link panel states
  const [pageLinks, setPageLinks] = useState([]);
  const [pageBacklinks, setPageBacklinks] = useState([]);

  // Page edit states
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [editPageTitle, setEditPageTitle] = useState("");
  const [editPageContent, setEditPageContent] = useState("");

  // Project edit states
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");

  async function loadUserAndProjects(authToken){
    const meResponse = await fetch("http://127.0.0.1:8000/auth/me", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if(!meResponse.ok){
      throw new Error("Could not load user.");
    }

    const meData = await meResponse.json();

    const projectsResponse = await fetch("http://127.0.0.1:8000/projects/", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if(!projectsResponse.ok){
      throw new Error("Could not load projects.");
    }

    const projectsData = await projectsResponse.json();

    setUser(meData);
    setProjects(projectsData);
  }

  useEffect(() => {
    const savedToken = localStorage.getItem("worldbuilding_wiki_token");

    if(!savedToken){
      setIsAuthLoading(false);
      return;
    }

    async function restoreSession(){
      try{
        await loadUserAndProjects(savedToken);
        setToken(savedToken);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("worldbuilding_wiki_token");
        setToken("");
        setUser(null);
        setProjects([]);
      } finally {
        setIsAuthLoading(false);
      }
    }
    
  restoreSession();
}, []);

  /* 
    Function that handles the event of clicking a project.
    It stores the clicked project, clears old selected page/link data, fetches the project's pages from the backend
    and then saves those in React state.
  */
  async function handleProjectClick(project){
    setSelectedProject(project);

    setIsEditingProject(false);
    setEditProjectTitle(project.title);
    setEditProjectDescription(project.description || "");
    setSelectedPage(null);
    setPageLinks([]);
    setPageBacklinks([]);

    const response = await fetch(
      `http://127.0.0.1:8000/projects/${project.id}/pages`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    setPages(data);
  }

/*
  Function that handles the event of clicking a page.
  It fetches the selected page's data, and saves those in React state to display.
  It also prepares the form for editing the page with its corresponding title/content and fetches outgoing links and backlinks.
*/

  async function handlePageClick(page){
    const pageResponse = await fetch(`http://127.0.0.1:8000/pages/${page.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const pageData = await pageResponse.json();

    setSelectedPage(pageData);

    setIsEditingPage(false);
    setEditPageTitle(pageData.title);
    setEditPageContent(pageData.content || "");

    const linksResponse = await fetch(`http://127.0.0.1:8000/page-links/pages/${page.id}/links`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const linksData = await linksResponse.json();

    setPageLinks(linksData);

    const backlinksResponse = await fetch(`http://127.0.0.1:8000/page-links/pages/${page.id}/backlinks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const backlinksData = await backlinksResponse.json();

    setPageBacklinks(backlinksData);
  }

  /*
    Function that controls the login states.
  */

  function handleLogout(){
    localStorage.removeItem("worldbuilding_wiki_token");

    setEmail("");
    setPassword("");
    setToken("");
    setUser(null);
    setProjects([]);
    setSelectedProject(null);
    setPages([]);
    setSelectedPage(null);
    setPageLinks([]);
    setPageBacklinks([]);
    setIsEditingPage(false);
    setEditPageTitle("");
    setEditPageContent("");
    setIsEditingProject(false);
    setEditProjectTitle("");
    setEditProjectDescription("");
  }

  async function handleCreateProject(event) {
    event.preventDefault();

    if(!newProjectTitle.trim()) {
      alert("Project title is required.");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/projects/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newProjectTitle.trim(),
        description: newProjectDescription || null,
      })
    });

    const createdProject = await response.json();

    setProjects([...projects, createdProject]);
    setNewProjectTitle("");
    setNewProjectDescription("");
  }

  async function handleCreatePage(event) {
    event.preventDefault();

    if(!selectedProject) {
      return;
    }

    if(!newPageTitle.trim()) {
      alert("Page title is required.");
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/pages/", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        project_id: selectedProject.id,
        parent_id: newPageParentId ? Number(newPageParentId) : null,
        title: newPageTitle.trim(),
        content: newPageContent || null,
      })
    });

    const createdPage = await response.json();

    setPages([...pages, createdPage]);
    setNewPageTitle("");
    setNewPageContent("");
    setNewPageParentId("");
  }

  async function handleDeleteProject(project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title || "Untitled project"}"?`
    );

    if(!confirmed){
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/projects/${project.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.detail || "Could not delete project.");
      return;
    }

    setProjects(projects.filter((item) => item.id !== project.id));

    if(selectedProject?.id === project.id) {
      setSelectedProject(null);
      setPages([]);
      setSelectedPage(null);
    }

  }

  function handleStartEditPage(){
    if (!selectedPage){
      return
    }

    setEditPageTitle(selectedPage.title);
    setEditPageContent(selectedPage.content || "");
    setIsEditingPage(true);
  }

  function handleCancelEditPage(){
    setIsEditingPage(false);
    setEditPageTitle(selectedPage?.title || "");
    setEditPageContent(selectedPage?.content || "");
  }

  async function handleSavePage(event){
    event.preventDefault();

    if(!selectedPage){
      return;
    }

    if(!editPageTitle.trim()){
      alert("Page title is required.")
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/pages/${selectedPage.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: editPageTitle.trim(),
        content: editPageContent || null
      })
    });

    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.detail || "Could not update page.");
      return;
    }

    const updatedPage = await response.json();

    setSelectedPage(updatedPage);
    setPages(
      pages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
    );

    setIsEditingPage(false);
  }

  function renderPageContent(content){
    if(!content){
      return "No content yet.";
    }

    const parts = content.split(/(\[[^\]]+\])/g);

    return parts.map((part, index) => {
      const isPageLink = part.startsWith("[") && part.endsWith("]");

      if(!isPageLink){
        return <span key={index}>{part}</span>;
      }

      const linkTitle = part.slice(1, -1);
      const linkedPage = pages.find(
        (page) => page.title.toLowerCase() === linkTitle.toLowerCase()
      );

      if(!linkedPage){
        return(
          <span key={index} className="missing-page-link">
            {linkTitle}
          </span>
        );
      }

      return (
        <button
          key={index}
          type="button"
          className="content-page-link"
          onClick={() => handlePageClick(linkedPage)}
        >
          {linkTitle}
        </button>
      );
    });
  }

  
  async function handleDeletePage(page){
    const confirmed = window.confirm(
      `Are you sure you want to delete "${page.title || "Untitled page"}"?`
    );

    if(!confirmed){
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/pages/${page.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.detail || "Could not delete page.");
      return;
    }

    setPages(pages.filter((item) => item.id !== page.id));

    if(selectedPage?.id === page.id){
      setSelectedPage(null);
      setPageLinks([]);
      setPageBacklinks([]);
      setIsEditingPage(false);
      setEditPageTitle("");
      setEditPageContent("");
    }

  }
  
  function handleStartEditProject(){
    if(!selectedProject){
      return;
    }

    setEditProjectTitle(selectedProject.title);
    setEditProjectDescription(selectedProject.description || "");
    setIsEditingProject(true);
  }

  function handleCancelEditProject(){
    if(!selectedProject){
      return;
    }

    setEditProjectTitle(selectedProject.title);
    setEditProjectDescription(selectedProject.description || "");
    setIsEditingProject(false);
  }

  async function handleSaveProject(event){
    event.preventDefault();

    if(!selectedProject){
      return;
    }

    if(!editProjectTitle.trim()){
      alert("Project title is required.")
      return;
    }

    const response = await fetch(
      `http://127.0.0.1:8000/projects/${selectedProject.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editProjectTitle,
          description: editProjectDescription,
        })
      }
    );

    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.detail || "Could not update project.");
      return;
    }

    const updatedProject = await response.json();

    setSelectedProject(updatedProject);

    setProjects(projects.map((project) => project.id === updatedProject.id ? updatedProject : project));

    setIsEditingProject(false);
  }

  async function handleRegister(event){
    event.preventDefault();

    if(!registerEmail.trim()){
      alert("Email is required.");
      return;
    }

    if(!registerUsername.trim()){
      alert("Username is required.");
      return;
    }

    if(!registerPassword.trim()){
      alert("Password is required.")
      return;
    }

    const response = await fetch("http://127.0.0.1:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        username: registerUsername,
        password: registerPassword
      })
    });
    
    if(!response.ok){
      const errorData = await response.json();
      alert(errorData.detail || "Could not register.");
      return;
    }

    alert("Account created. You can now log in.");

    setEmail(registerEmail);
    setPassword("");
    setRegisterEmail("");
    setRegisterUsername("");
    setRegisterPassword("");
    setAuthMode("login");
  }

  if(isAuthLoading){
    return(
      <div className="auth-page">
        <section className="auth-card">
          <h2>Loading your archive...</h2>
          <p>Checking your saved session.</p>
        </section>
      </div>
    );
  }

  /*
    Find all pages whose parent_id is null
    For each one, find its children
    For each child, find its children
    Repeat until there are no more children 
  */
  function buildPageTree(pageList, parentId = null){
    return pageList
      .filter((page) => page.parent_id === parentId)
      .map((page) => ({
        ...page,
        children: buildPageTree(pageList, page.id)
      }));
  }

  function renderPageTree(pageNodes, depth = 0){
    return(
      <ul className={depth === 0 ? "page-tree" : "page-tree-children"}>
        {pageNodes.map((page) => (
          <li key={page.id} className="page-tree-item">
            <div
              className="page-tree-row"
              style={{ paddingLeft: `${depth * 16}px`}}
            >
              <button
                type="button"
                className={
                  selectedPage?.id === page.id
                  ? "page-tree-button active"
                  : "page-tree-button"
                }
                onClick={() => handlePageClick(page)}
              >
                {page.children.length > 0 ? "▾ " : ""}
                {page.title}
              </button>

              <button
                type="button"
                className="danger-button"
                onClick={() => handleDeletePage(page)}
              >
                Delete
              </button>
            </div>

            {page.children.length > 0 && renderPageTree(page.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="app">
      <header className="top-bar">
        <h1>Worldbuilding Wiki</h1>

        {user ? (
          <div className="user-area">
            <span>{user.username}</span>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : (
          <span>Not logged in</span>
        )}
      </header>

      {!token ? (
        <main className="auth-page">
          <section className="auth-card">
            {authMode === "login" ? (
              <>
                <h2>Login</h2>

                <form
                  onSubmit={async(event) => {
                    event.preventDefault();

                  const formData = new URLSearchParams();
                  formData.append("username", email);
                  formData.append("password", password);

                  const response = await fetch("http://127.0.0.1:8000/auth/login", {
                    method: "POST",
                    headers: {
                      "Content-type": "application/x-www-form-urlencoded"
                    },
                    body: formData
                  });

                  if(!response.ok){
                    const errorData = await response.json();
                    alert(errorData.detail || "Could not log in.");
                    return;
                  }

                  const data = await response.json();

                  localStorage.setItem("worldbuilding_wiki_token", data.access_token);

                  await loadUserAndProjects(data.access_token);

                  setToken(data.access_token);
                }}
              >
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <button type="submit">Log in</button>
            </form>

            <p className="auth-switch">
              No account yet?{" "}
              <button type="button" onClick={() => setAuthMode("register")}>
                Create one
              </button>
            </p>
          </>
        ) : (
          <>
            <h2>Create account</h2>

            <form onSubmit={handleRegister}>
              <div className="form-field">
                <label>Username</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(event) => setRegisterUsername(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(event) => setRegisterPassword(event.target.value)}
                  required
                />
              </div>

              <button type="submit">Create account</button>
          </form>
          
          <p className="auth-switch">
            Already have an account?{" "}
            <button type="button" onClick={() => setAuthMode("login")}>
              Log in
            </button>
          </p>
        </>
        )}
      </section>
        </main>
      ) : (
        <div className="app-layout">
          <aside className="sidebar">
            <h2>Projects</h2>

            <form className="create-form" onSubmit={handleCreateProject}>
              <input
                type="text"
                placeholder="Project title"
                value={newProjectTitle}
                onChange={(event) => setNewProjectTitle(event.target.value)} 
              />
              <input
                type="text"
                placeholder="Description"
                value={newProjectDescription}
                onChange={(event) => setNewProjectDescription(event.target.value)}
              />

              <button type="submit">Create project</button>
            </form>

            {projects.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project.id} className="project-list-item">
                    <button type="button" onClick={() => handleProjectClick(project)}>
                      {project.title || "Untitled project"}
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDeleteProject(project)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}

            {selectedProject && (
              <>
                <section className="selected-project-panel">
                  {isEditingProject ? (
                    <form onSubmit={handleSaveProject} className="create-form">
                      <input
                        type="text"
                        value={editProjectTitle}
                        onChange={(event) => setEditProjectTitle(event.target.value)}
                      />

                      <textarea
                        value={editProjectDescription}
                        onChange={(event) => setEditProjectDescription(event.target.value)}
                        rows="3"
                      />

                      <div className="form-actions">
                        <button type="submit">Save project</button>
                        <button type="button" onClick={handleCancelEditProject}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="eyebrow">Selected project</p>
                      <h3>{selectedProject.title}</h3>

                      {selectedProject.description && (
                        <p>{selectedProject.description}</p>
                      )}

                      <button type="button" onClick={handleStartEditProject}>
                        Edit project
                      </button>
                    </>
                  )}
                </section>    

                <h2>Pages</h2>

                <form className="create-form" onSubmit={handleCreatePage}>
                  <input
                    type="text"
                    placeholder="Page title"
                    value={newPageTitle}
                    onChange={(event) => setNewPageTitle(event.target.value)}
                  />

                  <select
                    value={newPageParentId}
                    onChange={(event) => setNewPageParentId(event.target.value)}
                  >
                    <option value="">No parent / top-level page</option>

                    {pages.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.title}
                      </option>
                    ))}
                  </select>

                  <textarea 
                    placeholder="Page content"
                    value={newPageContent}
                    onChange={(event) => setNewPageContent(event.target.value)}
                  />

                  <button type="submit">Create page</button>
                </form>

                {pages.length > 0 ? (
                  renderPageTree(buildPageTree(pages))
                ) : (
                  <p>No pages found.</p>
                )}
              </>
            )}
          </aside>

          <main className="content">
            {selectedPage ? (
              isEditingPage ? (
                <article>
                  <form className="edit-page-form" onSubmit={handleSavePage}>
                    <div className="form-field">
                      <label>Title</label>
                      <input 
                        type="text"
                        value={editPageTitle}
                        onChange={(event) => setEditPageTitle(event.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-field">
                      <label>Content</label>
                      <textarea
                        value={editPageContent}
                        onChange={(event) => setEditPageContent(event.target.value)}
                      />  
                    </div>

                    <div className="form-actions">
                      <button type="submit">Save page</button>
                      <button type="button" onClick={handleCancelEditPage}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </article>
              ) : (
                <article>
                  <p className="eyebrow">{selectedProject?.title}</p>
                  <h2>{selectedPage.title}</h2>
                  <p className="slug">/{selectedPage.slug}</p>

                  <button type="button" onClick={handleStartEditPage}>
                    Edit page
                  </button>

                  <div className="page-content">
                    {renderPageContent(selectedPage.content)}
                  </div>
                </article>
              )
            ) : (
              <section className="empty-state">
                <h2>Select a page</h2>
                <p>Choose a project and page from the sidebar.</p>
              </section>
            )}
          </main>

          <aside className="details-panel">
            <h2>Page details</h2>

            {selectedPage ? (
              <>
                <section>
                  <h3>Linked pages</h3>

                  {pageLinks.length > 0 ? (
                    <ul>
                      {pageLinks.map((link) => (
                        <li key={link.id}>
                          {link.target_page_title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No linked pages.</p>
                  )}
                </section>

                <section>
                  <h3>Referenced by</h3>

                  {pageBacklinks.length > 0 ? (
                    <ul>
                      {pageBacklinks.map((link) => (
                        <li key={link.id}>
                          {link.source_page_title}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No backlinks.</p>
                  )}
                </section>

                <section>
                  <h3>Stats</h3>
                  <p>Page ID: {selectedPage.id}</p>
                  <p>Parent ID: {selectedPage.parent_id || "Top-level page"}</p>
                </section>
              </>
            ) : (
              <p>Select a page to see details.</p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;