function CreateProjectForm({
  newProjectTitle,
  newProjectDescription,
  setNewProjectTitle,
  setNewProjectDescription,
  onCreateProject,
}) {
  return (
    <form className="create-form" onSubmit={onCreateProject}>
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
  );
}

export default CreateProjectForm;