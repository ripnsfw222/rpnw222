async function getRecentlyUpdatedFiles() {
    const repo = 'ripnsfw222/rpnw222';
    const url = `https://api.github.com/repos/${repo}/commits`;

    try {
        const response = await fetch(url);
        const commits = await response.json();
        let recentFiles = new Set();

        // Filtra os commits dos últimos 7 dias
        commits.forEach(commit => {
            const commitDate = new Date(commit.commit.author.date);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            if (commitDate > sevenDaysAgo) {
                commit.files.forEach(file => {
                    recentFiles.add(file.filename);
                });
            }
        });

        return Array.from(recentFiles);
    } catch (error) {
        console.error('Erro ao buscar commits:', error);
    }
}

// Exibe os arquivos atualizados recentemente na página
async function displayRecentlyUpdatedFiles() {
    const files = await getRecentlyUpdatedFiles();
    const recentFilesSection = document.getElementById('recent-updates');
    
    if (files.length > 0) {
        recentFilesSection.innerHTML = 'Arquivos atualizados recentemente: <br>' + files.join('<br>');
    } else {
        recentFilesSection.innerHTML = 'Nenhuma atualização recente nos últimos 7 dias.';
    }
}

// Chama a função ao carregar a página
window.onload = displayRecentlyUpdatedFiles;
