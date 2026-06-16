function CreatePageForm({
  pages,
  newPageTitle,
  newPageContent,
  newPageParentId,
  setNewPageTitle,
  setNewPageContent,
  setNewPageParentId,
  onCreatePage,
}) {
  return (
    <form className="create-form" onSubmit={onCreatePage}>
      <input
        type="text"
        placeholder="New title"
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
  );
}

export default CreatePageForm;