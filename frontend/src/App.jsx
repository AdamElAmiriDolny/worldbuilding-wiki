import { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState([null]);

  async function handleProjectClick(project){
    setSelectedProject(project);

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

  async function handlePageClick(page){
    const response = await fetch(`http://127.0.0.1:8000/pages/${page.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    setSelectedPage(data);
  }

  function handleLogout(){
    setEmail("");
    setPassword("");
    setToken("");
    setUser(null);
    setProjects([]);
    setSelectedProject(null);
    setPages([]);
    setSelectedPage(null);
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

                const data = await response.json();

                setToken(data.access_token);

                const meResponse = await fetch("http://127.0.0.1:8000/auth/me", {
                  headers: {
                    Authorization: `Bearer ${data.access_token}`
                  }
                });

                const meData = await meResponse.json();

                setUser(meData);

                const projectsResponse = await fetch("http://127.0.0.1:8000/projects/", {
                  headers: {
                    Authorization: `Bearer ${data.access_token}`
                  }
                });

                const projectsData = await projectsResponse.json();

                setProjects(projectsData);
              }}
            >
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button type="submit">Log in</button>
            </form>
          </section>
        </main>
      ) : (
        <div className="app-layout">
          <aside className="sidebar">
            <h2>Projects</h2>

            {projects.length > 0 ? (
              <ul>
                {projects.map((project) => (
                  <li key={project.id}>
                    <button type="button" onClick={() => handleProjectClick(project)}>
                      {project.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No projects found.</p>
            )}

            {selectedProject && (
              <>
                <h2>Pages</h2>

                {pages.length > 0 ? (
                  <ul>
                    {pages.map((page) => (
                      <li key={page.id}>
                        <button type="button" onClick={() => handlePageClick(page)}>
                          {page.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No pages found.</p>
                )}
              </>
            )}
          </aside>

          <main className="content">
            {selectedPage ? (
              <article>
                <p className="eyebrow">{selectedProject?.title}</p>
                <h2>{selectedPage.title}</h2>
                <p className="slug">/{selectedPage.slug}</p>

                <div className="page-content">
                  {selectedPage.content || "No content yet."}
                </div>
              </article>
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
                  <p>Coming soon.</p>
                </section>

                <section>
                  <h3>Referenced by</h3>
                  <p>Coming soon.</p>
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