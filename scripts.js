const totalVideos = 8; // Atualize o total de v�deos
document.getElementById('total-videos').textContent = totalVideos;

function openModal(thumbnail) {
    const videoSrc = thumbnail.getAttribute('data-src');
    const downloadLink = thumbnail.getAttribute('data-download');
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const downloadBtn = document.getElementById('downloadBtn');
    
    modalVideo.src = videoSrc;
    downloadBtn.onclick = () => window.open(downloadLink, '_blank');
    
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    modalVideo.src = '';
    modal.style.display = 'none';
}

// Seleciona o botão "Back to Top"
const backToTopBtn = document.querySelector('.back-to-top');

// Adiciona um evento de rolagem
window.addEventListener('scroll', () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.style.display = 'block'; // Mostra o botão quando a página for rolada para baixo
    } else {
        backToTopBtn.style.display = 'none'; // Esconde o botão quando a página estiver no topo
    }
});

// Adiciona a funcionalidade de voltar ao topo
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave para o topo
});
