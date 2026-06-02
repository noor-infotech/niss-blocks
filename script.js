let allBlocks = [];
let activeCategory = 'All';
let searchQuery = '';
let activeTab = 'html';
let currentBlock = null;
let fetchedCode = { html: '', react: '', prompt: '' };

// Favorites stored by uid
let favorites = JSON.parse(localStorage.getItem('niss_favorites') || '[]');

async function init() {
  const res = await fetch('data/blocks.json');
  allBlocks = await res.json();
  renderCategories();
  renderBlocks();
}

// ─── Categories ────────────────────────────────────────────────
function renderCategories() {
  const categories = ['All', ...new Set(allBlocks.map(b => b.category))];
  const container = document.getElementById('categories');
  container.innerHTML = categories.map(cat => `
    <button
      class="${cat === activeCategory ? 'active' : ''}"
      onclick="filterCategory('${cat}')"
    >${cat}</button>
  `).join('');
}

function filterCategory(cat) {
  activeCategory = cat;
  renderCategories();
  renderBlocks();
}

// ─── Search ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('input[type="text"]').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderBlocks();
  });
  init();
});

// ─── Render Blocks Grid ────────────────────────────────────────
function renderBlocks() {
  const grid = document.getElementById('blocks-grid');
  const filtered = allBlocks.filter(b => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-results">No blocks found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(b => `
    <div class="block-card" data-uid="${b.uid}">
      <div class="block-preview">
        <img
          src="${b.preview}"
          alt="${b.title}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        />
        <div class="preview-placeholder" style="display:none">
          <span>${b.title}</span>
        </div>
      </div>
      <div class="block-info">
        <div class="block-meta">
          <span class="block-uid">#${b.uid}</span>
          <span class="block-category">${b.category}</span>
        </div>
        <h3 class="block-title">${b.title}</h3>
        <div class="block-actions">
          <button onclick="openModal(${b.uid})" class="btn-preview">View Code</button>
          <button
            onclick="toggleFavorite(event, ${b.uid})"
            class="btn-fav ${favorites.includes(b.uid) ? 'faved' : ''}"
            title="Save to favorites"
          >${favorites.includes(b.uid) ? '★' : '☆'}</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── Favorites ─────────────────────────────────────────────────
function toggleFavorite(e, uid) {
  e.stopPropagation();
  if (favorites.includes(uid)) {
    favorites = favorites.filter(f => f !== uid);
  } else {
    favorites.push(uid);
  }
  localStorage.setItem('niss_favorites', JSON.stringify(favorites));
  renderBlocks();
}

// ─── Modal ─────────────────────────────────────────────────────
async function openModal(uid) {
  currentBlock = allBlocks.find(b => b.uid === uid);
  if (!currentBlock) return;

  document.getElementById('modal-title').textContent = currentBlock.title;
  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Reset
  fetchedCode = { html: '', react: '', prompt: '' };
  activeTab = 'html';
  setActiveTab('html');
  await loadCode('html');
}

async function loadCode(tab) {
  const pathMap = {
    html: currentBlock.html,
    react: currentBlock.react,
    prompt: currentBlock.prompt,
  };

  // Use cache if already fetched
  if (fetchedCode[tab]) {
    document.getElementById('code-viewer').textContent = fetchedCode[tab];
    return;
  }

  document.getElementById('code-viewer').textContent = 'Loading...';
  try {
    const res = await fetch(pathMap[tab]);
    const text = await res.text();
    fetchedCode[tab] = text;
    document.getElementById('code-viewer').textContent = text;
  } catch {
    document.getElementById('code-viewer').textContent = 'Failed to load file.';
  }
}

function setActiveTab(tab) {
  activeTab = tab;
  ['html', 'react', 'prompt'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
  });
  loadCode(tab);
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
  currentBlock = null;
  fetchedCode = { html: '', react: '', prompt: '' };
}

function copyCode() {
  const code = document.getElementById('code-viewer').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

// ─── Event Listeners ───────────────────────────────────────────
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('copy-btn').addEventListener('click', copyCode);
document.getElementById('tab-html').addEventListener('click', () => setActiveTab('html'));
document.getElementById('tab-react').addEventListener('click', () => setActiveTab('react'));
document.getElementById('tab-prompt').addEventListener('click', () => setActiveTab('prompt'));

// Close modal on backdrop click
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});
