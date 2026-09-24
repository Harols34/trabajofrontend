
document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('news-grid');
  const filterRow = document.getElementById('category-filters');
  const searchInput = document.getElementById('search-news');
  const countNode = document.getElementById('result-count');
  if(!grid || !window.PoliTechApp) return;
  const list = await window.PoliTechApp.loadNews();
  const params = new URLSearchParams(location.search);
  const preselected = params.get('categoria') || 'Todas';
  const categories = ['Todas', ...new Set(list.map(item => item.category))];
  let currentCategory = categories.includes(preselected) ? preselected : 'Todas';
  let currentSearch = '';

  function safeText(text=''){ return String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function renderFilters(){
    filterRow.innerHTML = categories.map(category => `
      <button type="button" class="chip ${category === currentCategory ? 'active' : ''}" data-category="${safeText(category)}">${safeText(category)}</button>`).join('');
    filterRow.querySelectorAll('[data-category]').forEach(btn => btn.addEventListener('click', () => {
      currentCategory = btn.dataset.category;
      render();
    }));
  }
  function renderCard(news){
    const favorites = window.PoliTechApp.getFavorites();
    const active = favorites.includes(news.id);
    const date = new Date(news.date + 'T12:00:00').toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'});
    return `
      <article class="news-card">
        <a class="news-media" href="detalle.html?id=${encodeURIComponent(news.id)}"><img src="${safeText(news.image)}" alt="Imagen de apoyo para ${safeText(news.title)}"></a>
        <span class="badge">${safeText(news.category)}</span>
        <h3>${safeText(news.title)}</h3>
        <p>${safeText(news.summary)}</p>
        <div class="meta">${date}</div>
        <div class="card-actions">
          <a class="inline-link" href="detalle.html?id=${encodeURIComponent(news.id)}">Ver más →</a>
          <button type="button" class="icon-button ${active ? 'active' : ''}" data-favorite-toggle="${safeText(news.id)}">${active ? '♥' : '♡'}</button>
        </div>
      </article>`;
  }
  function bindFavoriteButtons(){
    grid.querySelectorAll('[data-favorite-toggle]').forEach(btn => btn.addEventListener('click', () => {
      window.PoliTechApp.toggleFavorite(btn.dataset.favoriteToggle);
      render();
    }));
  }
  function render(){
    renderFilters();
    const filtered = list.filter(item => {
      const matchesCategory = currentCategory === 'Todas' || item.category === currentCategory;
      const haystack = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
      const matchesSearch = haystack.includes(currentSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    countNode.textContent = `${filtered.length} resultado(s)`;
    grid.innerHTML = filtered.length ? filtered.map(renderCard).join('') : '<div class="empty-state">No se encontraron noticias con esos criterios.</div>';
    bindFavoriteButtons();
  }
  searchInput?.addEventListener('input', () => { currentSearch = searchInput.value.trim(); render(); });
  render();
});
