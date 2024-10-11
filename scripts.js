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
