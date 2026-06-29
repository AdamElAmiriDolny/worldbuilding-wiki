function PageViewer({
  selectedProject,
  selectedPage,
  onStartEditPage,
  renderPageContent
}) {
  return (
    <article>
      <h2>{selectedPage.title}</h2>

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