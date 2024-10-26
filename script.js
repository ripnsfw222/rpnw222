document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.container');
    const models = Array.from(document.querySelectorAll(".container a"));
    const counter = document.getElementById("counter");
    const searchInput = document.getElementById("search");
    const sortOrderSelect = document.getElementById("sort-order");

    // Função para atualizar o contador de modelos
    function updateCounter() {
        const visibleModels = models.filter(model => model.style.display !== "none");
        counter.textContent = `All Models: ${visibleModels.length}`;
    }

    // Atualiza o contador inicialmente
    updateCounter();

    // Filtro de pesquisa em tempo real
    searchInput.addEventListener("input", function() {
        const query = searchInput.value.toLowerCase();
        models.forEach(model => {
            const name = model.textContent.toLowerCase();
            if (name.includes(query)) {
                model.style.display = "block";
            } else {
                model.style.display = "none";
            }
        });
        updateCounter();
    });

    // Função para ordenar os modelos
    function sortModels(order) {
        // Converter NodeList para Array novamente para evitar inconsistências
        let sortedModels = Array.from(models);
    
        sortedModels.sort((a, b) => {
            if (order === 'newest' || order === 'oldest') {
                const dateA = a.querySelector('.time-since') ? new Date(a.querySelector('.time-since').getAttribute('data-updated')) : new Date(0);
                const dateB = b.querySelector('.time-since') ? new Date(b.querySelector('.time-since').getAttribute('data-updated')) : new Date(0);
    
                if (order === 'newest') {
                    return dateB - dateA; // Mais novo primeiro
                } else {
                    return dateA - dateB; // Mais antigo primeiro
                }
            } else if (order === 'az') {
                const nameA = a.textContent.toLowerCase();
                const nameB = b.textContent.toLowerCase();
                return nameA.localeCompare(nameB); // Ordem alfabética A-Z
            } else if (order === 'za') {
                const nameA = a.textContent.toLowerCase();
                const nameB = b.textContent.toLowerCase();
                return nameB.localeCompare(nameA); // Ordem alfabética Z-A
            }
        });
    
        // Limpar o container e anexar os modelos ordenados
        sortedModels.forEach(model => container.appendChild(model));
    
        // Manter os elementos fantasma no final
        const ghosts = Array.from(container.querySelectorAll('.ghost'));
        ghosts.forEach(ghost => container.appendChild(ghost));
    }

    // Evento de mudança no select de ordenação
    sortOrderSelect.addEventListener("change", function() {
        const selectedOrder = sortOrderSelect.value;
        sortModels(selectedOrder);
    });

    // Ordenar inicialmente por mais novo para mais antigo
    sortModels('newest');

    // Atualizar o contador quando a ordenação ou filtragem mudar
    // Já está sendo chamado na função de filtro

});

function timeSince(date) {
    const now = new Date();
    const updatedDate = new Date(date);
    const seconds = Math.floor((now - updatedDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return years === 1 ? '1 year' : `${years} years`;
    } else if (months > 0) {
        return months === 1 ? '1 month' : `${months} months`;
    } else if (weeks > 0) {
        return weeks === 1 ? '1 week' : `${weeks} weeks`;
    } else if (days > 0) {
        return days === 1 ? '1 day' : `${days} days`;
    } else if (hours > 0) {
        return 'New'; // Trata qualquer tempo dentro do dia atual como "New"
    } else if (minutes > 0) {
        return 'New'; // Trata qualquer tempo dentro da hora atual como "New"
    } else {
        return 'New'; // Trata qualquer tempo dentro do minuto atual como "New"
    }
}

function updateTimes() {
    const timeElements = document.querySelectorAll('.time-since');
    timeElements.forEach(el => {
        const updatedDate = el.getAttribute('data-updated');
        const timeSinceUpdate = timeSince(updatedDate);
        el.querySelector('span').textContent = timeSinceUpdate;
    });
}

// Atualiza o tempo desde a última atualização a cada minuto
updateTimes();
setInterval(updateTimes, 60000); // 1 minuto em milissegundos

const scrollToTopButton = document.getElementById('scrollToTop');

// Exibe o botão quando a página é rolada para baixo
window.onscroll = function() {
    scrollToTopButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? 'block' : 'none';
};

// Rolagem suave para o topo
scrollToTopButton.onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
};

const container = document.querySelector('.container');
  const modelos = container.children;
  const itensPorPagina = 20;
  let paginaAtual = 1;

  function paginar() {
    const modelos = container.children; // Recarrega os modelos ao paginar para incluir novos itens
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;

    for (let i = 0; i < modelos.length; i++) {
      if (i >= inicio && i < fim) {
        modelos[i].style.display = 'block';
      } else {
        modelos[i].style.display = 'none';
      }
    }
  }

  function mudarPagina(pagina) {
    paginaAtual = pagina;
    paginar();
  }

  function atualizarPaginacao() {
  const modelos = container.children;
  const numPaginas = Math.ceil(modelos.length / itensPorPagina);
  
  // Limpar botões de paginação existentes
  paginacao.innerHTML = '';

  // Criar novos botões de paginação
  for (let i = 1; i <= numPaginas; i++) {
    const botao = document.createElement('button');
    botao.textContent = i;
    botao.onclick = () => mudarPagina(i);
    paginacao.appendChild(botao);
  }
}

  // Inicializar a paginação e os botões
paginar();
const paginacao = document.createElement('div');
paginacao.className = 'paginacao';
container.parentNode.insertBefore(paginacao, container.nextSibling);
atualizarPaginacao();

// Adicione um MutationObserver para monitorar mudanças no container
const observer = new MutationObserver(() => {
  atualizarPaginacao(); // Atualiza a paginação sempre que novos itens são adicionados
  paginar(); // Reaplica a paginação com os novos itens
});
observer.observe(container, { childList: true });
