/* Edite este arquivo para personalizar o site. Nenhuma informação é enviada ou armazenada. */
const ACADEMIA = {
  nome: "PULSE FITNESS",
  descricao: "Estrutura, movimento e motivação para o seu próximo nível.",
  cores: { primaria: "#E63946", fundo: "#080808" },
  contatos: { whatsapp: "", instagram: "", facebook: "" },
  convenios: {
    ativo: true,
    parceriaConfirmada: false,
    plataformas: ["Wellhub", "TotalPass"],
  },
  unidades: [
    {
      id: "gloria",
      nome: "Glória",
      chamada: "Seu próximo nível tem lugar.",
      descricao:
        "Força, foco e uma estrutura completa para fazer de cada treino uma evolução.",
      endereco: "",
      telefone: "",
      horarios: "",
      mapsEmbedUrl: "",
      imagemHero: "assets/images/hero-gloria.webp",
      imagem: "assets/images/gym.webp",
      altHero:
        "Fotografia ilustrativa de um atleta preparando um levantamento de barra.",
      modalidades: ["Musculação", "Funcional", "Aulas coletivas", "Cardio"],
      precos: {
        mensal: { start: 89.9, pro: 119.9, max: 149.9 },
        trimestral: { start: 84.9, pro: 114.9, max: 144.9 },
        anual: { start: 79.9, pro: 109.9, max: 139.9 },
      },
    },
    {
      id: "laguna",
      nome: "Laguna",
      chamada: "Mais espaço para ir além.",
      descricao:
        "Encontre seu ritmo em um ambiente de treino que inspira movimento e constância.",
      endereco: "",
      telefone: "",
      horarios: "",
      mapsEmbedUrl: "",
      imagemHero: "assets/images/hero-laguna.webp",
      imagem: "assets/images/equipment.webp",
      altHero:
        "Fotografia ilustrativa de uma academia com equipamentos e pesos livres.",
      modalidades: ["Musculação", "Cardio", "Mobilidade", "Condicionamento"],
      precos: {
        mensal: { start: 89.9, pro: 119.9, max: 149.9 },
        trimestral: { start: 86.9, pro: 116.9, max: 146.9 },
        anual: { start: 82.9, pro: 112.9, max: 142.9 },
      },
    },
  ],
  periodos: {
    mensal: {
      nome: "Mensal",
      meses: 1,
      descricao: "Compromisso de 1 mês",
      botao: "Quero este plano",
    },
    trimestral: {
      nome: "Trimestral",
      meses: 3,
      descricao: "Compromisso de 3 meses",
      botao: "Quero o trimestral",
    },
    anual: {
      nome: "Anual",
      meses: 12,
      descricao: "Compromisso de 12 meses",
      botao: "Quero o anual",
    },
  },
  planos: [
    {
      id: "start",
      nome: "Start",
      frase: "O primeiro passo é seu.",
      icon: "activity",
      beneficios: [
        "Acesso à musculação",
        "Horários disponíveis",
        "Avaliação inicial",
        "Suporte da equipe",
      ],
    },
    {
      id: "pro",
      nome: "Pro",
      frase: "Mais possibilidades. Mais movimento.",
      icon: "bolt",
      destaque: true,
      beneficios: [
        "Acesso à musculação",
        "Aulas coletivas",
        "Acompanhamento da equipe",
        "Benefícios exclusivos",
      ],
    },
    {
      id: "max",
      nome: "Max",
      frase: "Viva a experiência completa.",
      icon: "shield",
      beneficios: [
        "Acesso à musculação",
        "Aulas coletivas",
        "Benefícios adicionais",
        "Experiência completa",
      ],
    },
  ],
  modalidades: [
    {
      id: "musculacao",
      nome: "Musculação",
      categoria: "FORÇA & DISCIPLINA",
      imagem: "assets/images/strength.webp",
      icon: "dumbbell",
      descricao: "Construa uma rotina de força, um treino de cada vez.",
      detalhe:
        "Exemplo de modalidade com exercícios de resistência, pesos livres e equipamentos. Na versão oficial, consulte a equipe para conhecer o acompanhamento e os horários da sua unidade.",
    },
    {
      id: "funcional",
      nome: "Treinamento funcional",
      categoria: "MOVIMENTO & ENERGIA",
      imagem: "assets/images/functional.webp",
      icon: "activity",
      descricao: "Movimentos que desafiam e dão ritmo ao seu dia.",
      detalhe:
        "Exemplo de treino com movimentos variados e circuitos. A disponibilidade, a dinâmica e o acompanhamento deverão ser confirmados com a unidade.",
    },
    {
      id: "coletivas",
      nome: "Aulas coletivas",
      categoria: "RITMO & CONEXÃO",
      imagem: "assets/images/classes.webp",
      icon: "users",
      descricao: "A energia do grupo transforma o treino.",
      detalhe:
        "Espaço demonstrativo para aulas em grupo. A versão oficial poderá apresentar a grade de aulas, os níveis e os horários de cada unidade.",
    },
    {
      id: "cardio",
      nome: "Treino cardiovascular",
      categoria: "FOCO & CONSTÂNCIA",
      imagem: "assets/images/cardio.webp",
      icon: "heart",
      descricao: "Encontre o ritmo que combina com você.",
      detalhe:
        "Exemplo de espaço para exercícios cardiovasculares. Equipamentos, orientação e condições de acesso devem ser confirmados na academia oficial.",
    },
    {
      id: "mobilidade",
      nome: "Alongamento e mobilidade",
      categoria: "EQUILÍBRIO & CONTROLE",
      imagem: "assets/images/mobility.webp",
      icon: "stretch",
      descricao: "Uma pausa para se mover com mais consciência.",
      detalhe:
        "Exemplo de atividades de alongamento e mobilidade. A intensidade e os exercícios devem ser definidos com acompanhamento adequado na versão oficial.",
    },
    {
      id: "condicionamento",
      nome: "Condicionamento físico",
      categoria: "DESAFIO & EVOLUÇÃO",
      imagem: "assets/images/conditioning.webp",
      icon: "bolt",
      descricao: "Novos desafios para a sua rotina de movimento.",
      detalhe:
        "Modalidade ilustrativa com exercícios variados. Consulte a unidade para conhecer os programas e a orientação disponíveis na versão oficial.",
    },
  ],
  galeria: [
    {
      nome: "Área de musculação",
      unidade: "gloria",
      imagem: "assets/images/gym.webp",
      alt: "Sala ilustrativa de musculação com estações de treino.",
    },
    {
      nome: "Equipamentos",
      unidade: "laguna",
      imagem: "assets/images/equipment.webp",
      alt: "Equipamentos ilustrativos em uma sala ampla de academia.",
    },
    {
      nome: "Área de pesos livres",
      unidade: "gloria",
      imagem: "assets/images/strength.webp",
      alt: "Atleta em treino ilustrativo com pesos livres.",
    },
    {
      nome: "Espaço cardiovascular",
      unidade: "laguna",
      imagem: "assets/images/cardio.webp",
      alt: "Fotografia ilustrativa de uma atleta em treino cardiovascular.",
    },
    {
      nome: "Ambiente de treinamento",
      unidade: "gloria",
      imagem: "assets/images/functional.webp",
      alt: "Ambiente ilustrativo para treinamento funcional.",
    },
    {
      nome: "Vestiários",
      unidade: "laguna",
      imagem: "assets/images/lockers.webp",
      alt: "Armários ilustrativos de um vestiário.",
    },
  ],
  estruturaExtras: ["Espaços apresentados como exemplos de estrutura"],
  professores: [
    {
      nome: "Rafael Costa",
      especialidade: "Musculação & força",
      unidade: "gloria",
      imagem: "assets/images/coach-three.webp",
      descricao:
        "Um exemplo de acompanhamento próximo para construir uma rotina de treino.",
    },
    {
      nome: "Marina Alves",
      especialidade: "Funcional & movimento",
      unidade: "laguna",
      imagem: "assets/images/coach-two.webp",
      descricao:
        "Um exemplo de orientação para encontrar movimento, ritmo e constância.",
    },
    {
      nome: "Renata Mendes",
      especialidade: "Condicionamento físico",
      unidade: "gloria",
      imagem: "assets/images/coach-one.webp",
      descricao:
        "Um exemplo de motivação e suporte para os desafios de cada treino.",
    },
  ],
  depoimentos: [
    {
      nome: "Camila R.",
      texto:
        "Ter um espaço para treinar faz parte do tempo que escolho reservar para mim.",
    },
    {
      nome: "André M.",
      texto:
        "Gosto da ideia de encontrar opções de treino que acompanhem o meu ritmo.",
    },
    {
      nome: "Juliana S.",
      texto:
        "Um ambiente acolhedor e uma equipe por perto fazem diferença na rotina.",
    },
  ],
  faq: [
    {
      pergunta: "Como faço minha matrícula?",
      resposta:
        "Escolha uma unidade e um plano para visualizar a demonstração. Na versão oficial, o botão poderá direcionar para o atendimento da academia. Este site não realiza matrículas nem pagamentos.",
    },
    {
      pergunta: "Posso conhecer a academia antes de me matricular?",
      resposta:
        "Esta demonstração prevê contato com a unidade para consultar visitas. Regras de agendamento e disponibilidade serão informadas pela academia na versão oficial.",
    },
    {
      pergunta: "Quais são os horários de funcionamento?",
      resposta:
        "Os horários de cada unidade ainda não foram configurados. Quando confirmados, estarão disponíveis na seção Unidades.",
    },
    {
      pergunta: "Existe plano mensal?",
      resposta:
        "Sim, o layout apresenta exemplos mensais, trimestrais e anuais. Todos os valores e condições são ilustrativos e não constituem uma oferta comercial.",
    },
    {
      pergunta: "Quais modalidades estão disponíveis?",
      resposta:
        "As modalidades exibidas são exemplos de conteúdo. Selecione uma unidade para visualizar sua composição demonstrativa. A disponibilidade real deve ser confirmada com a academia.",
    },
    {
      pergunta: "Posso escolher minha unidade?",
      resposta:
        "Sim. Use o seletor Glória ou Laguna no início do site ou na seção Unidades. A escolha atualiza o Hero, os planos e as informações de contato.",
    },
    {
      pergunta: "Como funcionam os convênios?",
      resposta:
        "Wellhub e TotalPass aparecem apenas como exemplos de apresentação. Não há parceria oficial confirmada nesta demonstração. Elegibilidade, plano e disponibilidade dependem da plataforma e da unidade.",
    },
  ],
};
