function ProjectList({ projects, onProjectClick, onDeleteProject }) {
  if (projects.length === 0) {
    return <p className="sidebar-empty-message">No projects found.</p>;
  }

  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-list-item">
          <button 
            type="button"
            className="project-list-button" 
            onClick={() => onProjectClick(project)}
          >
            <span className="project-list-card-title">
              {project.title || "Untitled project"}
            </span>

            {project.description && (
              <span className="project-list-card-description">
                {project.description}
              </span>
            )}
          </button>

          <button
            type="button"
            className="project-list-delete-button"
            onClick={() => onDeleteProject(project)}
            aria-label={`Delete ${project.title} || "Untitled project"}`}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProjectList;