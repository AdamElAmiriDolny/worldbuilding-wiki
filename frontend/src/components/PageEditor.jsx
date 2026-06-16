function PageEditor({
	editPageTitle,
	editPageContent,
	setEditPageTitle,
	setEditPageContent,
	onSavePage,
	onCancelEditPage,
}) {
	return (
		<article>
			<form className="edit-page-form" onSubmit={onSavePage}>
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
					<button type="button" onClick={onCancelEditPage}>
						Cancel
					</button>
				</div>
			</form>
		</article>
	);
}

export default PageEditor;