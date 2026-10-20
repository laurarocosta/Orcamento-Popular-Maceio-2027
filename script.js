/* ==========================================================
   Orçamento Popular de Maceió 2027 — interações
   Todos os valores vêm da proposta (PLOA 2027) e demonstrativos oficiais.
   ========================================================== */
(function () {
  'use strict';

  var COR = { marinho: '#173E75', laranja: '#F39D0F', azul: '#036BAC', azulClaro: '#0E78BD', amarelo: '#FCC326', cinza: '#9FB3C6', branco: '#FFFFFF' };

  /* Cria um elemento com classe, texto e atributos */
  function el(tag, opts, filhos) {
    var e = document.createElement(tag);
    opts = opts || {};
    if (opts.cls) e.className = opts.cls;
    if (opts.text != null) e.textContent = opts.text;
    if (opts.html != null) e.innerHTML = opts.html; // usado só com conteúdo fixo deste arquivo
    if (opts.style) Object.assign(e.style, opts.style);
    if (opts.attrs) Object.keys(opts.attrs).forEach(function (k) { e.setAttribute(k, opts.attrs[k]); });
    if (opts.on) Object.keys(opts.on).forEach(function (k) { e.addEventListener(k, opts.on[k]); });
    (filhos || []).forEach(function (f) { if (f) e.appendChild(f); });
    return e;
  }
  function limpar(e) { while (e.firstChild) e.removeChild(e.firstChild); }
  function ehCelular() { return window.matchMedia('(max-width: 720px)').matches; }
  /* No celular, se o elemento estiver fora da tela (ou atrás do menu de baixo), rola até ele */
  function revelar(e) {
    if (!e || !ehCelular()) return;
    var r = e.getBoundingClientRect(), menu = document.querySelector('.nav-celular');
    var baixo = window.innerHeight - (menu ? menu.offsetHeight : 0) - 12;
    if (r.top >= 12 && r.bottom <= baixo) return;
    var alvo = r.height > baixo - 24 ? r.top - 16 : r.bottom - baixo;
    window.scrollBy({ top: alvo, behavior: semMovimentoGlobal() ? 'auto' : 'smooth' });
  }

  /* ========================================================
     1. PARA ONDE VAI O DINHEIRO — as despesas por tipo
     Valores do PLOA 2027 (Anexo 02, natureza da despesa), em reais.
     ======================================================== */
  var ORCAMENTO_TOTAL = 6161772268; // PLOA 2027, total geral

  /* R$ 2,43 bilhões · R$ 306,9 milhões (curto: R$ 2,43 bi · R$ 306,9 mi) */
  function formatar(v, curto) {
    if (v >= 1e9) {
      var b = (v / 1e9).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return 'R$\u00a0' + b + (curto ? '\u00a0bi' : (v < 2e9 ? ' bilhão' : ' bilhões'));
    }
    var m = (v / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return 'R$\u00a0' + m + (curto ? '\u00a0mi' : (v < 2e6 ? ' milhão' : ' milhões'));
  }
  /* Percentuais inteiros que somam exatamente 100 */
  function percentuais(valores) {
    var total = valores.reduce(function (a, v) { return a + v; }, 0);
    var brutos = valores.map(function (v) { return v / total * 100; });
    var inteiros = brutos.map(Math.floor);
    var falta = 100 - inteiros.reduce(function (a, v) { return a + v; }, 0);
    brutos.map(function (b, i) { return { i: i, r: b - inteiros[i] }; })
      .sort(function (a, b) { return b.r - a.r; })
      .slice(0, falta).forEach(function (x) { inteiros[x.i]++; });
    return inteiros;
  }

  var PARTES = [
    { id: 'pessoal', valor: 2427341277, cor: COR.marinho,
      titulo: 'Pessoal', oficial: 'pessoal e encargos sociais',
      desc: 'Salários e encargos de quem trabalha para a cidade: professores, profissionais de saúde, guardas, agentes e outros servidores. Também entram aqui as aposentadorias e pensões dos servidores.' },
    { id: 'custeio', valor: 2225661121, cor: COR.azulClaro,
      titulo: 'Custeio dos serviços', oficial: 'outras despesas correntes',
      desc: 'O que faz os serviços funcionarem no dia a dia: contratos de limpeza e coleta de lixo, merenda, remédios, energia, aluguel, manutenção e programas sociais.' },
    { id: 'investir', valor: 1028706954, cor: COR.laranja,
      titulo: 'Investimentos', oficial: 'investimentos',
      desc: 'Obras, compra de equipamentos e melhorias que ampliam ou modernizam os serviços públicos. É parte do total, não um dinheiro extra.' },
    { id: 'divida', valor: 306893990, cor: COR.amarelo,
      titulo: 'Dívida', oficial: 'juros e encargos da dívida + amortização da dívida',
      desc: 'A cidade paga empréstimos feitos no passado. Os juros (R$\u00a0158,0 milhões) são o custo de ter pegado o dinheiro emprestado. A amortização (R$\u00a0148,9 milhões) é a parte que diminui o que a cidade ainda deve.' },
    { id: 'reservas', valor: 173168926, cor: COR.cinza,
      titulo: 'Reservas', oficial: 'reserva de contingência (inclui a reserva parlamentar) e reserva do RPPS',
      desc: 'Dinheiro guardado para usar depois: R$\u00a067,0 milhões para as emendas que os vereadores vão indicar, R$\u00a046,2 milhões para imprevistos e R$\u00a060,0 milhões para a previdência dos servidores.' }
  ];
  percentuais(PARTES.map(function (p) { return p.valor; })).forEach(function (pc, i) {
    PARTES[i].pct = pc; PARTES[i].total = formatar(PARTES[i].valor); PARTES[i].curto = formatar(PARTES[i].valor, true);
  });

  var notaBarra = document.getElementById('nota-barra');
  var notaBotoes = document.getElementById('nota-botoes');
  var notaDetalhe = document.getElementById('nota-detalhe');
  var parteAtual = 'pessoal';

  function desenharNota() {
    limpar(notaBarra);
    limpar(notaBotoes);
    PARTES.forEach(function (p) {
      var ativa = p.id === parteAtual;
      // Fatia da barra: sem número dentro, clicável (os botões abaixo seguem como opção pelo teclado)
      notaBarra.appendChild(el('button', {
        cls: 'nota__fatia' + (ativa ? ' ativa' : ''),
        attrs: { type: 'button', tabindex: '-1', 'aria-label': p.titulo + ' · ' + p.total, title: p.titulo + ' · ' + p.total },
        style: { flex: p.valor + ' 1 0px', background: p.cor },
        on: { click: function () { parteAtual = p.id; desenharNota(); revelar(notaDetalhe); } }
      }));
      notaBotoes.appendChild(el('button', {
        cls: 'parte', attrs: { type: 'button', 'aria-pressed': ativa ? 'true' : 'false' },
        on: { click: function () { parteAtual = p.id; desenharNota(); revelar(notaDetalhe); } }
      }, [
        el('span', { cls: 'parte__cor', style: { background: p.cor } }),
        el('span', { cls: 'parte__textos' }, [
          el('span', { cls: 'parte__valor', text: p.curto }),
          el('span', { cls: 'parte__nome', text: p.titulo })
        ])
      ]));
    });

    var p = PARTES.filter(function (x) { return x.id === parteAtual; })[0];
    limpar(notaDetalhe);
    notaDetalhe.appendChild(el('div', { cls: 'detalhe__esq' }, [
      el('div', { cls: 'detalhe__rotulo', text: p.pct + '% DAS DESPESAS' }),
      el('div', { cls: 'detalhe__total', text: p.total }),
      el('span', { cls: 'selo selo--ok', text: 'Dado conferido' })
    ]));
    var oficial = el('div', { cls: 'detalhe__oficial', text: 'Nome nos documentos oficiais: ' });
    oficial.appendChild(el('strong', { text: p.oficial }));
    notaDetalhe.appendChild(el('div', { cls: 'detalhe__dir' }, [
      el('div', { cls: 'detalhe__titulo', text: p.titulo }),
      el('p', { cls: 'detalhe__desc', text: p.desc }),
      oficial
    ]));
  }

  /* ========================================================
     PARA QUEM É O DINHEIRO — no celular, um público por vez
     ======================================================== */
  (function () {
    var lista = document.querySelector('.temas'); if (!lista) return;
    var chips = Array.prototype.slice.call(document.querySelectorAll('.temas__chip'));
    var temas = Array.prototype.slice.call(lista.querySelectorAll('.tema'));
    lista.classList.add('com-abas');
    function escolher(i) {
      chips.forEach(function (c, k) { c.setAttribute('aria-selected', k === i ? 'true' : 'false'); c.tabIndex = k === i ? 0 : -1; });
      temas.forEach(function (t, k) { t.classList.toggle('tema--ativo', k === i); });
    }
    chips.forEach(function (c, i) {
      c.addEventListener('click', function () { escolher(i); });
      c.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { var n = (i + (ev.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length; escolher(n); chips[n].focus(); }
      });
    });
    escolher(0);
  })();

  /* ========================================================
     CÂMARA E EMENDAS — plenário com 27 cadeiras
     Reserva parlamentar: parte da reserva de contingência guardada para as emendas
     individuais dos vereadores (Quadro de Detalhamento da Despesa, Órgão 99000,
     ação 242109). Equivale a 1,45% da Receita Corrente Líquida prevista.
     ======================================================== */
  var RESERVA_PARLAMENTAR = 66968646;   // R$ — SIGEF/MCZ, relatório de 14/10/2026
  var RESERVA_CONTINGENCIA = 113153926; // R$ — reserva de contingência total (inclui a parlamentar)
  var VEREADORES = 27;                  // legislatura 2025–2028
  (function () {
    var desenho = document.querySelector('.plenario__desenho'); if (!desenho) return;
    var cada = RESERVA_PARLAMENTAR / VEREADORES;
    var $ = function (id) { return document.getElementById(id); };
    $('emendas-total').textContent = formatar(RESERVA_PARLAMENTAR);
    $('plenario-frase').innerHTML = 'Cada cadeira indica <strong>' + formatar(cada) + '</strong>: metade para a saúde, metade para outras áreas.';
    $('plenario-origem').textContent = 'Esse valor sai da reserva de contingência, que guarda ' + formatar(RESERVA_CONTINGENCIA) + '.';
    var cadeiras = Array.prototype.slice.call(desenho.querySelectorAll('.cadeira'));
    function escolher(c) {
      cadeiras.forEach(function (x) { x.classList.toggle('cadeira--ativa', x === c); x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      $('plenario-resumo').innerHTML = '<strong>Cadeira ' + c.getAttribute('data-n') + ' de ' + VEREADORES + '</strong> indica ' + formatar(cada) +
        ': <span class="cor-saude">' + formatar(cada / 2) + ' para a saúde</span> e <span class="cor-outras">' + formatar(cada / 2) + ' para outras áreas</span>.';
    }
    cadeiras.forEach(function (c) {
      c.addEventListener('click', function () { escolher(c); });
      c.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(c); } });
    });
  })();

  /* ========================================================
     3. MITOS E VERDADES — cartões que viram ao tocar
     ======================================================== */
  var cartoesMito = Array.prototype.slice.call(document.querySelectorAll('.mito'));
  var contadorMitos = document.getElementById('mitos-contador');
  var descobertos = {};
  cartoesMito.forEach(function (c, i) {
    var frente = c.querySelector('.mito__frente'), verso = c.querySelector('.mito__verso');
    var rotuloFrente = c.getAttribute('aria-label');
    c.addEventListener('click', function () {
      var virado = !c.classList.contains('virado');
      c.classList.toggle('virado', virado);
      c.setAttribute('aria-pressed', virado ? 'true' : 'false');
      frente.setAttribute('aria-hidden', virado ? 'true' : 'false');
      verso.setAttribute('aria-hidden', virado ? 'false' : 'true');
      c.setAttribute('aria-label', virado ? verso.textContent.replace(/\s+/g, ' ').trim() : rotuloFrente);
      if (virado) descobertos[i] = true;
      var n = Object.keys(descobertos).length;
      contadorMitos.textContent = n === cartoesMito.length
        ? 'Você descobriu todos os ' + n + '. Agora você já sabe mais que muita gente!'
        : 'Você descobriu ' + n + ' de ' + cartoesMito.length;
    });
  });

  /* ========================================================
     MENU COMPLETO (celular) — abre por cima da página
     ======================================================== */
  (function () {
    var abrir = document.getElementById('abrir-menu'), folha = document.getElementById('menu-completo');
    var fundo = document.getElementById('menu-fundo'), fechar = document.getElementById('fechar-menu');
    if (!abrir || !folha) return;
    function mostrar(sim) {
      folha.hidden = !sim; fundo.hidden = !sim; abrir.setAttribute('aria-expanded', sim ? 'true' : 'false');
      document.documentElement.classList.toggle('menu-aberto', sim);
      if (sim) { var a = folha.querySelector('a'); if (a) a.focus(); } else abrir.focus();
    }
    abrir.addEventListener('click', function () { mostrar(folha.hidden); });
    fechar.addEventListener('click', function () { mostrar(false); });
    fundo.addEventListener('click', function () { mostrar(false); });
    folha.addEventListener('click', function (ev) { if (ev.target.closest('a')) { folha.hidden = true; fundo.hidden = true; abrir.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('menu-aberto'); } });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !folha.hidden) mostrar(false); });
  })();

  /* ========================================================
     4. QUIZ — chute e descubra
     ======================================================== */
  var PERGUNTAS = [
    { p: 'Qual é a maior despesa da Prefeitura de Maceió?', op: ['Obras e investimentos', 'Pessoal: salários e encargos dos servidores', 'Pagamento da dívida'], certa: 1,
      exp: 'A despesa com pessoal é a maior: ' + PARTES[0].total + ' em 2027. Escolas e postos de saúde dependem, antes de tudo, das pessoas que trabalham neles.' },
    { p: 'Os R$\u00a06,16 bilhões já estão no caixa da Prefeitura?', op: ['Sim, já estão guardados', 'Não, é uma previsão para 2027'], certa: 1,
      exp: 'É uma previsão para o ano todo. O dinheiro entra aos poucos, e parte dele já tem uso definido por lei.' },
    { p: 'Se uma obra aparece no orçamento, ela já está garantida?', op: ['Sim, está garantida', 'Não, ainda depende de outras etapas'], certa: 1,
      exp: 'Estar no orçamento é o primeiro passo. A obra ainda depende de o dinheiro entrar, de projeto e de contratação.' },
    { p: 'Quem aprova o orçamento da cidade?', op: ['O prefeito, sozinho', 'Os vereadores, na Câmara', 'O Governo do Estado'], certa: 1,
      exp: 'A Prefeitura propõe, os vereadores discutem, podem mudar e votam. Depois o prefeito sanciona e o orçamento vira lei.' },
    { p: 'Pagar juros é o mesmo que diminuir a dívida?', op: ['Sim, é a mesma coisa', 'Não, só a amortização diminui a dívida'], certa: 1,
      exp: 'Juros são o custo do empréstimo. O que diminui o que a cidade deve é a amortização. Em 2027 estão previstos R$\u00a0158,0 milhões de juros e R$\u00a0148,9 milhões de amortização.' }
  ];
  var quiz = { atual: 0, escolhida: null, pontos: 0, fim: false };
  var caixa = document.getElementById('quiz-caixa');
  var barco = document.getElementById('quiz-barco');

  var BARCO_SVG = '<svg viewBox="0 0 120 120" aria-hidden="true"><defs><clipPath id="cmedalha"><path d="M56 8 Q86 48 110 86 L56 86 Z"/></clipPath></defs><g clip-path="url(#cmedalha)"><rect x="56" y="8.00" width="60" height="13.51" fill="#FCC326"/><rect x="56" y="21.51" width="60" height="3.93" fill="#6FB8EC"/><rect x="56" y="25.44" width="60" height="19.14" fill="#F39D0F"/><rect x="56" y="44.59" width="60" height="41.41" fill="#FFFFFF"/><rect x="56" y="20.61" width="60" height="1.8" fill="#173E75"/><rect x="56" y="24.54" width="60" height="1.8" fill="#173E75"/><rect x="56" y="43.69" width="60" height="1.8" fill="#173E75"/></g><rect x="47" y="6" width="5" height="86" rx="2.5" fill="#FFFFFF"/><path d="M16 92 H112 C104 104 90 108 72 108 H48 C32 108 22 102 16 92 Z" fill="#FFFFFF"/><path d="M6 116 C26 110 44 120 64 114 C82 109 98 118 114 113" fill="none" stroke="#6FB8EC" stroke-width="5" stroke-linecap="round"/></svg>';

  function moverBarco() {
    var feitas = quiz.fim ? PERGUNTAS.length : quiz.atual + (quiz.escolhida !== null ? 1 : 0);
    barco.style.left = 'calc(' + (feitas / PERGUNTAS.length * 100) + '% - 24px)';
  }

  function desenharQuiz() {
    limpar(caixa);
    moverBarco();

    if (quiz.fim) {
      var msg = quiz.pontos === 5 ? 'Nota máxima! Você já entende o orçamento melhor do que muita gente. Que tal ajudar a escolher as prioridades da cidade?'
        : quiz.pontos >= 3 ? 'Muito bem! Você já sabe o essencial sobre o orçamento. Agora é participar.'
        : 'Toda viagem começa assim. Agora você sabe mais sobre o orçamento do que sabia há um minuto.';
      var medalha = el('div', { cls: 'medalha', html: BARCO_SVG });
      medalha.appendChild(el('div', { cls: 'medalha__nota', text: quiz.pontos + '/5' }));
      caixa.appendChild(el('div', { cls: 'resultado' }, [
        medalha,
        el('h3', { text: 'Navegador do Orçamento 2027' }),
        el('p', { text: msg }),
        el('div', { cls: 'botoes', style: { justifyContent: 'center', marginTop: '6px' } }, [
          el('a', { cls: 'btn btn--laranja', text: 'Ir para o Participa Maceió ↗',
            attrs: { href: 'https://www.participa.maceio.al.gov.br/participa-maceio/principal.faces', target: '_blank', rel: 'noopener noreferrer' } }),
          el('button', { cls: 'btn btn--contorno', text: 'Refazer o quiz', attrs: { type: 'button' },
            on: { click: function () { quiz = { atual: 0, escolhida: null, pontos: 0, fim: false }; desenharQuiz(); } } })
        ])
      ]));
      return;
    }

    var q = PERGUNTAS[quiz.atual];
    var respondida = quiz.escolhida !== null;
    caixa.appendChild(el('div', { cls: 'quiz__contador', text: 'Pergunta ' + (quiz.atual + 1) + ' de ' + PERGUNTAS.length }));
    caixa.appendChild(el('div', { cls: 'quiz__pergunta', text: q.p }));

    var opcoes = el('div', { cls: 'quiz__opcoes' });
    q.op.forEach(function (texto, i) {
      var cls = 'opcao';
      if (respondida && i === q.certa) cls += ' opcao--certa';
      else if (respondida && i === quiz.escolhida) cls += ' opcao--errada';
      var b = el('button', { cls: cls, text: texto, attrs: { type: 'button' },
        on: { click: function () {
          if (quiz.escolhida !== null) return;
          quiz.escolhida = i;
          if (i === q.certa) quiz.pontos++;
          desenharQuiz();
          revelar(caixa.querySelector('.quiz__acoes'));
        } } });
      b.disabled = respondida;
      opcoes.appendChild(b);
    });
    caixa.appendChild(opcoes);

    if (respondida) {
      var acertou = quiz.escolhida === q.certa;
      caixa.appendChild(el('div', { cls: 'retorno ' + (acertou ? 'retorno--certo' : 'retorno--quase') }, [
        el('strong', { text: acertou ? 'Isso mesmo!' : 'Muita gente pensa isso!' }),
        el('p', { text: q.exp })
      ]));
      var ultima = quiz.atual >= PERGUNTAS.length - 1;
      var prox = el('button', { cls: 'btn btn--laranja', text: ultima ? 'Ver meu resultado' : 'Próxima pergunta', attrs: { type: 'button' },
        on: { click: function () {
          if (ultima) quiz.fim = true;
          else { quiz.atual++; quiz.escolhida = null; }
          desenharQuiz();
          revelar(caixa);
        } } });
      caixa.appendChild(el('div', { cls: 'quiz__acoes' }, [prox]));
      prox.focus({ preventScroll: true });
    }
  }

  /* ========================================================
     5. DICIONÁRIO DO ORÇAMENTO (lê os termos de glossario.js)
     ======================================================== */
  var GLOSS = (window.GLOSSARIO || []);
  var GLOSS_POR_ID = {};
  GLOSS.forEach(function (t) { GLOSS_POR_ID[t.id] = t; });
  var TERMOS_DIC = GLOSS.filter(function (t) { return t.mostrarNoDicionario !== false; });
  var termoAtual = 0;

  function rotuloCurto(t) { return t.nome.split(' · ')[0]; }

  var dicAberto = null;
  var DIC_INICIAIS = 8;   // quantas palavras aparecem antes de "Ver todas"
  var dicTodos = false;
  function normalizar(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function desenharTermos() {
    var lista = document.getElementById('dic-lista');
    if (!lista || !TERMOS_DIC.length) return;
    var busca = document.getElementById('busca-termo');
    var q = busca ? normalizar(busca.value.trim()) : '';
    limpar(lista);
    var achados = 0;
    var limite = (q || dicTodos) ? Infinity : DIC_INICIAIS;
    TERMOS_DIC.forEach(function (t) {
      var texto = normalizar(t.nome + ' ' + (t.variantes || []).join(' ') + ' ' + t.def);
      if (q && texto.indexOf(q) < 0) return;
      achados++;
      if (achados > limite) return;
      var aberto = dicAberto === t.id, idPainel = 'dic-' + t.id;
      var cab = el('button', { cls: 'dic__termo', attrs: { type: 'button', 'aria-expanded': aberto ? 'true' : 'false', 'aria-controls': idPainel },
        on: { click: function () { dicAberto = aberto ? null : t.id; pararFala(); desenharTermos();
          if (!aberto) revelar(document.getElementById(idPainel)); } } }, [
        el('span', { text: t.nome }),
        el('span', { cls: 'dic__seta', text: aberto ? '−' : '+', attrs: { 'aria-hidden': 'true' } })
      ]);
      var painel = el('div', { cls: 'dic__def', attrs: { id: idPainel } }, [el('p', { text: t.def })]);
      if (!aberto) painel.hidden = true;
      var ouvir = botaoOuvir(t); if (ouvir && aberto) painel.appendChild(ouvir);
      lista.appendChild(el('li', { cls: 'dic__item' + (aberto ? ' dic__item--aberto' : '') }, [cab, painel]));
    });
    var vazio = document.getElementById('dic-vazio'); if (vazio) vazio.hidden = achados > 0;
    if (achados > limite) {
      lista.appendChild(el('li', { cls: 'dic__mais' }, [el('button', { cls: 'btn btn--contorno dic__ver-todas', text: 'Ver todas as ' + achados + ' palavras',
        attrs: { type: 'button' }, on: { click: function () { dicTodos = true; desenharTermos(); } } })]));
    }
  }
  (function () {
    var busca = document.getElementById('busca-termo');
    if (busca) busca.addEventListener('input', function () { dicAberto = null; desenharTermos(); });
  })();

  function mostrarNoDicionario(id) {
    if (!GLOSS_POR_ID[id]) return;
    var busca = document.getElementById('busca-termo'); if (busca) busca.value = '';
    dicAberto = id; dicTodos = true; desenharTermos();
    var item = document.getElementById('dic-' + id);
    if (item) item.parentElement.scrollIntoView({ behavior: semMovimentoGlobal() ? 'auto' : 'smooth', block: 'center' });
  }
  function semMovimentoGlobal() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------- Leitura em voz alta (voz do próprio aparelho) ---------- */
  var falaDisponivel = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  var vozPt = null;
  var botaoFalando = null;
  function escolherVoz() {
    if (!falaDisponivel) return;
    var vozes = window.speechSynthesis.getVoices();
    vozPt = vozes.filter(function (v) { return /^pt(-|_)BR/i.test(v.lang); })[0]
         || vozes.filter(function (v) { return /^pt/i.test(v.lang); })[0] || null;
  }
  if (falaDisponivel) { escolherVoz(); window.speechSynthesis.addEventListener('voiceschanged', escolherVoz); }

  function marcarBotao(btn, falando) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', falando ? 'true' : 'false');
    btn.querySelector('.ouvir__txt').textContent = falando ? 'Parar' : 'Ouvir';
  }
  function pararFala() {
    if (!falaDisponivel) return;
    window.speechSynthesis.cancel();
    marcarBotao(botaoFalando, false); botaoFalando = null;
  }
  function falar(t, btn) {
    if (!falaDisponivel) return;
    if (botaoFalando === btn) { pararFala(); return; }
    pararFala();
    var u = new SpeechSynthesisUtterance((t.falar || t.nome) + '. ' + t.def);
    u.lang = 'pt-BR'; if (vozPt) u.voice = vozPt; u.rate = 1.1;
    u.onend = u.onerror = function () { if (botaoFalando === btn) { marcarBotao(btn, false); botaoFalando = null; } };
    botaoFalando = btn; marcarBotao(btn, true);
    window.speechSynthesis.speak(u);
  }
  var ICONE_SOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  function botaoOuvir(t) {
    if (!falaDisponivel) return null;
    var b = el('button', { cls: 'ouvir', attrs: { type: 'button', 'aria-pressed': 'false', 'aria-label': 'Ouvir a explicação de ' + rotuloCurto(t) } });
    b.innerHTML = ICONE_SOM; // ícone fixo deste arquivo
    b.appendChild(el('span', { cls: 'ouvir__txt', text: 'Ouvir' }));
    b.addEventListener('click', function (e) { e.stopPropagation(); falar(t, b); });
    return b;
  }

  /* ========================================================
     6. O CAMINHO — destaque passando de cartão em cartão
     ======================================================== */
  var TEMPO_ETAPA = 3200; // milissegundos em cada cartão
  var listaEtapas = document.getElementById('etapas');
  var etapas = Array.prototype.slice.call(listaEtapas.querySelectorAll('.etapa'));
  var etapaAtual = 0;
  /* Selo "Você está aqui" na etapa indicada em data-atual (no HTML) */
  (function () {
    var n = parseInt(listaEtapas.getAttribute('data-atual'), 10) || 1;
    var alvo = etapas[Math.min(Math.max(n, 1), etapas.length) - 1];
    if (alvo) alvo.insertBefore(el('span', { cls: 'selo-aqui', text: 'VOCÊ ESTÁ AQUI' }), alvo.firstChild);
  })();
  var relogio = null;
  var semMovimento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  listaEtapas.style.setProperty('--tempo-etapa', (TEMPO_ETAPA / 1000) + 's');

  function ativarEtapa(i) {
    etapaAtual = i;
    etapas.forEach(function (e, k) {
      e.classList.remove('etapa--ativa');
      if (k === i) { void e.offsetWidth; e.classList.add('etapa--ativa'); } // reinicia a barrinha
    });
  }
  function proximaEtapa() { ativarEtapa((etapaAtual + 1) % etapas.length); }
  function iniciarCiclo() { pararCiclo(); if (!semMovimento) relogio = setInterval(proximaEtapa, TEMPO_ETAPA); listaEtapas.classList.remove('pausado'); }
  function pararCiclo() { if (relogio) { clearInterval(relogio); relogio = null; } }

  etapas.forEach(function (e, k) {
    e.addEventListener('click', function () { ativarEtapa(k); iniciarCiclo(); });
  });
  // Pausa enquanto a pessoa está com o mouse em cima, para conseguir ler
  listaEtapas.addEventListener('mouseenter', function () { pararCiclo(); listaEtapas.classList.add('pausado'); });
  listaEtapas.addEventListener('mouseleave', iniciarCiclo);

  ativarEtapa(0);
  // Só anima quando a seção aparece na tela
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (itens) {
      itens.forEach(function (it) { if (it.isIntersecting) { ativarEtapa(etapaAtual); iniciarCiclo(); } else { pararCiclo(); } });
    }, { threshold: 0.3 }).observe(listaEtapas);
  } else {
    iniciarCiclo();
  }

  /* ========================================================
     7. TERMOS TÉCNICOS NO TEXTO — balão com explicação
     Marca automaticamente a 1ª vez que cada termo aparece em cada seção.
     Toque (celular), mouse (computador) ou teclado abrem o balão.
     ======================================================== */
  var NAO_MARCAR = 'a, button, h1, h2, h3, .linha__nome, label, script, style, svg, input, textarea, select, .termo-tecnico, .glossario-pop, #dic-lista, .barra-topo, .barra-menu, .cabecalho, .sobretitulo, .pilula, .rodape__titulo, .nota__legenda';
  var mapaVariantes = {};
  var listaVariantes = [];
  GLOSS.forEach(function (t) {
    (t.variantes || [t.nome]).forEach(function (v) { mapaVariantes[v.toLowerCase()] = t.id; listaVariantes.push(v); });
  });
  listaVariantes.sort(function (a, b) { return b.length - a.length; }); // as mais longas primeiro
  var regexTermos = listaVariantes.length ? new RegExp('(?<![\\p{L}\\p{N}])(' + listaVariantes.map(function (v) {
    return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|') + ')(?![\\p{L}\\p{N}])', 'giu') : null;

  function escopoDe(no) {
    var e = no.nodeType === 1 ? no : no.parentElement;
    return (e && e.closest('section, footer')) || document.body;
  }

  function marcarTermos(raiz) {
    if (!regexTermos || !raiz) return;
    var andador = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var pai = n.parentElement;
        if (!pai || pai.closest(NAO_MARCAR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nos = []; while (andador.nextNode()) nos.push(andador.currentNode);
    nos.forEach(function (n) {
      var texto = n.nodeValue, escopo = escopoDe(n), pedacos = [], ultimo = 0, m;
      regexTermos.lastIndex = 0;
      while ((m = regexTermos.exec(texto))) {
        var id = mapaVariantes[m[0].toLowerCase()];
        if (!id || escopo.querySelector('.termo-tecnico[data-termo="' + id + '"]') ||
            pedacos.some(function (p) { return p.id === id; })) continue;
        pedacos.push({ id: id, ini: m.index, fim: m.index + m[0].length });
      }
      if (!pedacos.length) return;
      var frag = document.createDocumentFragment();
      pedacos.forEach(function (p) {
        if (p.ini > ultimo) frag.appendChild(document.createTextNode(texto.slice(ultimo, p.ini)));
        frag.appendChild(el('button', { cls: 'termo-tecnico', text: texto.slice(p.ini, p.fim),
          attrs: { type: 'button', 'data-termo': p.id, 'aria-expanded': 'false', 'aria-haspopup': 'dialog',
                   title: '' } }));
        ultimo = p.fim;
      });
      if (ultimo < texto.length) frag.appendChild(document.createTextNode(texto.slice(ultimo)));
      n.parentNode.replaceChild(frag, n);
    });
  }

  /* ---------- O balão ---------- */
  var pop = el('div', { cls: 'glossario-pop', attrs: { role: 'dialog', 'aria-modal': 'false', hidden: '' } });
  document.body.appendChild(pop);
  var popTermo = null, popFixo = false, timerFechar = null, timerAbrir = null;
  var temMouse = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var fundoPop = el('div', { cls: 'glossario-fundo', attrs: { hidden: '' } });
  document.body.appendChild(fundoPop);
  function posicionar() {
    if (!popTermo || pop.hidden) return;
    if (ehCelular()) { pop.style.left = ''; pop.style.top = ''; return; }
    var r = popTermo.getBoundingClientRect(), m = 12, vw = window.innerWidth, vh = window.innerHeight;
    pop.style.left = '0px'; pop.style.top = '0px';
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(Math.max(m, r.left + r.width / 2 - pw / 2), vw - pw - m);
    var top = r.bottom + 10, acima = false;
    if (top + ph > vh - m && r.top - ph - 10 > m) { top = r.top - ph - 10; acima = true; }
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    pop.classList.toggle('glossario-pop--acima', acima);
    pop.style.setProperty('--seta-x', Math.min(Math.max(18, r.left + r.width / 2 - left), pw - 18) + 'px');
  }

  function abrir(termoEl, fixar, focarDentro) {
    var t = GLOSS_POR_ID[termoEl.getAttribute('data-termo')];
    if (!t) return;
    clearTimeout(timerFechar);
    if (popTermo && popTermo !== termoEl) popTermo.setAttribute('aria-expanded', 'false');
    pararFala();
    popTermo = termoEl; popFixo = !!fixar;
    limpar(pop);
    pop.setAttribute('aria-label', 'Explicação: ' + rotuloCurto(t));
    var fechar = el('button', { cls: 'glossario-pop__fechar', text: '×', attrs: { type: 'button', 'aria-label': 'Fechar explicação' },
      on: { click: function () { fecharPop(true); } } });
    var acoes = el('div', { cls: 'glossario-pop__acoes' });
    var ouvir = botaoOuvir(t); if (ouvir) acoes.appendChild(ouvir);
    if (TERMOS_DIC.some(function (d) { return d.id === t.id; }) && !termoEl.closest('#dicionario')) {
      acoes.appendChild(el('button', { cls: 'glossario-pop__link', text: 'Ver no dicionário', attrs: { type: 'button' },
        on: { click: function () { fecharPop(false); mostrarNoDicionario(t.id); } } }));
    }
    pop.appendChild(fechar);
    pop.appendChild(el('div', { cls: 'glossario-pop__nome', text: t.nome }));
    pop.appendChild(el('p', { cls: 'glossario-pop__def', text: t.def }));
    pop.appendChild(acoes);
    pop.classList.toggle('glossario-pop--folha', ehCelular());
    pop.hidden = false; fundoPop.hidden = !ehCelular();
    termoEl.setAttribute('aria-expanded', 'true');
    posicionar();
    if (focarDentro) fechar.focus({ preventScroll: true });
  }

  function fecharPop(devolverFoco) {
    clearTimeout(timerFechar); clearTimeout(timerAbrir);
    if (pop.hidden) return;
    pararFala();
    pop.hidden = true; fundoPop.hidden = true;
    if (popTermo) { popTermo.setAttribute('aria-expanded', 'false'); if (devolverFoco) popTermo.focus({ preventScroll: true }); }
    popTermo = null; popFixo = false;
  }

  // clique / toque / Enter / Espaço
  document.addEventListener('click', function (e) {
    var termo = e.target.closest && e.target.closest('.termo-tecnico');
    if (termo) {
      e.preventDefault(); e.stopPropagation();
      var viaTeclado = e.detail === 0;
      if (popTermo === termo && popFixo) fecharPop(viaTeclado); else abrir(termo, true, viaTeclado);
      return;
    }
    if (!pop.hidden && !pop.contains(e.target)) fecharPop(false);
  }, true);

  // mouse (só em computador): abre ao passar e fecha ao sair
  if (temMouse) {
    document.addEventListener('mouseover', function (e) {
      var termo = e.target.closest && e.target.closest('.termo-tecnico');
      if (termo) {
        clearTimeout(timerFechar);
        if (popTermo !== termo) { clearTimeout(timerAbrir); timerAbrir = setTimeout(function () { abrir(termo, false, false); }, 120); }
      } else if (pop.contains(e.target)) {
        clearTimeout(timerFechar);
      }
    });
    document.addEventListener('mouseout', function (e) {
      var de = e.target.closest && (e.target.closest('.termo-tecnico') || (pop.contains(e.target) ? pop : null));
      if (!de) return;
      var para = e.relatedTarget;
      if (para && (pop.contains(para) || (popTermo && popTermo.contains(para)))) return;
      clearTimeout(timerAbrir);
      if (!popFixo) timerFechar = setTimeout(function () { fecharPop(false); }, 250);
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !pop.hidden) { e.preventDefault(); fecharPop(true); }
  });
  window.addEventListener('scroll', function () { if (!pop.hidden) posicionar(); }, { passive: true });
  window.addEventListener('resize', function () { if (!pop.hidden) posicionar(); });

  // Textos que mudam com os cliques (despesas, quiz...) também ganham os balões
  var agendado = false;
  var principal = document.querySelector('main') || document.body;
  new MutationObserver(function () {
    if (agendado) return; agendado = true;
    requestAnimationFrame(function () { agendado = false; marcarTermos(principal); });
  }).observe(principal, { childList: true, subtree: true });

  /* ========================================================
     8. MENU DE BAIXO (celular) — destaca a seção atual
     ======================================================== */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-celular a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    var visiveis = {};
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) { visiveis[it.target.id] = it.isIntersecting ? it.intersectionRatio : 0; });
      var melhor = null, maior = 0;
      Object.keys(visiveis).forEach(function (id) { if (visiveis[id] > maior) { maior = visiveis[id]; melhor = id; } });
      links.forEach(function (a) { if (a.dataset.secao === melhor) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, .01, .25, .5, .75, 1] });
    links.forEach(function (a) { var s = document.getElementById(a.dataset.secao); if (s) obs.observe(s); });
  })();

  /* ---------- Início ---------- */
  /* Por área: no computador já abre; no celular fica recolhido para encurtar a página */
  (function () { var d = document.getElementById('areas-mais'); if (d && !ehCelular()) d.open = true; })();
  /* Preenche no HTML os valores por área */
  Array.prototype.forEach.call(document.querySelectorAll('.area[data-valor]'), function (e) {
    var v = e.querySelector('.area__valor'); if (v) v.textContent = formatar(+e.getAttribute('data-valor'), true);
  });
  desenharNota();
  desenharQuiz();
  desenharTermos();
  marcarTermos(document.querySelector('main'));
  marcarTermos(document.querySelector('footer'));

  /* Instalar como aplicativo e funcionar sem internet (só quando o site está publicado) */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (r) { r.update(); }).catch(function () {}); });
  }
})();
