function CreateProjectModal({
  newProjectTitle,
  newProjectDescription,
  setNewProjectTitle,
  setNewProjectDescription,
  onCreateProject,
  onCancel,
}) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-modal create-project-modal">
        <div className="confirm-modal-ornament">✦</div>

        <p className="eyebrow">New project</p>
        <h2>Create a project</h2>

        <form onSubmit={onCreateProject} className="create-form modal-form">
          <input 
            type="text"
            placeholder="Project title"
            value={newProjectTitle}
            onChange={(event) => setNewProjectTitle(event.target.value)}
          />

          <textarea
            placeholder="Description"
            value={newProjectDescription}
            onChange={(event) => setNewProjectDescription(event.target.value)}
            rows="3"  
          />

          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>

            <button type="submit">Create project</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateProjectModal;