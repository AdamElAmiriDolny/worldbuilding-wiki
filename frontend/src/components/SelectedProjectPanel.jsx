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
          <p className="eyebrow">Selected project</p>
          <h3>{selectedProject.title}</h3>

          {selectedProject.description && <p>{selectedProject.description}</p>}

          <button type="button" onClick={onStartEditProject}>
            Edit project
          </button>
        </>
      )}
    </section>
  );
}

export default SelectedProjectPanel;