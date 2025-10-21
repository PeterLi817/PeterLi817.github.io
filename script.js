// Global helper to open external links in a new tab
function openLink(url) {
  if (!url) return;
  window.open(url, '_blank');
}

// projName toggle: collapse/expand the file list
(function(){
  // Wait until DOM is ready
  function init() {
    const projName = document.querySelector('.sidebar .projName');
    const sidebar = document.querySelector('.sidebar');
    const fileList = document.querySelector('.sidebar .file-list');

    if (!projName || !sidebar || !fileList) return;

    function setCollapsed(collapsed) {
      sidebar.setAttribute('data-collapsed', String(collapsed));
      projName.setAttribute('aria-expanded', String(!collapsed));
    }

    projName.addEventListener('click', () => {
      const collapsed = sidebar.getAttribute('data-collapsed') === 'true';
      setCollapsed(!collapsed);
    });

    projName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        projName.click();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
