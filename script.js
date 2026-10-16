/* ==========================================================
   Orçamento Popular de Maceió 2027 — interações
   Todos os valores vêm da proposta (PLOA 2027) e demonstrativos oficiais.
   ========================================================== */
(function () {
  'use strict';

  var COR = { marinho: '#173E75', laranja: '#F39D0F', azul: '#036BAC', cinza: '#9FB3C6', branco: '#FFFFFF' };

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

  /* ========================================================
     1. DE CADA R$ 100
     ======================================================== */
  var PARTES = [
    { id: 'manter', peso: 78, cor: COR.marinho, corTexto: COR.branco, curto: 'R$ 78', reais: 'R$ 78',
      titulo: 'Manter a cidade funcionando', total: 'R$ 4,81 bilhões', oficial: 'despesas correntes',
      desc: 'Paga o dia a dia: pessoal, funcionamento de escolas, postos e outras unidades, contratos e serviços. Também inclui despesas como juros da dívida.',
      conferido: true },
    { id: 'investir', peso: 17, cor: COR.laranja, corTexto: COR.marinho, curto: 'R$ 17', reais: 'R$ 17',
      titulo: 'Investir na cidade', total: 'R$ 1,03 bilhão', oficial: 'investimentos',
      desc: 'Obras, compra de equipamentos e melhorias que ampliam ou modernizam os serviços públicos. É parte do total, não um dinheiro extra.',
      conferido: true },
    { id: 'reserva', peso: 2, cor: COR.azul, corTexto: COR.branco, curto: '', reais: 'R$ 2',
      titulo: 'Guardar para imprevistos', total: 'R$ 113,15 milhões', oficial: 'reserva de contingência',
      desc: 'Uma parte fica guardada para riscos e necessidades que ninguém consegue prever, conforme as regras legais. Pode nem ser gasta.',
      conferido: true },
    { id: 'outras', peso: 3, cor: COR.cinza, corTexto: COR.marinho, curto: '', reais: 'R$ 3',
      titulo: 'Pagar a dívida e a previdência', total: 'R$ 208,91 milhões', oficial: 'amortização da dívida e reserva do RPPS',
      desc: 'Paga as parcelas de empréstimos já feitos pela cidade (R$ 148,9 milhões) e guarda uma reserva para a previdência dos servidores municipais (R$ 60 milhões).',
      conferido: true }
  ];

  var notaBarra = document.getElementById('nota-barra');
  var notaBotoes = document.getElementById('nota-botoes');
  var notaDetalhe = document.getElementById('nota-detalhe');
  var parteAtual = 'manter';

  function desenharNota() {
    limpar(notaBarra);
    limpar(notaBotoes);
    PARTES.forEach(function (p) {
      var ativa = p.id === parteAtual;
      // Fatia da barra: sem número dentro, clicável (os botões abaixo seguem como opção pelo teclado)
      notaBarra.appendChild(el('button', {
        cls: 'nota__fatia' + (ativa ? ' ativa' : ''),
        attrs: { type: 'button', tabindex: '-1', 'aria-label': p.reais + ' · ' + p.titulo, title: p.reais + ' · ' + p.titulo },
        style: { flex: p.peso + ' 1 0px', background: p.cor },
        on: { click: function () { parteAtual = p.id; desenharNota(); } }
      }));
      notaBotoes.appendChild(el('button', {
        cls: 'parte', attrs: { type: 'button', 'aria-pressed': ativa ? 'true' : 'false' },
        on: { click: function () { parteAtual = p.id; desenharNota(); } }
      }, [
        el('span', { cls: 'parte__cor', style: { background: p.cor } }),
        el('span', { cls: 'parte__textos' }, [
          el('span', { cls: 'parte__valor', text: p.reais }),
          el('span', { cls: 'parte__nome', text: p.titulo })
        ])
      ]));
    });

    var p = PARTES.filter(function (x) { return x.id === parteAtual; })[0];
    limpar(notaDetalhe);
    notaDetalhe.appendChild(el('div', { cls: 'detalhe__esq' }, [
      el('div', { cls: 'detalhe__rotulo', text: p.reais + ' DE CADA R$ 100' }),
      el('div', { cls: 'detalhe__total', text: p.total }),
      el('span', { cls: 'selo ' + (p.conferido ? 'selo--ok' : 'selo--espera'), text: p.conferido ? 'Dado conferido' : 'Em conferência' })
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
     2. LUPA — Câmara e Emendas Cidadãs em escala
     ======================================================== */
  var NIVEIS = [
    { escala: 'Escala: o orçamento inteiro = R$ 100',
      fatias: [{ w: '2.4%', cor: COR.laranja, txt: '' }],
      texto: 'A Câmara Municipal fica com cerca de R$ 2,38 de cada R$ 100 (a faixa laranja). As Emendas Cidadãs nem aparecem nesta escala.' },
    { escala: 'Escala ampliada: R$ 10 do orçamento',
      fatias: [{ w: '23.8%', cor: COR.laranja, txt: 'Câmara · R$ 2,38' }, { w: '0.5%', cor: COR.azul, txt: '' }],
      texto: 'Ampliando 10 vezes, a Câmara fica bem visível. As Emendas Cidadãs surgem como um risquinho azul ao lado.' },
    { escala: 'Escala ampliada: R$ 1 do orçamento',
      fatias: [{ w: '5%', cor: COR.azul, txt: '' }],
      texto: 'Ampliando até uma moeda de R$ 1, as Emendas Cidadãs finalmente aparecem (a faixa azul): são cerca de 5 centavos de cada R$ 100. Ou seja, R$ 3,13 milhões dentro de R$ 6,16 bilhões.' }
  ];
  var nivel = 0;
  var lupaMais = document.getElementById('lupa-mais');
  var lupaMenos = document.getElementById('lupa-menos');

  function desenharLupa() {
    if (!lupaMais || !lupaMenos) return;
    var n = NIVEIS[nivel];
    document.getElementById('lupa-escala').textContent = n.escala;
    document.getElementById('lupa-nivel').textContent = 'Nível ' + (nivel + 1) + ' de 3';
    document.getElementById('lupa-texto').textContent = n.texto;
    var barra = document.getElementById('lupa-barra');
    limpar(barra);
    n.fatias.forEach(function (f) {
      barra.appendChild(el('div', { cls: 'lupa__fatia', text: f.txt, style: { width: f.w, background: f.cor } }));
    });
    lupaMenos.disabled = nivel === 0;
    lupaMais.disabled = nivel === NIVEIS.length - 1;
  }
  // A seção da lupa pode estar fora da página (seção "Câmara e emendas" removida por enquanto)
  if (lupaMais && lupaMenos) {
    lupaMais.addEventListener('click', function () { if (nivel < NIVEIS.length - 1) { nivel++; desenharLupa(); } });
    lupaMenos.addEventListener('click', function () { if (nivel > 0) { nivel--; desenharLupa(); } });
  }

  /* ========================================================
     3. MONTE O SEU ORÇAMENTO
     ======================================================== */
  var CATEGORIAS = [
    { id: 'manter', nome: 'Manter os serviços', cor: COR.marinho, real: 78 },
    { id: 'investir', nome: 'Investir na cidade', cor: COR.laranja, real: 17 },
    { id: 'reserva', nome: 'Guardar para imprevistos', cor: COR.azul, real: 2 },
    { id: 'outras', nome: 'Dívida e previdência', cor: COR.cinza, real: 3 }
  ];
  var PASSO = 5;
  var meu = {};
  var comparado = false;

  function zerarMeu() { CATEGORIAS.forEach(function (c) { meu[c.id] = 25; }); comparado = false; }
  function soma() { return CATEGORIAS.reduce(function (a, c) { return a + meu[c.id]; }, 0); }

  function desenharMonte() {
    var lista = document.getElementById('monte-lista');
    var barra = document.getElementById('monte-barra');
    var restante = 100 - soma();
    limpar(lista);
    limpar(barra);

    CATEGORIAS.forEach(function (c) {
      var nome = el('div', { cls: 'linha__nome', text: c.nome });
      if (comparado) nome.appendChild(el('div', { cls: 'linha__real', text: 'Na proposta: R$ ' + c.real }));
      lista.appendChild(el('div', { cls: 'linha' }, [
        el('span', { cls: 'linha__cor', style: { background: c.cor } }),
        nome,
        el('div', { cls: 'linha__controles' }, [
          el('button', { cls: 'passo passo--menos', text: '−',
            attrs: { type: 'button', 'aria-label': 'Tirar R$ ' + PASSO + ' de ' + c.nome },
            on: { click: function () { if (meu[c.id] > 0) { meu[c.id] = Math.max(0, meu[c.id] - PASSO); comparado = false; desenharMonte(); } } } }),
          el('div', { cls: 'linha__valor', text: 'R$ ' + meu[c.id] }),
          el('button', { cls: 'passo passo--mais', text: '+',
            attrs: { type: 'button', 'aria-label': 'Colocar R$ ' + PASSO + ' em ' + c.nome },
            on: { click: function () { var add = Math.min(PASSO, 100 - soma()); if (add > 0) { meu[c.id] += add; comparado = false; desenharMonte(); } } } })
        ])
      ]));
      barra.appendChild(el('div', { style: { width: meu[c.id] + '%', background: c.cor } }));
    });

    document.getElementById('monte-restante').textContent = 'R$ ' + restante;
    var btnComparar = document.getElementById('monte-comparar');
    btnComparar.disabled = restante !== 0;
    btnComparar.classList.toggle('pronto', restante === 0 && !comparado);

    var msg = document.getElementById('monte-msg');
    if (comparado) {
      var dif = meu.investir - 17;
      var inicio = dif > 0 ? 'Você colocaria mais em investimentos do que a proposta. '
        : dif < 0 ? 'Você colocaria menos em investimentos do que a proposta. '
        : 'Você acertou em cheio os investimentos! ';
      msg.textContent = inicio + 'Na proposta, a maior parte (R$ 78) mantém os serviços que já existem, porque escolas, postos e coleta precisam funcionar todo dia.';
      msg.hidden = false;
    } else {
      msg.hidden = true;
    }
  }
  document.getElementById('monte-comparar').addEventListener('click', function () { comparado = true; desenharMonte(); });
  document.getElementById('monte-recomecar').addEventListener('click', function () { zerarMeu(); desenharMonte(); });

  /* ========================================================
     4. QUIZ — chute e descubra
     ======================================================== */
  var PERGUNTAS = [
    { p: 'De cada R$ 100 do orçamento, quanto vai para obras e investimentos?', op: ['R$ 5', 'R$ 17', 'R$ 50'], certa: 1,
      exp: 'São cerca de R$ 17 de cada R$ 100, ou R$ 1,03 bilhão. A maior parte, R$ 78, mantém os serviços funcionando.' },
    { p: 'Os R$ 6,16 bilhões já estão no caixa da Prefeitura?', op: ['Sim, já estão guardados', 'Não, é uma previsão para 2027'], certa: 1,
      exp: 'É uma previsão para o ano todo. O dinheiro entra aos poucos, e parte dele já tem uso definido por lei.' },
    { p: 'Se uma obra aparece no orçamento, ela já está garantida?', op: ['Sim, está garantida', 'Não, ainda depende de outras etapas'], certa: 1,
      exp: 'Estar no orçamento é o primeiro passo. A obra ainda depende de o dinheiro entrar, de projeto e de contratação.' },
    { p: 'Quem aprova o orçamento da cidade?', op: ['O prefeito, sozinho', 'Os vereadores, na Câmara', 'O Governo do Estado'], certa: 1,
      exp: 'A Prefeitura propõe, os vereadores discutem, podem mudar e votam. Depois o prefeito sanciona e o orçamento vira lei.' },
    { p: 'O dinheiro da Câmara é o mesmo das emendas dos vereadores?', op: ['Sim, é o mesmo dinheiro', 'Não, são coisas diferentes'], certa: 1,
      exp: 'O orçamento da Câmara mantém o funcionamento dela. As emendas indicam onde aplicar recursos, e quem executa é a Prefeitura.' }
  ];
  var quiz = { atual: 0, escolhida: null, pontos: 0, fim: false };
  var caixa = document.getElementById('quiz-caixa');
  var barco = document.getElementById('quiz-barco');

  var BARCO_SVG = '<svg viewBox="0 0 48 44" aria-hidden="true"><path d="M10 34 C16 20 20 10 24 4 C28 14 32 24 38 34" fill="none" stroke="#F39D0F" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 36 C18 40 32 40 44 35 C38 42 14 43 4 36 Z" fill="#FFFFFF"/></svg>';

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
          el('a', { cls: 'btn btn--laranja', text: 'Participar no Participa Maceió ↗',
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

  function desenharTermos() {
    var lista = document.getElementById('termos');
    var def = document.getElementById('termo-def');
    if (!lista || !def || !TERMOS_DIC.length) return;
    limpar(lista);
    TERMOS_DIC.forEach(function (t, i) {
      lista.appendChild(el('button', { cls: 'termo', text: rotuloCurto(t),
        attrs: { type: 'button', 'aria-pressed': i === termoAtual ? 'true' : 'false' },
        on: { click: function () { termoAtual = i; pararFala(); desenharTermos(); } } }));
    });
    var t = TERMOS_DIC[termoAtual];
    limpar(def);
    def.appendChild(el('h3', { text: t.nome }));
    def.appendChild(el('p', { text: t.def }));
    var ouvir = botaoOuvir(t);
    if (ouvir) def.appendChild(el('div', { cls: 'termo-def__acoes' }, [ouvir]));
  }

  function mostrarNoDicionario(id) {
    var i = TERMOS_DIC.findIndex(function (t) { return t.id === id; });
    if (i < 0) return;
    termoAtual = i; desenharTermos();
    var secao = document.getElementById('dicionario');
    if (secao) secao.scrollIntoView({ behavior: semMovimentoGlobal() ? 'auto' : 'smooth', block: 'start' });
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
    u.lang = 'pt-BR'; if (vozPt) u.voice = vozPt; u.rate = 0.95;
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
  var NAO_MARCAR = 'a, button, h1, h2, label, script, style, svg, input, textarea, select, .termo-tecnico, .glossario-pop, #termos, #termo-def, .barra-topo, .barra-menu, .cabecalho, .sobretitulo, .pilula, .rodape__titulo, .nota__legenda';
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

  function posicionar() {
    if (!popTermo || pop.hidden) return;
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
    pop.hidden = false;
    termoEl.setAttribute('aria-expanded', 'true');
    posicionar();
    if (focarDentro) fechar.focus({ preventScroll: true });
  }

  function fecharPop(devolverFoco) {
    clearTimeout(timerFechar); clearTimeout(timerAbrir);
    if (pop.hidden) return;
    pararFala();
    pop.hidden = true;
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

  // Textos que mudam com os cliques (nota, lupa, quiz...) também ganham os balões
  var agendado = false;
  var principal = document.querySelector('main') || document.body;
  new MutationObserver(function () {
    if (agendado) return; agendado = true;
    requestAnimationFrame(function () { agendado = false; marcarTermos(principal); });
  }).observe(principal, { childList: true, subtree: true });

  /* ---------- Início ---------- */
  zerarMeu();
  desenharNota();
  desenharLupa();
  desenharMonte();
  desenharQuiz();
  desenharTermos();
  marcarTermos(document.querySelector('main'));
  marcarTermos(document.querySelector('footer'));
})();
