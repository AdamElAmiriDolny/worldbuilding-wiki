function buildPageTree(pageList, parentId = null) {
  return pageList
    .filter((page) => page.parent_id === parentId)
    .map((page) => ({
      ...page,
      children: buildPageTree(pageList, page.id)
    }));
}

function PageTree({
  pages,
  selectedPage,
  expandedPageIds,
  onPageClick,
  onDeletePage,
  onToggleExpanded
}) {
  function renderPageTree(pageNodes, depth = 0) {
    return (
      <ul className={depth === 0 ? "page-tree" : "page-tree-children"}>
        {pageNodes.map((page) => {
          const hasChildren = page.children.length > 0;
          const isExpanded = expandedPageIds.includes(page.id);

          return (
            <li key={page.id} className="page-tree-item">
              <div className="page-tree-row">
                {hasChildren ? (
                  <button
                    type="button"
                    className="page-tree-toggle"
                    onClick={() => onToggleExpanded(page.id)}
                    aria-label={isExpanded ? "Collapse page" : "Expand page"}
                  >
                    {isExpanded ? "▾" : "▸"}
                  </button>
                ) : (
                  <span className="page-tree-toggle-placeholder" />
                )}

                <button
                  type="button"
                  className={
                    selectedPage?.id === page.id
                      ? "page-tree-button active"
                      : "page-tree-button"
                  }
                  onClick={() => onPageClick(page)}
                >
                  {page.title}
                </button>

                <button
                  type="button"
                  className="page-tree-delete-button"
                  onClick={() => onDeletePage(page)}
                  aria-label={`Delete ${page.title}`}
                >
                  ×
                </button>
              </div>

              {hasChildren && isExpanded && renderPageTree(page.children, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  }

  const pageTree = buildPageTree(pages);

  return renderPageTree(pageTree);
}

export default PageTree;