const raiz = document.documentElement;
const CHAVE_TEMA = 'portfolio-tema';

raiz.classList.add('js');

try {
  if (localStorage.getItem(CHAVE_TEMA) === 'escuro') raiz.dataset.tema = 'escuro';
} catch {}

document.addEventListener('DOMContentLoaded', () => {
  iniciarTema();
  iniciarMenu();
  iniciarFiltros();
  iniciarNavegacaoAtiva();
  iniciarRevelacao();
});

function iniciarTema() {
  const botao = document.querySelector('.tema-botao');
  const corBarra = document.querySelector('meta[name="theme-color"]');

  const aplicar = (escuro, salvar) => {
    if (escuro) raiz.dataset.tema = 'escuro';
    else delete raiz.dataset.tema;

    botao.setAttribute('aria-pressed', escuro);
    botao.title = escuro ? 'Voltar ao tema claro' : 'Ativar tema escuro';
    corBarra.content = escuro ? '#12131b' : '#f6f5f0';

    if (salvar) {
      try {
        localStorage.setItem(CHAVE_TEMA, escuro ? 'escuro' : 'claro');
      } catch {}
    }
  };

  aplicar(raiz.dataset.tema === 'escuro', false);
  botao.hidden = false;
  botao.addEventListener('click', () => aplicar(botao.getAttribute('aria-pressed') !== 'true', true));
}

function iniciarMenu() {
  const cabecalho = document.querySelector('.cabecalho');
  const botao = cabecalho.querySelector('.menu-botao');
  const menu = document.getElementById('menu-principal');

  const estaAberto = () => botao.getAttribute('aria-expanded') === 'true';

  const alternar = (abrir, devolverFoco = false) => {
    botao.setAttribute('aria-expanded', abrir);
    cabecalho.dataset.menu = abrir ? 'aberto' : 'fechado';
    if (devolverFoco) botao.focus();
  };

  botao.addEventListener('click', () => alternar(!estaAberto()));

  menu.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) alternar(false);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && estaAberto()) alternar(false, true);
  });

  document.addEventListener('click', (evento) => {
    if (estaAberto() && !cabecalho.contains(evento.target)) alternar(false);
  });

  cabecalho.addEventListener('focusout', (evento) => {
    if (estaAberto() && evento.relatedTarget && !cabecalho.contains(evento.relatedTarget)) alternar(false);
  });

  matchMedia('(min-width: 768px)').addEventListener('change', (consulta) => {
    if (consulta.matches) alternar(false);
  });
}

function iniciarFiltros() {
  const barra = document.querySelector('.filtros');
  const status = document.querySelector('.filtros__status');
  const projetos = [...document.querySelectorAll('.projeto[data-categoria]')];
  const botoes = [...barra.querySelectorAll('[data-filtro]')];
  const nomes = { publicado: 'Publicados', interno: 'Uso interno', portfolio: 'Portfólio' };
  const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');

  const pertence = (projeto, filtro) => filtro === 'todos' || projeto.dataset.categoria === filtro;

  botoes.forEach((botao) => {
    const filtro = botao.dataset.filtro;
    botao.querySelector('.filtro__qtd').textContent = projetos.filter((projeto) => pertence(projeto, filtro)).length;
  });

  const aplicar = (filtro) => {
    let visiveis = 0;

    projetos.forEach((projeto) => {
      const estavaOculto = projeto.hidden;
      const mostrar = pertence(projeto, filtro);
      projeto.hidden = !mostrar;
      if (!mostrar) return;

      visiveis += 1;
      if (estavaOculto && !movimentoReduzido.matches) {
        projeto.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
          { duration: 320, easing: 'steps(4)' }
        );
      }
    });

    botoes.forEach((botao) => botao.setAttribute('aria-pressed', botao.dataset.filtro === filtro));

    status.textContent = filtro === 'todos'
      ? `Mostrando os ${projetos.length} projetos.`
      : `Mostrando ${visiveis} de ${projetos.length} projetos: ${nomes[filtro]}.`;
  };

  barra.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-filtro]');
    if (botao) aplicar(botao.dataset.filtro);
  });

  barra.hidden = false;
}

function iniciarNavegacaoAtiva() {
  const links = [...document.querySelectorAll('.menu__link')];

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      links.forEach((link) => link.classList.toggle('is-ativo', link.hash === `#${entrada.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  links.forEach((link) => observador.observe(document.querySelector(link.hash)));
}

function iniciarRevelacao() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('[data-revelar]').forEach((alvo) => observador.observe(alvo));
  raiz.classList.add('revelar-pronto');
}
