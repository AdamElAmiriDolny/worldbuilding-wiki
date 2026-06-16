function DetailsPanel({selectedPage, pageLinks, pageBacklinks}){
  return (
    <aside className="details-panel">
      <h2>Page details</h2>

      {selectedPage ? (
        <>
          <section>
            <h3>Linked pages</h3>

            {pageLinks.length > 0 ? (
              <ul>
                {pageLinks.map((link) => (
                  <li key={link.id}>{link.target_page_title}</li>
                ))}
              </ul>
            ) : (
              <p>No linked pages.</p>
            )}
          </section>

          <section>
            <h3>Referenced by</h3>

            {pageBacklinks.length > 0 ? (
              <ul>
                {pageBacklinks.map((link) => (
                  <li key={link.id}>{link.source_page_title}</li>
                ))}
              </ul>
            ) : (
              <p>No backlinks.</p>
            )}
          </section>

          <section>
            <h3>Stats</h3>
            <p>Page ID: {selectedPage.id}</p>
            <p>Parent ID: {selectedPage.parent_id || "Top-level page"}</p>
          </section>
        </>
      ) : (
        <p>Select a page to see details.</p>
      )}
    </aside>
  );
}

export default DetailsPanel;