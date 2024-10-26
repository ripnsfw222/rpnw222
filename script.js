const container = document.querySelector('.container');
  const modelos = container.children;
  const itensPorPagina = 20;
  let paginaAtual = 1;

  function paginar() {
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

  // Inicializar paginação
  paginar();

  // Criar botões de paginação
  const paginacao = document.createElement('div');
  paginacao.className = 'paginacao';

  for (let i = 1; i <= Math.ceil(modelos.length / itensPorPagina); i++) {
    const botao = document.createElement('button');
    botao.textContent = i;
    botao.onclick = () => mudarPagina(i);
    paginacao.appendChild(botao);
  }

  container.parentNode.insertBefore(paginacao, container.nextSibling);
