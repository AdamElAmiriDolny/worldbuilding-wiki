function PageViewer({
  selectedProject,
  selectedPage,
  onStartEditPage,
  renderPageContent
}) {
  return (
    <article>
      <p className="eyebrow">{selectedProject?.title}</p>
      <h2>{selectedPage.title}</h2>
      <p className="slug">/{selectedPage.slug}</p>

      <button type="button" onClick={onStartEditPage}>
        Edit page
      </button>

      <div className="page-content">
        {renderPageContent(selectedPage.content)}
      </div>
    </article>
  );
}

export default PageViewer;