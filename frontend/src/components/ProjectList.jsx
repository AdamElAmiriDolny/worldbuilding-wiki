function ProjectList({ projects, onProjectClick, onDeleteProject }) {
  if (projects.length === 0) {
    return <p>No projects found.</p>
  }

  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id} className="project-list-item">
          <button type="button" onClick={() => onProjectClick(project)}>
            {project.title || "Untitled project"}
          </button>

          <button
            type="button"
            className="danger-button"
            onClick={() => onDeleteProject(project)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

export default ProjectList;