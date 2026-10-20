/* ==========================================================
   GLOSSÁRIO DO ORÇAMENTO — fonte única dos termos técnicos
   ----------------------------------------------------------
   Este arquivo alimenta:
     • os balões que aparecem ao tocar/passar o mouse nos termos do texto;
     • a seção "Dicionário do orçamento".

   Como editar (sem precisar mexer no resto do código):
     id        → identificador único, sem espaço nem acento.
     nome      → como o termo aparece no título do balão (nome técnico primeiro).
     falar     → como o termo deve ser lido em voz alta (siglas por extenso).
     variantes → formas como o termo aparece no texto do site. O site marca
                 automaticamente a primeira vez que cada termo aparece em cada seção.
                 Maiúsculas e minúsculas não importam.
     def       → explicação em até duas frases, com palavras do dia a dia.
     mostrarNoDicionario → false para esconder da lista do Dicionário (opcional).

   Revisão técnica: [NOME DA PESSOA / SETOR] · [DATA DA REVISÃO]
   ========================================================== */
window.GLOSSARIO = [
  { id: 'orcamento-publico', nome: 'Orçamento público', falar: 'Orçamento público',
    variantes: ['orçamento público', 'orçamentos públicos', 'orçamento', 'orçamentos'],
    def: 'O planejamento de quanto dinheiro a Prefeitura espera arrecadar no ano e de como vai usar esse dinheiro. É aprovado por lei e vale por um ano.' },

  { id: 'ppa', nome: 'PPA · Plano Plurianual', falar: 'Plano Plurianual',
    variantes: ['PPA', 'Plano Plurianual'],
    def: 'O plano da cidade para quatro anos, com os programas e objetivos da gestão. Os orçamentos de cada ano seguem esse plano.' },

  { id: 'ldo', nome: 'LDO · Lei de Diretrizes Orçamentárias', falar: 'Lei de Diretrizes Orçamentárias',
    variantes: ['LDO', 'Lei de Diretrizes Orçamentárias'],
    def: 'A lei que define as metas, as prioridades e as regras para montar o orçamento do ano seguinte. É aprovada antes da LOA.' },

  { id: 'ploa', nome: 'PLOA · Projeto de Lei Orçamentária Anual', falar: 'Projeto de Lei Orçamentária Anual',
    variantes: ['PLOA', 'Projeto de Lei Orçamentária Anual', 'Projeto de Lei Orçamentária'],
    def: 'A proposta de orçamento que a Prefeitura envia à Câmara Municipal. Os vereadores analisam, podem fazer mudanças e votam.' },

  { id: 'loa', nome: 'LOA · Lei Orçamentária Anual', falar: 'Lei Orçamentária Anual',
    variantes: ['LOA', 'Lei Orçamentária Anual'],
    def: 'O orçamento depois de aprovado pela Câmara e sancionado pelo prefeito. Diz quanto a cidade pode gastar no ano e em quê.' },

  { id: 'sancao', nome: 'Sanção', falar: 'Sanção',
    variantes: ['sanção', 'sancionada', 'sancionado', 'sanciona'],
    def: 'Quando o prefeito assina a lei aprovada pela Câmara. A partir daí, ela passa a valer.' },

  { id: 'despesas-correntes', nome: 'Despesas correntes', falar: 'Despesas correntes',
    variantes: ['despesas correntes', 'despesa corrente'],
    def: 'O dinheiro que mantém a cidade funcionando todo dia, como salários, remédios, merenda escolar e contratos de serviços.' },

  { id: 'despesa-pessoal', nome: 'Despesa com pessoal', falar: 'Despesa com pessoal',
    variantes: ['pessoal e encargos sociais', 'despesa com pessoal', 'despesas com pessoal'],
    def: 'Salários e encargos dos servidores da Prefeitura, como professores e profissionais de saúde, e também aposentadorias e pensões. A lei limita quanto a cidade pode gastar com pessoal.' },

  { id: 'custeio', nome: 'Custeio', falar: 'Custeio',
    variantes: ['outras despesas correntes', 'custeio'],
    def: 'Os gastos que mantêm os serviços funcionando no dia a dia, além dos salários: contratos, materiais, merenda, remédios, energia e manutenção.' },

  { id: 'divida-publica', nome: 'Dívida pública', falar: 'Dívida pública',
    variantes: ['dívida pública', 'dívida'],
    def: 'O que a cidade deve por empréstimos feitos para obras e outros projetos. Pagar a dívida envolve duas partes: os juros e a amortização.' },

  { id: 'operacoes-credito', nome: 'Operações de crédito', falar: 'Operações de crédito',
    variantes: ['operações de crédito', 'operação de crédito'],
    def: 'Empréstimos que a cidade pega com bancos ou outras instituições, em geral para obras. Precisam seguir os limites da lei e ser pagos com juros.' },

  { id: 'receita-intraorcamentaria', nome: 'Receitas intraorçamentárias', falar: 'Receitas intraorçamentárias',
    variantes: ['receitas intraorçamentárias', 'intraorçamentárias'],
    def: 'Dinheiro que passa de um órgão para outro dentro da própria Prefeitura, como a contribuição que ela paga à previdência dos servidores.' },

  { id: 'investimentos', nome: 'Investimentos', falar: 'Investimentos',
    variantes: ['investimentos'],
    def: 'Gastos com obras e compra de equipamentos que deixam algo novo ou melhor para a cidade, como uma escola, uma praça ou uma ambulância.' },

  { id: 'reserva-contingencia', nome: 'Reserva de contingência', falar: 'Reserva de contingência',
    variantes: ['reserva de contingência'],
    def: 'Dinheiro guardado no orçamento para despesas imprevistas e riscos. Em Maceió, ela também guarda a reserva parlamentar, o espaço das emendas que os vereadores vão indicar.' },

  { id: 'rcl', nome: 'RCL · Receita Corrente Líquida', falar: 'Receita Corrente Líquida',
    variantes: ['RCL', 'Receita Corrente Líquida'],
    def: 'Uma conta oficial do dinheiro que a cidade arrecada, com alguns descontos previstos em lei. Serve de base para calcular limites, como o das emendas e o de gastos com pessoal; não é o total do orçamento.' },

  { id: 'vinculacao', nome: 'Vinculação de receitas', falar: 'Vinculação de receitas',
    variantes: ['vinculação de receitas', 'receitas vinculadas', 'vinculação'],
    def: 'Quando a lei determina que uma parte do dinheiro só pode ser usada em uma área, como saúde ou educação. Esse dinheiro não pode ir para outra coisa.' },

  { id: 'transferencias', nome: 'Transferências', falar: 'Transferências',
    variantes: ['transferências correntes', 'transferências de capital', 'transferências'],
    def: 'Dinheiro que a cidade recebe de outros governos, como a União e o Estado, por exemplo para a saúde e a educação.' },

  { id: 'emendas-impositivas', nome: 'Emendas impositivas', falar: 'Emendas impositivas',
    variantes: ['emendas impositivas', 'emendas parlamentares impositivas', 'emenda impositiva', 'emendas parlamentares'],
    def: 'Indicações que os vereadores fazem no orçamento para aplicar recursos em ações específicas. A Prefeitura é obrigada a executá-las, salvo impedimento técnico.' },

  { id: 'emendas-cidadas', nome: 'Emendas Cidadãs', falar: 'Emendas Cidadãs',
    variantes: ['Emendas Cidadãs', 'Emenda Cidadã'],
    def: 'Ações incluídas no orçamento ligadas às prioridades indicadas pela população.' },

  { id: 'duodecimo', nome: 'Duodécimo', falar: 'Duodécimo',
    variantes: ['duodécimo', 'duodécimos'],
    def: 'O repasse mensal que a Prefeitura faz à Câmara para ela funcionar: o orçamento da Câmara dividido em doze partes, entregue até o dia 20 de cada mês.' },

  { id: 'funcoes-governo', nome: 'Funções de governo', falar: 'Funções de governo',
    variantes: ['funções de governo'],
    def: 'A forma oficial de dividir o orçamento por áreas, como saúde, educação e urbanismo. Todas as prefeituras do país usam a mesma lista.' },

  { id: 'encargos-especiais', nome: 'Encargos especiais', falar: 'Encargos especiais',
    variantes: ['encargos especiais'],
    def: 'Gastos que não pertencem a uma área específica, como o pagamento da dívida e outras obrigações financeiras da cidade.' },

  { id: 'juros-divida', nome: 'Juros da dívida', falar: 'Juros da dívida',
    variantes: ['juros e encargos da dívida', 'juros da dívida'],
    def: 'O custo de ter pegado dinheiro emprestado. É pago junto com as parcelas do empréstimo.' },

  { id: 'amortizacao', nome: 'Amortização da dívida', falar: 'Amortização da dívida',
    variantes: ['amortização da dívida', 'amortização'],
    def: 'O pagamento das parcelas de empréstimos que a cidade já fez, sem contar os juros.' },

  { id: 'rpps', nome: 'RPPS · Regime Próprio de Previdência Social', falar: 'Regime Próprio de Previdência Social',
    variantes: ['RPPS', 'Regime Próprio de Previdência Social'],
    def: 'O sistema de aposentadorias e pensões dos servidores públicos municipais, separado do INSS.' },

  { id: 'execucao', nome: 'Execução orçamentária', falar: 'Execução orçamentária',
    variantes: ['execução orçamentária', 'execução do orçamento'],
    def: 'O orçamento saindo do papel ao longo do ano: quanto do que foi planejado está, de fato, sendo gasto.' },

  { id: 'empenho', nome: 'Empenho', falar: 'Empenho',
    variantes: ['empenho', 'empenhado', 'empenhada'],
    def: 'O primeiro passo para gastar: a Prefeitura reserva uma parte do orçamento para pagar uma compra ou um serviço específico.' },

  { id: 'liquidacao', nome: 'Liquidação', falar: 'Liquidação',
    variantes: ['liquidação', 'liquidada', 'liquidado'],
    def: 'A conferência de que o serviço foi feito ou o produto foi entregue. Só depois disso a Prefeitura pode pagar.' },

  { id: 'portal-transparencia', nome: 'Portal da Transparência', falar: 'Portal da Transparência',
    variantes: ['Portal da Transparência'],
    def: 'O site da Prefeitura onde qualquer pessoa pode ver quanto foi arrecadado e gasto, com detalhes de contratos e pagamentos.' }
];
