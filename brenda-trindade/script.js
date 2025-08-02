let allVideos = [];
let lastFilteredVideos = null;
let lastSearchValue = '';
let lastOrderValue = 'newest';
let currentPage = 1;
const VIDEOS_PER_PAGE = 12;

const inputSearch = document.querySelector('.search-bar');
const selectOrder = document.querySelector('.order-select');
const btnInicio = document.getElementById('btnInicio');
const channelCountsDiv = document.getElementById('channelCounts');
const paginationDiv = document.getElementById('paginationControls');

async function loadVideos() {
    try {
        const res = await fetch('videos.json');
        if (!res.ok) throw new Error('Erro ao carregar videos.json');
        const data = await res.json();
        allVideos = data;
    } catch (err) {
        console.error('Erro ao carregar vídeos:', err);
    }
}

function displayVideos(videos) {
    const container = document.getElementById('videoContainer');
    container.innerHTML = '';

    const order = selectOrder.value;
    lastOrderValue = order;
    videos.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
        const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(0);
        return order === 'newest' ? dateB - dateA : dateA - dateB;
    });

    const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * VIDEOS_PER_PAGE;
    const paginatedVideos = videos.slice(start, start + VIDEOS_PER_PAGE);

    paginatedVideos.forEach(video => {
        const title = video.title;
        const thumbnail = video.thumbnail;
        const channels = video.channels || ['Unkown Channel'];
        const categories = video.categories || [];
        const publishedAt = video.publishedAt ? new Date(video.publishedAt).toISOString().split('T')[0].replace(/-/g, '/') : '';
        const videoUrls = video.videoUrls || [];

        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
        <a href="${videoUrls[0] || '#'}" target="_blank" rel="noopener noreferrer">
            <img src="${thumbnail}" alt="${title}" />
        </a>
        
        <div class="video-info">
            <div class="channel-name">
                ${channels.map(ch => `<strong><a href="#" class="channel-link">${ch}</a></strong>`).join(' | ')}
            </div>
            ${categories.length > 0 ? `<div class="categories">${categories.map(cat => `<a href="#" class="category-link">${cat}</a>`).join(' | ')}</div>` : ''}
            ${videoUrls.length > 0 ? `<div class="links">${videoUrls.map((url, i) => `<a href="${url}" target="_blank">Link ${i + 1}</a>`).join(' | ')}</div>` : ''}
            <div class="published-date">${publishedAt}</div>
        </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.channel-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const channelName = e.target.textContent;
            inputSearch.value = channelName;
            updateSearchParam(channelName);
            handleFilter(true);
        });
    });

    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const categoryName = e.target.textContent;
            inputSearch.value = categoryName;
            updateSearchParam(categoryName);
            handleFilter(true);
        });
    });

    renderPagination(videos);
}

function renderPagination(videos) {
    paginationDiv.innerHTML = '';
    const totalPages = Math.ceil(videos.length / VIDEOS_PER_PAGE);
    if (totalPages <= 1) {
        paginationDiv.style.display = 'none';
        return;
    }

    paginationDiv.style.display = 'flex';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.style.padding = '8px 14px';
        btn.style.margin = '2px';
        btn.style.background = i === currentPage ? '#6ab04c' : '#1e1e1e';
        btn.style.color = i === currentPage ? '#fff' : '#ccc';
        btn.style.border = '1px solid #444';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';

        if (i !== currentPage) {
            btn.addEventListener('click', () => {
                currentPage = i;
                updateSearchParam(inputSearch.value, false); // resetPage = false
                updatePageParam(currentPage);
                displayVideos(videos);
            });
        }

        paginationDiv.appendChild(btn);
    }
}

function handleFilter(saveHistory = false) {
    const query = inputSearch.value.trim().toLowerCase();
    const filtered = allVideos.filter(v => {
        const titleMatch = v.title && v.title.toLowerCase().includes(query);
        const channelMatch = (v.channels || []).some(ch => ch.toLowerCase().includes(query));
        const categoryMatch = (v.categories || []).some(cat => cat.toLowerCase().includes(query));
        return titleMatch || channelMatch || categoryMatch;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const pageValue = parseInt(urlParams.get('page')) || 1;

    // Só reseta para 1 se a busca mudou em relação à última busca feita
    if (saveHistory && query !== lastSearchValue) {
        currentPage = 1;
    } else {
        currentPage = pageValue;
    }
    lastSearchValue = query;

    displayVideos(filtered);
    updatePageParam(currentPage);
}

function updateSearchParam(value, resetPage = true) {
    const url = new URL(window.location);
    url.searchParams.set('search', value);
    if (resetPage) {
        url.searchParams.set('page', 1);
    }
    window.history.replaceState({}, '', url);
}

function updatePageParam(page) {
    const url = new URL(window.location);
    url.searchParams.set('page', page);
    window.history.replaceState({}, '', url);
}

btnInicio.addEventListener('click', () => {
    window.location.href = '/';
});

function updateChannelCounts(videos) {
    if (videos.length === allVideos.length) {
        channelCountsDiv.style.display = 'none';
        return;
    }

    const counts = {};
    videos.forEach(v => {
        const chList = v.channels || ['Canal Desconhecido'];
        chList.forEach(ch => {
            counts[ch] = (counts[ch] || 0) + 1;
        });
    });

    let text = 'Vídeos por canal nesta busca: ';
    text += Object.entries(counts)
        .map(([ch, count]) => `${ch}: ${count}`)
        .join(' | ');

    channelCountsDiv.textContent = text;
    channelCountsDiv.style.display = 'block';
}

inputSearch.addEventListener('input', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentSearch = urlParams.get('search') || '';
    // Só reseta para página 1 se o valor mudou
    const resetPage = inputSearch.value !== currentSearch;
    updateSearchParam(inputSearch.value, resetPage);
    handleFilter(true);
});

selectOrder.addEventListener('change', () => {
    updateSearchParam(inputSearch.value);
    handleFilter(false);
});

// Busca automática pelo parâmetro 'search' na URL ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadVideos().then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchValue = urlParams.get('search');
        const pageValue = parseInt(urlParams.get('page')) || 1;
        if (searchValue && inputSearch) {
            inputSearch.value = searchValue;
        }
        currentPage = pageValue;
        handleFilter(false);
    });
});
