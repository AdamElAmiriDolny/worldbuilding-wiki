function SelectedProjectPanel({
  selectedProject,
  isEditingProject,
  editProjectTitle,
  editProjectDescription,
  setEditProjectTitle,
  setEditProjectDescription,
  onStartEditProject,
  onCancelEditProject,
  onSaveProject,
}) {
  return (
    <section className="selected-project-panel">
      {isEditingProject ? (
        <form onSubmit={onSaveProject} className="create-form">
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
            <button type="button" onClick={onCancelEditProject}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="project-context-header">
            <div>
              <p className="eyebrow">Selected project</p>
              <h3>{selectedProject.title}</h3>
            </div>

            <button
              type="button"
              className="subtle-button"
              onClick={onStartEditProject}
            >
              Edit
            </button>
          </div>

          {selectedProject.description && (
            <p className="project-context-description">
              {selectedProject.description}
            </p>
          )}
        </>
      )}
    </section>
  );
}

export default SelectedProjectPanel;