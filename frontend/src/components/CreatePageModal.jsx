function CreatePageModal({
  pages,
  newPageTitle,
  newPageParentId,
  setNewPageTitle,
  setNewPageParentId,
  onCreatePage,
  onCancel,
}) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-modal create-page-modal">
        <div className="confirm-modal-ornament">✦</div>

        <p className="eyebrow">New page</p>
        <h2>Create a page</h2>

        <form onSubmit={onCreatePage} className="create-form modal-form">
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

          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>

            <button type="submit">Create page</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreatePageModal;