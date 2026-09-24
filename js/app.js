
const DATA_PATH = 'data/noticias.json';
const STORAGE_FAVORITES = 'politech_favorites';
const STORAGE_ADMIN = 'politech_admin_news';
let baseNews = [];
let allNews = [];

function $(selector, parent = document) { return parent.querySelector(selector); }
function $$(selector, parent = document) { return Array.from(parent.querySelectorAll(selector)); }
function safeText(text=''){ return String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function formatDate(iso) {
  try { return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', {day:'numeric', month:'long', year:'numeric'}); }
  catch { return iso; }
}
function slugify(value='') { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function getFavorites(){ try { return JSON.parse(localStorage.getItem(STORAGE_FAVORITES)) || []; } catch { return []; } }
function setFavorites(ids){ localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(ids)); }
function toggleFavorite(id){
  const current = getFavorites();
  const updated = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
  setFavorites(updated);
  document.dispatchEvent(new CustomEvent('favorites:changed', {detail: updated}));
  return updated;
}
function getAdminNews(){ try { return JSON.parse(localStorage.getItem(STORAGE_ADMIN)) || []; } catch { return []; } }
function setAdminNews(list){ localStorage.setItem(STORAGE_ADMIN, JSON.stringify(list)); }
function refreshNewsCollection(){ allNews = [...getAdminNews(), ...baseNews]; }
async function loadNews(){
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) throw new Error('No se pudo cargar el JSON');
    baseNews = await response.json();
  } catch (error) {
    baseNews = window.POLITECH_FALLBACK_NEWS || [];
  }
  refreshNewsCollection();
  return allNews;
}
function getNewsById(id){ return allNews.find(item => item.id === id); }
function makeNewsCard(news, compact = false){
  const favorites = getFavorites();
  const active = favorites.includes(news.id);
  return `
  <article class="news-card">
    <a class="news-media" href="detalle.html?id=${encodeURIComponent(news.id)}">
      <img src="${safeText(news.image)}" alt="Imagen de apoyo para ${safeText(news.title)}" loading="lazy">
    </a>
    <span class="badge">${safeText(news.category)}</span>
    <h3>${safeText(news.title)}</h3>
    <p>${safeText(news.summary)}</p>
    <div class="meta">${formatDate(news.date)} · ${safeText(news.readingTime || '')}</div>
    <div class="card-actions">
      <a class="inline-link" href="detalle.html?id=${encodeURIComponent(news.id)}">Ver más →</a>
      <button class="icon-button ${active ? 'active' : ''}" data-favorite-toggle="${safeText(news.id)}" aria-label="${active ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${active ? '♥' : '♡'}</button>
    </div>
  </article>`;
}
function updateFavoriteButtons(){
  const favorites = getFavorites();
  $$('[data-favorite-toggle]').forEach(btn => {
    const active = favorites.includes(btn.dataset.favoriteToggle);
    btn.classList.toggle('active', active);
    btn.textContent = active ? '♥' : '♡';
    btn.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Agregar a favoritos');
  });
}
function bindFavoriteButtons(scope = document){
  $$('[data-favorite-toggle]', scope).forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorite(btn.dataset.favoriteToggle);
      updateFavoriteButtons();
      renderFavoritesPage();
    });
  });
}
function setActiveNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
}
function initMenu(){
  const button = $('#menu-button');
  const links = $('#nav-links');
  if(button && links){ button.addEventListener('click', () => links.classList.toggle('open')); }
}
function renderHome(){
  const container = $('#featured-news');
  if(!container) return;
  const featured = allNews.filter(item => item.featured).slice(0,3);
  container.innerHTML = featured.map(item => makeNewsCard(item)).join('');
  bindFavoriteButtons(container);
}
function renderCategories(){
  const grid = $('#category-grid');
  if(!grid) return;
  const grouped = [...new Set(allNews.map(item => item.category))].map(category => ({
    category,
    items: allNews.filter(item => item.category === category)
  }));
  grid.innerHTML = grouped.map(group => `
    <article class="category-card">
      <h3>${safeText(group.category)}</h3>
      <p>Explora contenidos relacionados con ${safeText(group.category.toLowerCase())} dentro del prototipo.</p>
      <div class="count">${group.items.length} noticia(s)</div>
      <div style="margin-top:14px"><a class="inline-link" href="noticias.html?categoria=${encodeURIComponent(group.category)}">Ver noticias →</a></div>
    </article>
  `).join('');
}
function renderDetail(){
  const target = $('#article-detail');
  if(!target) return;
  const params = new URLSearchParams(location.search);
  const requestedId = params.get('id') || allNews[0]?.id;
  const news = getNewsById(requestedId) || allNews[0];
  if(!news){ target.innerHTML = '<div class="empty-state">No hay noticias disponibles.</div>'; return; }
  const relatedLinks = (news.related || []).map(id => getNewsById(id)).filter(Boolean).slice(0,3);
  const active = getFavorites().includes(news.id);
  target.innerHTML = `
    <div class="breadcrumb">Inicio / ${safeText(news.category)} / Detalle</div>
    <section class="article-head">
      <span class="badge">${safeText(news.category)}</span>
      <h1>${safeText(news.title)}</h1>
      <div class="article-meta">${formatDate(news.date)} · ${safeText(news.readingTime)} · ${safeText(news.author)}</div>
      <div class="article-hero"><img src="${safeText(news.image)}" alt="Imagen principal de ${safeText(news.title)}"></div>
    </section>
    <section class="article-layout">
      <article class="article-card">
        ${news.content.map(paragraph => `<p>${safeText(paragraph)}</p>`).join('')}
        <div class="quote-box">“La tecnología debe simplificar la experiencia, no volverla más compleja.”</div>
      </article>
      <aside class="aside-card">
        <h3>Acciones</h3>
        <button class="button" type="button" data-favorite-toggle="${safeText(news.id)}">${active ? '♥ Ya en favoritos' : '♡ Agregar a favoritos'}</button>
        <a class="button-secondary" href="contacto.html">Contactar al equipo</a>
        <div class="related-links">
          <strong>También te puede interesar</strong>
          ${relatedLinks.map(item => `<a href="detalle.html?id=${encodeURIComponent(item.id)}">• ${safeText(item.title)}</a>`).join('') || '<span>• No hay noticias relacionadas.</span>'}
        </div>
      </aside>
    </section>`;
  bindFavoriteButtons(target);
}
function renderFavoritesPage(){
  const grid = $('#favorites-grid');
  const count = $('#favorites-count');
  if(!grid) return;
  const favorites = getFavorites();
  const items = allNews.filter(item => favorites.includes(item.id));
  if(count) count.textContent = `${items.length} noticia(s) guardada(s)`;
  grid.innerHTML = items.length ? items.map(item => makeNewsCard(item)).join('') : '<div class="empty-state">Aún no has agregado noticias a favoritos.</div>';
  bindFavoriteButtons(grid);
}
function initContactForm(){
  const form = $('#contact-form');
  if(!form) return;
  const success = $('#contact-success');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [
      { id:'nombre', test:value => value.trim().length >= 4, message:'Ingresa un nombre válido.' },
      { id:'correo', test:value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message:'Ingresa un correo válido.' },
      { id:'asunto', test:value => value.trim().length >= 4, message:'Escribe un asunto.' },
      { id:'mensaje', test:value => value.trim().length >= 10, message:'El mensaje debe tener al menos 10 caracteres.' }
    ];
    let valid = true;
    fields.forEach(field => {
      const input = $('#' + field.id);
      const error = $('#' + field.id + '-error');
      const ok = field.test(input.value);
      if(error) error.textContent = ok ? '' : field.message;
      if(!ok) valid = false;
    });
    if(!valid){ if(success) success.style.display = 'none'; return; }
    if(success){ success.style.display = 'block'; success.textContent = 'Mensaje enviado correctamente. Gracias por contactarte con PoliTech Digital.'; }
    form.reset();
  });
}
function initAdmin(){
  const form = $('#admin-form');
  const list = $('#admin-list');
  const message = $('#admin-message');
  if(!form || !list) return;
  function renderList(){
    const adminNews = getAdminNews();
    list.innerHTML = adminNews.length ? adminNews.map(item => `
      <article class="admin-item">
        <div>
          <h4>${safeText(item.title)}</h4>
          <p>${safeText(item.category)} · ${safeText(item.summary)}</p>
        </div>
        <button type="button" data-delete-news="${safeText(item.id)}">Eliminar</button>
      </article>`).join('') : '<div class="empty-state">No has creado noticias nuevas todavía.</div>';
    $$('[data-delete-news]', list).forEach(btn => btn.addEventListener('click', () => {
      const filtered = getAdminNews().filter(item => item.id !== btn.dataset.deleteNews);
      setAdminNews(filtered); refreshNewsCollection(); renderList();
    }));
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = $('#admin-titulo').value.trim();
    const category = $('#admin-categoria').value.trim();
    const summary = $('#admin-resumen').value.trim();
    const content = $('#admin-contenido').value.trim();
    const custom = {
      id: `custom-${Date.now()}`,
      category,
      title,
      summary,
      content: [content],
      author: 'Edición local',
      date: new Date().toISOString().slice(0,10),
      readingTime: '3 min de lectura',
      featured: false,
      image: 'assets/images/administrar.png',
      related: []
    };
    const updated = [custom, ...getAdminNews()];
    setAdminNews(updated);
    refreshNewsCollection();
    form.reset();
    if(message) message.textContent = 'Noticia creada correctamente en localStorage.';
    renderList();
  });
  renderList();
}
function setYear(){ $$('#year').forEach(node => node.textContent = new Date().getFullYear()); }

document.addEventListener('DOMContentLoaded', async () => {
  setYear();
  initMenu();
  setActiveNav();
  await loadNews();
  renderHome();
  renderCategories();
  renderDetail();
  renderFavoritesPage();
  initContactForm();
  initAdmin();
  updateFavoriteButtons();
});

document.addEventListener('favorites:changed', updateFavoriteButtons);
window.PoliTechApp = { loadNews, getNewsById, toggleFavorite, getFavorites };
