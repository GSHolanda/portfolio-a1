/* ==========================================================================
   Portfólio · Gabriel Silva Holanda
   1. Menu móvel acessível
   2. Filtros de projetos (Todos, Publicados, Uso interno, Portfólio)
   3. Realce do link da seção visível
   4. Revelação suave ao rolar
   Sem JavaScript, o menu fica aberto e todos os projetos ficam visíveis.
   ========================================================================== */

// Marca a página como "com JavaScript" antes da primeira pintura.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  iniciarMenu();
  iniciarFiltros();
  iniciarNavegacaoAtiva();
  iniciarRevelacao();
});

/* ---------- 1. Menu móvel ---------- */
function iniciarMenu() {
  var cabecalho = document.querySelector('.cabecalho');
  var botao = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu-principal');
  if (!cabecalho || !botao || !menu) return;

  var telaLarga = window.matchMedia('(min-width: 768px)');

  function estaAberto() {
    return botao.getAttribute('aria-expanded') === 'true';
  }

  function abrir() {
    botao.setAttribute('aria-expanded', 'true');
    cabecalho.setAttribute('data-menu', 'aberto');
  }

  function fechar(devolverFoco) {
    botao.setAttribute('aria-expanded', 'false');
    cabecalho.setAttribute('data-menu', 'fechado');
    if (devolverFoco) botao.focus();
  }

  botao.addEventListener('click', function () {
    if (estaAberto()) fechar(false);
    else abrir();
  });

  // Escolher um link fecha o menu.
  menu.addEventListener('click', function (evento) {
    if (evento.target.closest('a')) fechar(false);
  });

  // Esc fecha e devolve o foco ao botão.
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && estaAberto()) fechar(true);
  });

  // Clique fora do cabeçalho fecha.
  document.addEventListener('click', function (evento) {
    if (estaAberto() && !cabecalho.contains(evento.target)) fechar(false);
  });

  // Se o foco sair do cabeçalho (Tab depois do último link), o menu fecha.
  cabecalho.addEventListener('focusout', function (evento) {
    if (estaAberto() && evento.relatedTarget && !cabecalho.contains(evento.relatedTarget)) fechar(false);
  });

  // Ao passar para tela larga, o menu volta ao estado normal.
  function aoMudarTela(consulta) {
    if (consulta.matches) fechar(false);
  }
  if (telaLarga.addEventListener) telaLarga.addEventListener('change', aoMudarTela);
  else if (telaLarga.addListener) telaLarga.addListener(aoMudarTela);
}

/* ---------- 2. Filtros de projetos ---------- */
function iniciarFiltros() {
  var barra = document.querySelector('.filtros');
  var status = document.querySelector('.filtros__status');
  var projetos = Array.prototype.slice.call(document.querySelectorAll('.projeto[data-categoria]'));
  if (!barra || !projetos.length) return;

  var botoes = Array.prototype.slice.call(barra.querySelectorAll('button[data-filtro]'));
  var nomes = { todos: 'Todos', publicado: 'Publicados', interno: 'Uso interno', portfolio: 'Portfólio' };
  var movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');

  function pertence(projeto, filtro) {
    return filtro === 'todos' || projeto.getAttribute('data-categoria') === filtro;
  }

  // Atualiza as contagens a partir dos cards que existem na página.
  botoes.forEach(function (botao) {
    var filtro = botao.getAttribute('data-filtro');
    var qtd = projetos.filter(function (p) { return pertence(p, filtro); }).length;
    var alvo = botao.querySelector('.filtro__qtd');
    if (alvo) alvo.textContent = qtd;
  });

  function aplicar(filtro, anunciar) {
    var visiveis = 0;
    projetos.forEach(function (projeto) {
      var mostrar = pertence(projeto, filtro);
      var estavaOculto = projeto.hidden;
      projeto.hidden = !mostrar;
      if (mostrar) {
        visiveis += 1;
        if (estavaOculto && !movimentoReduzido.matches) {
          projeto.classList.remove('is-entrando');
          void projeto.offsetWidth; // reinicia a animação
          projeto.classList.add('is-entrando');
        }
      }
    });

    botoes.forEach(function (botao) {
      botao.setAttribute('aria-pressed', String(botao.getAttribute('data-filtro') === filtro));
    });

    if (anunciar && status) {
      status.textContent = filtro === 'todos'
        ? 'Mostrando os ' + projetos.length + ' projetos.'
        : 'Mostrando ' + visiveis + ' de ' + projetos.length + ' projetos: ' + nomes[filtro] + '.';
    }
  }

  barra.addEventListener('click', function (evento) {
    var botao = evento.target.closest('button[data-filtro]');
    if (botao) aplicar(botao.getAttribute('data-filtro'), true);
  });

  projetos.forEach(function (projeto) {
    projeto.addEventListener('animationend', function () { projeto.classList.remove('is-entrando'); });
  });

  barra.hidden = false;
  aplicar('todos', false);
}

/* ---------- 3. Link da seção visível ---------- */
function iniciarNavegacaoAtiva() {
  if (!('IntersectionObserver' in window)) return;
  var links = Array.prototype.slice.call(document.querySelectorAll('.menu__link[href^="#"]'));
  var secoes = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      var id = '#' + entrada.target.id;
      links.forEach(function (link) {
        link.classList.toggle('is-ativo', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach(function (secao) { observador.observe(secao); });
}

/* ---------- 4. Revelação suave ---------- */
function iniciarRevelacao() {
  var alvos = document.querySelectorAll('[data-revelar]');
  if (!alvos.length || !('IntersectionObserver' in window)) return;

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(alvos, function (alvo) { observador.observe(alvo); });

  // A classe só entra depois que o observador existe: se algo falhar antes, nada fica escondido.
  document.documentElement.classList.add('revelar-pronto');
}
