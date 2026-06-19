const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const baseUrl = 'https://myspellinggame.com';
const ogImage = `${baseUrl}/images/my-spelling-game-og.png`;
const today = '2026-06-19';

const languages = [
  { code: 'en', htmlLang: 'en', hreflang: 'en', label: 'English', dir: '', nav: 'Language', home: 'Home', privacy: 'Privacy', about: 'About', contact: 'Contact' },
  { code: 'es', htmlLang: 'es', hreflang: 'es', label: 'Español', dir: 'es', nav: 'Idioma', home: 'Inicio', privacy: 'Privacidad', about: 'Acerca de', contact: 'Contacto' },
  { code: 'pt-BR', htmlLang: 'pt-BR', hreflang: 'pt-BR', label: 'Português', dir: 'pt-br', nav: 'Idioma', home: 'Início', privacy: 'Privacidade', about: 'Sobre', contact: 'Contato' },
  { code: 'fr', htmlLang: 'fr', hreflang: 'fr', label: 'Français', dir: 'fr', nav: 'Langue', home: 'Accueil', privacy: 'Confidentialité', about: 'À propos', contact: 'Contact' },
  { code: 'id', htmlLang: 'id', hreflang: 'id', label: 'Bahasa Indonesia', dir: 'id', nav: 'Bahasa', home: 'Beranda', privacy: 'Privasi', about: 'Tentang', contact: 'Kontak' },
  { code: 'zh', htmlLang: 'zh-CN', hreflang: 'zh-CN', label: '中文', dir: 'zh', nav: '语言', home: '首页', privacy: '隐私', about: '关于', contact: '联系' },
];

const seoSlugs = [
  'custom-spelling-words-game',
  'spelling-list-game',
  'weekly-spelling-practice',
  'homeschool-spelling-practice',
  'sight-word-typing-game',
  'vocabulary-typing-game',
];
const footerSlugs = [
  'custom-spelling-words-game',
  'spelling-list-game',
  'weekly-spelling-practice',
  'sight-word-typing-game',
  'homeschool-spelling-practice',
  'vocabulary-typing-game',
];
const newLongtailSlugs = [
  'custom-spelling-words-game',
  'homeschool-spelling-practice',
  'sight-word-typing-game',
  'vocabulary-typing-game',
];
const existingLocalizedSlugs = ['spelling-list-game', 'weekly-spelling-practice'];
const legalSlugs = ['about', 'contact', 'privacy'];

const labels = {
  en: {
    related: 'Related Practice Pages',
    faq: 'Quick FAQ',
    start: 'Start Practice',
    links: {
      'custom-spelling-words-game': 'Custom Spelling Words Game',
      'spelling-list-game': 'Spelling List Game',
      'weekly-spelling-practice': 'Weekly Spelling Practice',
      'homeschool-spelling-practice': 'Homeschool Spelling Practice',
      'sight-word-typing-game': 'Sight Word Typing Game',
      'vocabulary-typing-game': 'Vocabulary Typing Game',
    },
  },
  es: {
    related: 'Páginas de práctica relacionadas',
    faq: 'Preguntas rápidas',
    start: 'Empezar práctica',
    links: {
      'custom-spelling-words-game': 'Juego con tus palabras',
      'spelling-list-game': 'Juego con lista de spelling',
      'weekly-spelling-practice': 'Práctica semanal',
      'homeschool-spelling-practice': 'Spelling para educación en casa',
      'sight-word-typing-game': 'Práctica de sight words',
      'vocabulary-typing-game': 'Juego de vocabulario',
    },
  },
  'pt-BR': {
    related: 'Páginas de prática relacionadas',
    faq: 'Perguntas rápidas',
    start: 'Começar prática',
    links: {
      'custom-spelling-words-game': 'Jogo com suas palavras',
      'spelling-list-game': 'Jogo com lista de palavras',
      'weekly-spelling-practice': 'Prática semanal',
      'homeschool-spelling-practice': 'Spelling para homeschool',
      'sight-word-typing-game': 'Prática de sight words',
      'vocabulary-typing-game': 'Jogo de vocabulário',
    },
  },
  fr: {
    related: 'Pages de pratique liées',
    faq: 'Questions rapides',
    start: 'Commencer',
    links: {
      'custom-spelling-words-game': 'Jeu avec vos mots',
      'spelling-list-game': 'Jeu avec liste de mots',
      'weekly-spelling-practice': 'Pratique hebdomadaire',
      'homeschool-spelling-practice': 'Orthographe anglaise à la maison',
      'sight-word-typing-game': 'Pratique des sight words',
      'vocabulary-typing-game': 'Jeu de vocabulaire',
    },
  },
  id: {
    related: 'Halaman latihan terkait',
    faq: 'Pertanyaan singkat',
    start: 'Mulai latihan',
    links: {
      'custom-spelling-words-game': 'Game dengan kata sendiri',
      'spelling-list-game': 'Game daftar kata',
      'weekly-spelling-practice': 'Latihan mingguan',
      'homeschool-spelling-practice': 'Latihan spelling di rumah',
      'sight-word-typing-game': 'Latihan sight words',
      'vocabulary-typing-game': 'Game kosakata',
    },
  },
  zh: {
    related: '相关练习页面',
    faq: '常见问题',
    start: '开始练习',
    links: {
      'custom-spelling-words-game': '自定义单词拼写游戏',
      'spelling-list-game': '单词表拼写游戏',
      'weekly-spelling-practice': '每周拼写练习',
      'homeschool-spelling-practice': '家庭英语拼写练习',
      'sight-word-typing-game': 'Sight Words 打字练习',
      'vocabulary-typing-game': '英语词汇打字游戏',
    },
  },
};

const footerLinks = {
  en: {
    'custom-spelling-words-game': 'Custom Spelling Game',
    'spelling-list-game': 'Spelling List Game',
    'weekly-spelling-practice': 'Weekly Practice',
    'homeschool-spelling-practice': 'Homeschool',
    'sight-word-typing-game': 'Sight Words',
    'vocabulary-typing-game': 'Vocabulary',
  },
  es: {
    'custom-spelling-words-game': 'Juego personalizado',
    'spelling-list-game': 'Lista de spelling',
    'weekly-spelling-practice': 'Práctica semanal',
    'homeschool-spelling-practice': 'En casa',
    'sight-word-typing-game': 'Palabras frecuentes',
    'vocabulary-typing-game': 'Vocabulario',
  },
  'pt-BR': {
    'custom-spelling-words-game': 'Jogo personalizado',
    'spelling-list-game': 'Lista de soletrar',
    'weekly-spelling-practice': 'Prática semanal',
    'homeschool-spelling-practice': 'Em casa',
    'sight-word-typing-game': 'Palavras frequentes',
    'vocabulary-typing-game': 'Vocabulário',
  },
  fr: {
    'custom-spelling-words-game': 'Jeu personnalisé',
    'spelling-list-game': 'Liste de mots',
    'weekly-spelling-practice': 'Pratique hebdomadaire',
    'homeschool-spelling-practice': 'À la maison',
    'sight-word-typing-game': 'Mots fréquents',
    'vocabulary-typing-game': 'Vocabulaire',
  },
  id: {
    'custom-spelling-words-game': 'Game kata sendiri',
    'spelling-list-game': 'Daftar spelling',
    'weekly-spelling-practice': 'Latihan mingguan',
    'homeschool-spelling-practice': 'Di rumah',
    'sight-word-typing-game': 'Kata umum',
    'vocabulary-typing-game': 'Kosakata',
  },
  zh: {
    'custom-spelling-words-game': '自定义单词游戏',
    'spelling-list-game': '单词表练习',
    'weekly-spelling-practice': '每周拼写练习',
    'homeschool-spelling-practice': '家庭学习',
    'sight-word-typing-game': '高频词练习',
    'vocabulary-typing-game': '词汇练习',
  },
};

const pages = {
  en: {
    'custom-spelling-words-game': {
      title: 'Custom Spelling Game With Your Own Words | My Spelling Game',
      description: 'Paste a custom word list to make a spelling game with your own words. Great for teachers, homeschool, ESL, weekly tests, missed-word replay, and no login.',
      ogDescription: 'Paste a custom spelling list and share a no-login practice link with missed-word replay.',
      h1: 'Custom Spelling Words Game With Your Own List',
      intro: 'Paste any custom spelling list and turn it into a quick falling-word typing game or spelling test with your own words.',
      panels: [
        ['Paste-And-Play Custom Word Lists', 'Parents, teachers, tutors, homeschool families, and ESL instructors often already have the word list. This page turns that list into practice without a lesson builder or student login.'],
        ['Why It Is Different', 'No premade word bank, no class setup, and no account wall. Paste the exact words, play a short round, then replay missed words.'],
      ],
      faq: [
        ['Can I make a spelling game with my own words?', 'Yes. Paste your own spelling words and the game will use that list for the practice round.'],
        ['Can teachers use it for a class spelling test?', 'Yes. Paste the class list, run a quick round, and share the same no-login link with students.'],
        ['Does it replay missed words?', 'Yes. Missed words can be replayed so practice focuses on the words that still need work.'],
      ],
    },
    'homeschool-spelling-practice': {
      title: 'Homeschool Spelling Practice Lists | My Spelling Game',
      description: 'Homeschool spelling practice with your own curriculum words. Paste a custom word list, run a quick spelling test, replay missed words, and reuse the link.',
      ogDescription: 'Paste homeschool curriculum words, share a no-login link, and replay missed words.',
      h1: 'Homeschool Spelling Practice With Custom Lists',
      intro: 'Turn homeschool curriculum words or grade-level lists into a short spelling game that is easy to reuse each week.',
      panels: [
        ['Custom Lists For Homeschool Lessons', 'Homeschool spelling work often follows a curriculum, workbook, or parent-made list. The game stays useful because it uses the exact words you paste.'],
        ['Small Enough To Reuse Every Week', 'No platform setup. Paste the lesson words, play a round, and use missed-word replay before the weekly spelling check.'],
      ],
      faq: [
        ['Can I use homeschool curriculum words?', 'Yes. Paste words from a curriculum, workbook, or parent-made list.'],
        ['Can I run a spelling test with my own words?', 'Yes. Start a short round with the exact words you entered.'],
        ['Does it require a homeschool platform account?', 'No. It works in the browser with a shareable no-login link.'],
      ],
    },
    'sight-word-typing-game': {
      title: 'Sight Word Typing Game With Your List | My Spelling Game',
      description: 'Paste a teacher-provided sight word list and play a simple typing game. Great for classroom or home practice, missed-word replay, and no student login.',
      ogDescription: 'Paste a custom sight word list and play a no-login typing game with missed-word replay.',
      h1: 'Sight Word Typing Game With Your Own List',
      intro: 'Paste the exact sight words your student is learning and turn them into a short typing round for class, home, or early-grade practice.',
      panels: [
        ['Good For Short Custom Word Lists', 'Sight word practice works best when the list is small and repeated. Missed words can come back for another quick round.'],
        ['Simple Classroom Or Home Use', 'Use it for classroom centers, homework, homeschool reading practice, or a small Dolch-style or Fry-style list.'],
      ],
      faq: [
        ['Can I use my own sight word list?', 'Yes. Paste the sight words your student is practicing right now.'],
        ['Is it good for classroom centers?', 'Yes. Share the same no-login link for a short independent typing round.'],
        ['Can students retry missed sight words?', 'Yes. Missed words can be replayed after the round.'],
      ],
    },
    'vocabulary-typing-game': {
      title: 'Vocabulary Typing Game With Your List | My Spelling Game',
      description: 'Paste a vocabulary list for ESL, tutoring, test prep, or class practice. Students type your exact words, replay missed words, and use a no-login link.',
      ogDescription: 'Paste an ESL, tutoring, or class vocabulary list and replay missed words with no login.',
      h1: 'Vocabulary Typing Game With Your Own Word List',
      intro: 'Use your own vocabulary list for ESL, tutoring, test prep, or classroom review, then replay the words students miss.',
      panels: [
        ['Use Your Own Vocabulary Word List', 'Vocabulary practice is more useful when it matches the current lesson. Paste academic words, science terms, ESL words, or test prep vocabulary.'],
        ['Good For Repeated Practice', 'The same link can be reused for short tutoring sessions, class review, or focused missed-word practice.'],
      ],
      faq: [
        ['Can I paste my own vocabulary list?', 'Yes. Paste ESL, tutoring, class, or test prep vocabulary and play immediately.'],
        ['Do students need an account?', 'No. The practice link works without student login.'],
        ['Can students repeat missed vocabulary words?', 'Yes. Missed words can be replayed for focused review.'],
      ],
    },
  },
  es: {
    'custom-spelling-words-game': {
      title: 'Juego de spelling con tus palabras | My Spelling Game',
      description: 'Pega una lista propia de spelling y conviértela en un juego rápido. Ideal para clase, casa, homeschool, ESL y repaso sin cuenta.',
      ogDescription: 'Crea una práctica de spelling con tu propia lista y comparte un enlace sin cuenta.',
      h1: 'Juego de spelling con tus propias palabras',
      intro: 'Pega la lista que ya tienes, de clase, deberes o tutoría, y conviértela en una práctica corta con esas mismas palabras.',
      panels: [
        ['Para listas reales, no bancos genéricos', 'Muchas familias y profesores ya tienen la lista. Lo útil es practicar exactamente esas palabras sin preparar una lección completa.'],
        ['Rápido para clase o casa', 'Pega la lista, juega una ronda y repite las palabras falladas. El enlace compartido funciona sin cuenta de estudiante.'],
      ],
      faq: [
        ['¿Puedo usar mis propias palabras?', 'Sí. Pega tu lista y el juego usará solo esas palabras.'],
        ['¿Sirve para una prueba de spelling?', 'Sí. Puedes usar una ronda corta como práctica antes de la prueba.'],
        ['¿Los alumnos necesitan cuenta?', 'No. El enlace de práctica se abre sin login.'],
      ],
    },
    'homeschool-spelling-practice': {
      title: 'Spelling en casa | My Spelling Game',
      description: 'Practica spelling en casa con palabras del currículo, workbook o lista familiar. Pega la lista, juega una ronda y repite las falladas.',
      ogDescription: 'Convierte tu lista de casa en práctica de spelling sin cuenta.',
      h1: 'Práctica de spelling en casa',
      intro: 'Usa las palabras del currículo, del workbook o de una lista creada en casa y conviértelas en una práctica semanal sencilla.',
      panels: [
        ['Listas hechas por la familia', 'En casa la lista suele venir de un plan propio. Por eso el juego acepta cualquier lista y no impone palabras genéricas.'],
        ['Una rutina corta', 'Pega las palabras de la lección, juega una ronda y vuelve a practicar solo lo que salió mal antes de cerrar la semana.'],
      ],
      faq: [
        ['¿Puedo usar palabras de mi currículo?', 'Sí. Pega palabras de un currículo, workbook o lista hecha por la familia.'],
        ['¿Sirve como prueba rápida?', 'Sí. La ronda usa exactamente las palabras que pegaste.'],
        ['¿Hace falta una plataforma educativa?', 'No. Funciona en el navegador con un enlace sin cuenta.'],
      ],
    },
    'sight-word-typing-game': {
      title: 'Juego para practicar palabras frecuentes | My Spelling Game',
      description: 'Pega una lista de palabras frecuentes en inglés y conviértela en una práctica corta de typing. Útil para clase, casa y repaso sin cuenta.',
      ogDescription: 'Practica palabras frecuentes con una lista propia y repite las palabras falladas.',
      h1: 'Juego para practicar palabras frecuentes',
      intro: 'Pega las palabras frecuentes que el niño está trabajando ahora y conviértelas en una ronda corta de escritura.',
      panels: [
        ['Mejor con listas pequeñas', 'Las palabras frecuentes suelen necesitar repetición breve. Una lista corta funciona mejor que una actividad larga.'],
        ['Para clase, casa o lectura temprana', 'Úsalo con listas tipo Dolch o Fry, palabras dadas por el profesor o una lista propia de lectura.'],
      ],
      faq: [
        ['¿Puedo pegar mi propia lista de palabras frecuentes?', 'Sí. Usa la lista que el estudiante está practicando ahora.'],
        ['¿Sirve para centros de clase?', 'Sí. Puedes compartir el mismo enlace sin crear cuentas.'],
        ['¿Se repiten las palabras falladas?', 'Sí. Las palabras falladas pueden volver en otra ronda.'],
      ],
    },
    'vocabulary-typing-game': {
      title: 'Juego de vocabulario en inglés | My Spelling Game',
      description: 'Pega vocabulario de inglés, ESL, tutoría o examen y practica escribiendo las palabras. Sin cuenta y con repaso de errores.',
      ogDescription: 'Convierte una lista de vocabulario en inglés en un juego corto de typing.',
      h1: 'Juego de vocabulario en inglés',
      intro: 'Pega vocabulario de una clase, tutoría, examen o lección ESL y practica solo esas palabras.',
      panels: [
        ['Vocabulario de la lección actual', 'La práctica funciona mejor cuando coincide con lo que el estudiante acaba de ver en clase o tutoría.'],
        ['Repaso con intención', 'Después de una ronda, las palabras falladas se pueden repetir para concentrar el esfuerzo donde hace falta.'],
      ],
      faq: [
        ['¿Puedo pegar mi propia lista de vocabulario?', 'Sí. Pega vocabulario de clase, ESL, tutoría o examen.'],
        ['¿Hace falta cuenta?', 'No. El enlace de práctica funciona sin login.'],
        ['¿Sirve para repasar errores?', 'Sí. Las palabras falladas se pueden repetir en otra ronda.'],
      ],
    },
  },
  'pt-BR': {
    'custom-spelling-words-game': {
      title: 'Jogo de spelling com suas palavras | My Spelling Game',
      description: 'Cole sua própria lista de spelling e transforme em jogo rápido. Bom para escola, casa, homeschool, ESL e revisão sem conta.',
      ogDescription: 'Crie uma prática de spelling com sua lista e compartilhe um link sem conta.',
      h1: 'Jogo de spelling com suas próprias palavras',
      intro: 'Cole a lista que você já tem, da escola, da aula ou do reforço, e pratique exatamente essas palavras.',
      panels: [
        ['Para listas reais', 'Pais, professores e tutores normalmente já têm a lista. O jogo evita banco genérico e usa só o que foi colado.'],
        ['Sem preparação longa', 'Cole a lista, faça uma rodada curta e revise as palavras erradas. O link compartilhado não exige login de aluno.'],
      ],
      faq: [
        ['Posso usar minhas próprias palavras?', 'Sim. Cole sua lista e o jogo usa apenas essas palavras.'],
        ['Serve para revisar antes da prova?', 'Sim. A rodada curta ajuda a praticar a lista antes do teste.'],
        ['Aluno precisa criar conta?', 'Não. O link abre direto no navegador.'],
      ],
    },
    'homeschool-spelling-practice': {
      title: 'Spelling em casa em inglês | My Spelling Game',
      description: 'Pratique spelling em casa com palavras do currículo, apostila ou lista da família. Cole a lista, jogue e revise os erros.',
      ogDescription: 'Transforme palavras estudadas em casa em prática de spelling sem conta.',
      h1: 'Prática de spelling em casa',
      intro: 'Use palavras do currículo, de uma apostila ou de uma lista feita em casa para criar uma rotina simples de spelling.',
      panels: [
        ['A lista vem do seu plano', 'No estudo em casa, a sequência de palavras nem sempre segue um banco pronto. Por isso a prática começa com a sua lista.'],
        ['Rotina de poucos minutos', 'Cole as palavras da semana, jogue uma rodada e revise só o que ficou difícil.'],
      ],
      faq: [
        ['Posso usar palavras do currículo?', 'Sim. Cole palavras do currículo, apostila ou lista criada pela família.'],
        ['Dá para fazer um teste rápido?', 'Sim. A rodada usa exatamente as palavras coladas.'],
        ['Precisa de uma plataforma escolar?', 'Não. Funciona no navegador com link sem conta.'],
      ],
    },
    'sight-word-typing-game': {
      title: 'Jogo para praticar palavras frequentes | My Spelling Game',
      description: 'Cole uma lista de palavras frequentes em inglês e pratique digitando. Útil para escola, casa e leitura inicial, sem login de aluno.',
      ogDescription: 'Pratique palavras frequentes com lista própria e revisão de erros.',
      h1: 'Jogo para praticar palavras frequentes',
      intro: 'Cole as palavras frequentes que a criança está aprendendo agora e transforme a lista em uma rodada curta de digitação.',
      panels: [
        ['Listas curtas funcionam melhor', 'Palavras frequentes pedem repetição frequente. Uma rodada curta ajuda sem cansar.'],
        ['Para aula ou casa', 'Use com listas do professor, listas Dolch/Fry ou palavras de leitura inicial.'],
      ],
      faq: [
        ['Posso usar minha lista de palavras frequentes?', 'Sim. Cole a lista que a criança está praticando.'],
        ['Serve para atividade independente?', 'Sim. Compartilhe o mesmo link sem criar contas.'],
        ['Dá para repetir os erros?', 'Sim. Palavras erradas podem voltar em outra rodada.'],
      ],
    },
    'vocabulary-typing-game': {
      title: 'Jogo de vocabulário em inglês | My Spelling Game',
      description: 'Cole vocabulário de inglês, ESL, reforço ou prova e pratique digitando. Sem conta, com revisão das palavras erradas.',
      ogDescription: 'Transforme uma lista de vocabulário em inglês em jogo curto de digitação.',
      h1: 'Jogo de vocabulário em inglês',
      intro: 'Cole palavras de uma aula, prova, reforço ou lição de ESL e pratique exatamente esse vocabulário.',
      panels: [
        ['Vocabulário da aula atual', 'A prática fica mais útil quando acompanha o conteúdo que o aluno acabou de estudar.'],
        ['Revisão focada', 'Depois da rodada, as palavras erradas podem ser repetidas para concentrar o estudo.'],
      ],
      faq: [
        ['Posso colar minha lista de vocabulário?', 'Sim. Use vocabulário de aula, ESL, reforço ou prova.'],
        ['Precisa criar conta?', 'Não. O link de prática funciona sem login.'],
        ['Dá para revisar palavras erradas?', 'Sim. As palavras erradas podem ser repetidas em outra rodada.'],
      ],
    },
  },
  fr: {
    'custom-spelling-words-game': {
      title: 'Jeu de spelling avec vos mots | My Spelling Game',
      description: 'Collez votre propre liste de mots anglais et lancez une pratique courte. Idéal pour classe, maison, ESL et révision sans compte.',
      ogDescription: 'Créez une pratique de spelling avec votre liste et partagez un lien sans compte.',
      h1: 'Jeu de spelling avec vos propres mots',
      intro: 'Collez la liste que vous avez déjà, devoirs, cours ou tutorat, et pratiquez uniquement ces mots.',
      panels: [
        ['Des mots réels, pas une liste générique', 'La liste existe souvent déjà. Le plus utile est de la transformer en pratique courte sans préparer une leçon entière.'],
        ['Pratique rapide', 'Collez la liste, jouez une partie et refaites les mots manqués. Le lien partagé fonctionne sans compte élève.'],
      ],
      faq: [
        ['Puis-je utiliser mes propres mots ?', 'Oui. Collez votre liste et le jeu utilisera seulement ces mots.'],
        ['Est-ce utile avant un contrôle ?', 'Oui. Une partie courte peut servir de révision juste avant le contrôle.'],
        ['Faut-il créer un compte ?', 'Non. Le lien s’ouvre directement dans le navigateur.'],
      ],
    },
    'homeschool-spelling-practice': {
      title: 'Orthographe anglaise à la maison | My Spelling Game',
      description: 'Pratiquez l’orthographe anglaise à la maison avec les mots du programme, du cahier ou d’une liste familiale.',
      ogDescription: 'Transformez une liste maison en pratique d’orthographe anglaise sans compte.',
      h1: 'Pratique d’orthographe anglaise à la maison',
      intro: 'Utilisez les mots d’un programme, d’un cahier ou d’une liste familiale pour créer une pratique simple chaque semaine.',
      panels: [
        ['Une liste qui suit votre rythme', 'À la maison, la progression ne suit pas toujours une banque de mots prête à l’emploi. Ici, la pratique commence avec votre liste.'],
        ['Quelques minutes suffisent', 'Collez les mots, jouez une partie courte et reprenez seulement les mots manqués.'],
      ],
      faq: [
        ['Puis-je utiliser les mots de mon programme ?', 'Oui. Collez les mots d’un programme, d’un cahier ou d’une liste familiale.'],
        ['Peut-on faire un petit test ?', 'Oui. La partie utilise exactement les mots collés.'],
        ['Faut-il une plateforme spécialisée ?', 'Non. Tout fonctionne dans le navigateur avec un lien sans compte.'],
      ],
    },
    'sight-word-typing-game': {
      title: 'Jeu pour pratiquer les mots fréquents | My Spelling Game',
      description: 'Collez une liste de mots fréquents en anglais et lancez une courte pratique de frappe. Utile en classe, à la maison et sans compte.',
      ogDescription: 'Pratiquez les mots fréquents avec une liste personnalisée et révisez les mots manqués.',
      h1: 'Jeu pour pratiquer les mots fréquents',
      intro: 'Collez les mots fréquents que l’enfant apprend en ce moment et transformez-les en courte partie de frappe.',
      panels: [
        ['Mieux avec une petite liste', 'Les mots fréquents demandent des répétitions courtes et fréquentes. Une partie brève suffit souvent.'],
        ['Pour la classe ou la maison', 'Utilisez une liste du professeur, une liste Dolch/Fry ou des mots de lecture débutante.'],
      ],
      faq: [
        ['Puis-je coller ma liste de mots fréquents ?', 'Oui. Utilisez la liste travaillée en ce moment.'],
        ['Est-ce adapté aux ateliers en classe ?', 'Oui. Partagez le même lien sans créer de comptes.'],
        ['Peut-on refaire les mots manqués ?', 'Oui. Les mots manqués peuvent revenir dans une autre partie.'],
      ],
    },
    'vocabulary-typing-game': {
      title: 'Jeu de vocabulaire anglais | My Spelling Game',
      description: 'Collez une liste de vocabulaire anglais, ESL, tutorat ou contrôle et pratiquez la frappe avec révision des erreurs.',
      ogDescription: 'Transformez une liste de vocabulaire anglais en courte pratique de frappe.',
      h1: 'Jeu de vocabulaire anglais',
      intro: 'Collez le vocabulaire d’un cours, d’un contrôle, d’un tutorat ou d’une leçon ESL et pratiquez ces mots précis.',
      panels: [
        ['Le vocabulaire du moment', 'La pratique est plus utile quand elle suit le chapitre ou la leçon en cours.'],
        ['Révision ciblée', 'Après une partie, les mots manqués peuvent être refaits pour concentrer l’effort.'],
      ],
      faq: [
        ['Puis-je coller ma propre liste de vocabulaire ?', 'Oui. Utilisez une liste de cours, ESL, tutorat ou contrôle.'],
        ['Faut-il un compte ?', 'Non. Le lien de pratique fonctionne sans login.'],
        ['Peut-on reprendre les erreurs ?', 'Oui. Les mots manqués peuvent être rejoués.'],
      ],
    },
  },
  id: {
    'custom-spelling-words-game': {
      title: 'Game spelling dengan kata sendiri | My Spelling Game',
      description: 'Tempel daftar kata sendiri dan ubah menjadi game spelling singkat. Cocok untuk kelas, rumah, ESL, tutor, dan latihan tanpa akun.',
      ogDescription: 'Buat latihan spelling dari daftar kata sendiri dan bagikan link tanpa akun.',
      h1: 'Game spelling dengan kata sendiri',
      intro: 'Tempel daftar dari sekolah, kelas, atau tutor, lalu latihan hanya dengan kata-kata itu.',
      panels: [
        ['Untuk daftar yang benar-benar dipakai', 'Orang tua, guru, dan tutor biasanya sudah punya daftar. Game ini mengubah daftar itu menjadi latihan tanpa bank kata acak.'],
        ['Cepat untuk kelas atau rumah', 'Tempel daftar, mainkan ronde pendek, lalu ulangi kata yang salah. Link latihan tidak perlu akun siswa.'],
      ],
      faq: [
        ['Bisa memakai kata sendiri?', 'Bisa. Tempel daftar kata dan game hanya memakai kata itu.'],
        ['Bisa untuk latihan sebelum kuis?', 'Bisa. Ronde pendek cocok untuk mengecek daftar sebelum kuis.'],
        ['Siswa perlu akun?', 'Tidak. Link latihan langsung terbuka di browser.'],
      ],
    },
    'homeschool-spelling-practice': {
      title: 'Latihan spelling di rumah | My Spelling Game',
      description: 'Latih spelling bahasa Inggris di rumah dengan kata dari kurikulum, buku, atau daftar buatan keluarga. Tanpa akun.',
      ogDescription: 'Ubah daftar belajar di rumah menjadi latihan spelling tanpa akun.',
      h1: 'Latihan spelling bahasa Inggris di rumah',
      intro: 'Gunakan kata dari kurikulum, buku latihan, atau daftar buatan keluarga untuk rutinitas spelling mingguan.',
      panels: [
        ['Mengikuti daftar keluarga', 'Belajar di rumah sering punya urutan kata sendiri. Karena itu latihan dimulai dari daftar yang kamu tempel.'],
        ['Singkat dan bisa diulang', 'Tempel kata minggu ini, mainkan satu ronde, lalu ulangi hanya kata yang masih salah.'],
      ],
      faq: [
        ['Bisa memakai kata dari kurikulum?', 'Bisa. Tempel kata dari kurikulum, buku, atau daftar keluarga.'],
        ['Bisa menjadi tes singkat?', 'Bisa. Ronde memakai kata yang persis kamu masukkan.'],
        ['Perlu platform khusus?', 'Tidak. Cukup browser dan link tanpa akun.'],
      ],
    },
    'sight-word-typing-game': {
      title: 'Game latihan kata umum | My Spelling Game',
      description: 'Tempel daftar kata umum bahasa Inggris dan jadikan latihan mengetik singkat. Cocok untuk kelas, rumah, dan latihan membaca awal.',
      ogDescription: 'Latih kata umum dari daftar sendiri dan ulangi kata yang salah.',
      h1: 'Game latihan kata umum',
      intro: 'Tempel kata umum yang sedang dipelajari anak dan ubah menjadi ronde mengetik singkat.',
      panels: [
        ['Lebih enak dengan daftar pendek', 'Kata umum biasanya perlu pengulangan singkat. Ronde kecil membuat latihan terasa ringan.'],
        ['Untuk kelas atau rumah', 'Gunakan daftar dari guru, daftar Dolch/Fry, atau kata-kata membaca awal.'],
      ],
      faq: [
        ['Bisa memakai daftar kata umum sendiri?', 'Bisa. Tempel daftar yang sedang dipelajari siswa.'],
        ['Cocok untuk aktivitas mandiri?', 'Cocok. Bagikan link yang sama tanpa membuat akun.'],
        ['Bisa mengulang kata yang salah?', 'Bisa. Kata yang salah dapat dimainkan lagi.'],
      ],
    },
    'vocabulary-typing-game': {
      title: 'Game kosakata bahasa Inggris | My Spelling Game',
      description: 'Tempel daftar kosakata bahasa Inggris, ESL, tutor, atau persiapan tes dan latih dengan game mengetik tanpa akun.',
      ogDescription: 'Ubah daftar kosakata bahasa Inggris menjadi game mengetik singkat.',
      h1: 'Game kosakata bahasa Inggris',
      intro: 'Tempel kosakata dari kelas, tutor, tes, atau pelajaran ESL dan latihan dengan kata yang sama.',
      panels: [
        ['Kosakata sesuai pelajaran', 'Latihan lebih berguna ketika sesuai dengan materi yang baru dipelajari siswa.'],
        ['Review yang fokus', 'Setelah ronde selesai, kata yang salah bisa diulang supaya latihan lebih tepat sasaran.'],
      ],
      faq: [
        ['Bisa tempel daftar kosakata sendiri?', 'Bisa. Gunakan daftar dari kelas, ESL, tutor, atau tes.'],
        ['Perlu akun?', 'Tidak. Link latihan bekerja tanpa login.'],
        ['Bisa mengulang kosakata yang salah?', 'Bisa. Kata yang salah dapat dimainkan lagi.'],
      ],
    },
  },
  zh: {
    'custom-spelling-words-game': {
      title: '自定义英语单词拼写游戏 | My Spelling Game',
      description: '粘贴自己的英语单词表，生成拼写小游戏。适合老师、家长、ESL、家庭学习和测验前复习，无需学生登录。',
      ogDescription: '用自己的英语单词表创建拼写练习，支持错词重练和无登录分享。',
      h1: '自定义英语单词拼写游戏',
      intro: '把老师发的单词、教材词表或自学词汇直接粘贴进来，只练这份真实单词。',
      panels: [
        ['不是随机词库', '很多时候单词表已经存在，真正需要的是把它快速变成练习，而不是重新建课程。'],
        ['适合课堂和家庭', '粘贴单词，练一轮，再重练漏掉的词。分享链接不需要学生注册账号。'],
      ],
      faq: [
        ['可以用自己的英语单词吗？', '可以。粘贴单词表后，游戏只使用这份单词。'],
        ['能当作测验前练习吗？', '可以。短轮次适合在测验前快速检查。'],
        ['学生需要登录吗？', '不需要。打开练习链接即可。'],
      ],
    },
    'homeschool-spelling-practice': {
      title: '家庭英语拼写练习 | My Spelling Game',
      description: '用教材、练习册或家长自选词表做家庭英语拼写练习。粘贴单词，开始练习，漏词自动重练。',
      ogDescription: '把家庭学习词表变成无需登录的英语拼写练习。',
      h1: '家庭英语拼写练习',
      intro: '用教材、练习册或家长自己整理的单词表，做一套每周都能复用的拼写练习。',
      panels: [
        ['跟着自己的学习节奏', '家庭学习的词表不一定来自固定词库，所以这里从你粘贴的真实单词开始。'],
        ['几分钟一轮', '粘贴本周单词，练一轮，再只重练还没掌握的词。'],
      ],
      faq: [
        ['可以用教材里的词吗？', '可以。教材、练习册或家长自选词都可以。'],
        ['可以做快速拼写测试吗？', '可以。练习轮次会使用你输入的原始词表。'],
        ['需要学习平台账号吗？', '不需要。浏览器打开链接即可练习。'],
      ],
    },
    'sight-word-typing-game': {
      title: '高频词打字练习 | My Spelling Game',
      description: '粘贴英语高频词词表，生成短轮次打字练习。适合课堂、家庭阅读启蒙和错词重练，无需学生登录。',
      ogDescription: '用自己的英语高频词词表做打字练习，支持错词重练。',
      h1: '高频词打字练习',
      intro: '把孩子正在学习的英语高频词粘贴进来，变成一轮简短的英文打字练习。',
      panels: [
        ['短词表更适合反复练', '高频词需要经常重复，短轮次比长任务更容易坚持。'],
        ['适合课堂或家庭', '可以用老师给的词表、Dolch/Fry 风格词表，或家庭阅读启蒙词表。'],
      ],
      faq: [
        ['可以用自己的英语高频词词表吗？', '可以。粘贴孩子当前正在练的词即可。'],
        ['适合课堂小组练习吗？', '适合。分享同一个链接即可，不需要账号。'],
        ['能重练漏掉的词吗？', '可以。漏掉的词可以进入下一轮。'],
      ],
    },
    'vocabulary-typing-game': {
      title: '英语词汇打字游戏 | My Spelling Game',
      description: '粘贴英语词汇表，做 ESL、课堂、辅导或测验前打字练习。无需账号，支持错词重练。',
      ogDescription: '把英语词汇表变成短轮次打字练习，错词可重练。',
      h1: '英语词汇打字游戏',
      intro: '把课堂、ESL、辅导或测验前要复习的词汇贴进来，只练这份词表。',
      panels: [
        ['贴合当前课程', '词汇练习最有用的时候，是它正好对应学生刚学过的内容。'],
        ['错词集中复习', '一轮结束后，漏掉的词可以单独再练，时间用在真正薄弱的地方。'],
      ],
      faq: [
        ['可以粘贴自己的词汇表吗？', '可以。课堂、ESL、辅导或测验词表都可以。'],
        ['需要账号吗？', '不需要。练习链接无需登录。'],
        ['能重练错词吗？', '可以。漏掉的词可以再次进入练习。'],
      ],
    },
  },
};

const existingFaq = {
  es: {
    'spelling-list-game': {
      faq: [
        ['¿Puedo convertir cualquier lista en un juego?', 'Sí. Pega la lista y My Spelling Game usa solo esas palabras.'],
        ['¿Sirve para listas de clase?', 'Sí. El profesor puede compartir el mismo enlace sin cuentas de estudiante.'],
        ['¿Se pueden repetir las palabras falladas?', 'Sí. Las palabras falladas quedan listas para otra ronda.'],
      ],
      breadcrumb: 'Juego con lista de spelling',
    },
    'weekly-spelling-practice': {
      faq: [
        ['¿Puedo usar la lista de esta semana?', 'Sí. Pega la lista semanal y empieza una ronda corta.'],
        ['¿Puedo reutilizar el enlace durante la semana?', 'Sí. El enlace conserva la misma lista sin pedir cuenta.'],
        ['¿Qué conviene repasar antes de la prueba?', 'Las palabras falladas, porque muestran dónde falta práctica.'],
      ],
      breadcrumb: 'Práctica semanal de spelling',
    },
  },
  'pt-BR': {
    'spelling-list-game': {
      faq: [
        ['Posso transformar qualquer lista em jogo?', 'Sim. Cole a lista e o jogo usa apenas essas palavras.'],
        ['Serve para listas da escola?', 'Sim. O professor pode compartilhar o mesmo link sem contas de aluno.'],
        ['Dá para revisar palavras erradas?', 'Sim. As palavras erradas ficam prontas para outra rodada.'],
      ],
      breadcrumb: 'Jogo com lista de palavras',
    },
    'weekly-spelling-practice': {
      faq: [
        ['Posso usar a lista desta semana?', 'Sim. Cole a lista semanal e comece uma rodada curta.'],
        ['Posso reutilizar o link durante a semana?', 'Sim. O link mantém a mesma lista sem pedir conta.'],
        ['O que revisar antes da prova?', 'As palavras erradas, porque mostram onde ainda falta prática.'],
      ],
      breadcrumb: 'Prática semanal',
    },
  },
  fr: {
    'spelling-list-game': {
      faq: [
        ['Puis-je transformer n’importe quelle liste en jeu ?', 'Oui. Collez la liste et le jeu utilise seulement ces mots.'],
        ['Est-ce adapté aux listes de classe ?', 'Oui. L’enseignant peut partager le même lien sans comptes élèves.'],
        ['Peut-on refaire les mots manqués ?', 'Oui. Les mots manqués sont prêts pour une autre partie.'],
      ],
      breadcrumb: 'Jeu avec liste de mots',
    },
    'weekly-spelling-practice': {
      faq: [
        ['Puis-je utiliser la liste de cette semaine ?', 'Oui. Collez la liste hebdomadaire et lancez une partie courte.'],
        ['Puis-je réutiliser le lien pendant la semaine ?', 'Oui. Le lien garde la même liste sans demander de compte.'],
        ['Que réviser avant le contrôle ?', 'Les mots manqués, car ils indiquent ce qui demande encore du travail.'],
      ],
      breadcrumb: 'Pratique hebdomadaire',
    },
  },
  id: {
    'spelling-list-game': {
      faq: [
        ['Bisa mengubah daftar kata apa saja menjadi game?', 'Bisa. Tempel daftar dan game hanya memakai kata itu.'],
        ['Cocok untuk daftar dari guru?', 'Cocok. Guru bisa membagikan link yang sama tanpa akun siswa.'],
        ['Bisa ulangi kata yang salah?', 'Bisa. Kata yang salah siap dimainkan lagi.'],
      ],
      breadcrumb: 'Game daftar kata',
    },
    'weekly-spelling-practice': {
      faq: [
        ['Bisa memakai daftar kata minggu ini?', 'Bisa. Tempel daftar mingguan dan mulai ronde singkat.'],
        ['Bisa pakai link yang sama sepanjang minggu?', 'Bisa. Link menyimpan daftar yang sama tanpa akun.'],
        ['Apa yang perlu diulang sebelum kuis?', 'Kata yang salah, karena itu menunjukkan bagian yang masih perlu latihan.'],
      ],
      breadcrumb: 'Latihan mingguan',
    },
  },
  zh: {
    'spelling-list-game': {
      faq: [
        ['任何英语单词表都能变成游戏吗？', '可以。粘贴单词表后，游戏只使用这些词。'],
        ['适合老师布置的词表吗？', '适合。老师可以分享同一个链接，不需要学生账号。'],
        ['能重练漏掉的单词吗？', '可以。漏掉的词会整理出来进入下一轮。'],
      ],
      breadcrumb: '英语单词表拼写游戏',
    },
    'weekly-spelling-practice': {
      faq: [
        ['可以用本周英语单词表吗？', '可以。粘贴本周词表后直接开始短轮次练习。'],
        ['一周里可以重复用同一个链接吗？', '可以。链接会保留同一份词表，不需要登录。'],
        ['测验前应该重点练什么？', '优先练漏掉的词，因为它们最能暴露薄弱点。'],
      ],
      breadcrumb: '每周英语拼写练习',
    },
  },
};

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function pagePath(lang, slug) {
  return lang.dir ? `/${lang.dir}/${slug}.html` : `/${slug}.html`;
}

function dirPath(lang) {
  return lang.dir ? `/${lang.dir}/` : '/';
}

function alternateLinks(slug) {
  const links = languages.map((lang) => `    <link rel="alternate" hreflang="${lang.hreflang}" href="${baseUrl}${pagePath(lang, slug)}">`);
  links.push(`    <link rel="alternate" hreflang="x-default" href="${baseUrl}/${slug}.html">`);
  return links.join('\n');
}

function languageMenu(currentCode, slug) {
  const links = languages.map((lang) => {
    const current = lang.code === currentCode ? ' aria-current="page"' : '';
    return `                <a class="lang-option" href="${pagePath(lang, slug)}" hreflang="${lang.hreflang}"${current}>${lang.label}</a>`;
  }).join('\n');
  const lang = languages.find((item) => item.code === currentCode);
  return `    <div class="top-right-nav">
        <details class="language-switcher">
            <summary class="lang-btn" aria-label="${escapeAttr(lang.nav)}">${lang.nav}</summary>
            <div class="lang-menu">
${links}
            </div>
        </details>
        <button class="lang-btn" onclick="window.location.href='${dirPath(lang)}'" id="back-home" title="${escapeAttr(lang.home)}">${lang.home}</button>
    </div>`;
}

function panelHtml([title, body]) {
  return `        <section class="seo-panel">
            <h2>${title}</h2>
            <p>${body}</p>
        </section>`;
}

function faqHtml(langCode, faq) {
  return `        <section class="seo-panel">
            <h2>${labels[langCode].faq}</h2>
${faq.map(([q, a]) => `            <p><strong>${q}</strong> ${a}</p>`).join('\n')}
        </section>`;
}

function relatedHtml(langCode, currentSlug) {
  return `        <section class="seo-panel">
            <h2>${labels[langCode].related}</h2>
            <div class="seo-link-grid">
${seoSlugs.filter((slug) => slug !== currentSlug).map((slug) => `                <a href="${pagePath(languages.find((lang) => lang.code === langCode), slug)}">${labels[langCode].links[slug]}</a>`).join('\n')}
            </div>
        </section>`;
}

function footerHtml(langCode) {
  const lang = languages.find((item) => item.code === langCode);
  return `    <footer>
        <p>
${footerSlugs.map((slug) => `            <a href="${pagePath(lang, slug)}">${footerLinks[langCode][slug]}</a>`).join(' &middot;\n')}<br>
            <a href="${dirPath(lang)}privacy.html">${lang.privacy}</a> &middot; <a href="${dirPath(lang)}about.html">${lang.about}</a> &middot; <a href="${dirPath(lang)}contact.html">${lang.contact}</a><br>
            &copy; 2026 My Spelling Game All rights reserved.
        </p>
    </footer>`;
}

function jsonLd(data) {
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
}

function schemaScripts(lang, slug, page) {
  const url = `${baseUrl}${pagePath(lang, slug)}`;
  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.h1,
    description: page.description,
    url,
    inLanguage: lang.htmlLang,
    isPartOf: {
      '@type': 'WebSite',
      name: 'My Spelling Game',
      url: `${baseUrl}/`,
    },
  };
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang.htmlLang,
    mainEntity: page.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang.home, item: `${baseUrl}${dirPath(lang)}` },
      { '@type': 'ListItem', position: 2, name: page.h1, item: url },
    ],
  };
  return [webpage, faq, breadcrumb].map((schema) => `    <script type="application/ld+json">\n${jsonLd(schema)}\n    </script>`).join('\n');
}

function renderPage(langCode, slug) {
  const lang = languages.find((item) => item.code === langCode);
  const page = pages[langCode][slug];
  return `<!DOCTYPE html>
<html lang="${lang.htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title}</title>
    <meta name="description" content="${escapeAttr(page.description)}">
    <meta name="robots" content="index, follow">
    <meta name="google-adsense-account" content="ca-pub-9244949928133071">
    <link rel="canonical" href="${baseUrl}${pagePath(lang, slug)}">
${alternateLinks(slug)}
    <link rel="sitemap" type="application/xml" href="/sitemap.xml">
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/icon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <meta property="og:title" content="${escapeAttr(page.title)}">
    <meta property="og:description" content="${escapeAttr(page.ogDescription)}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${baseUrl}${pagePath(lang, slug)}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="My Spelling Game ${escapeAttr(page.h1)} preview">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(page.title)}">
    <meta name="twitter:description" content="${escapeAttr(page.ogDescription)}">
    <meta name="twitter:image" content="${ogImage}">
    <script src="/src/js/localeRedirect.js"></script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9244949928133071"
      crossorigin="anonymous"></script>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-VYF1V40KVS"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-VYF1V40KVS');
    </script>
    <link rel="stylesheet" href="/src/css/main.css">
</head>
<body>
${languageMenu(langCode, slug)}
    <main class="seo-landing content-page">
        <section class="seo-hero">
            <h1>${page.h1}</h1>
            <p>${page.intro}</p>
            <a class="seo-cta" href="${dirPath(lang)}">${labels[langCode].start}</a>
        </section>

        <aside class="ad-slot" aria-label="Advertisement">
            <span>Advertisement</span>
        </aside>

${page.panels.map(panelHtml).join('\n\n')}

${faqHtml(langCode, page.faq)}

${relatedHtml(langCode, slug)}
    </main>
${footerHtml(langCode)}
${schemaScripts(lang, slug, page)}
</body>
</html>
`;
}

function updateEnglishLongtail(slug) {
  const file = path.join(root, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const canonical = `    <link rel="canonical" href="${baseUrl}/${slug}.html">\n`;
  html = html.replace(
    new RegExp(`    <link rel="canonical" href="${baseUrl}/${slug}\\.html">\\n(?:    <link rel="alternate"[^\\n]+>\\n)*`),
    canonical + alternateLinks(slug) + '\n',
  );
  if (!html.includes('/src/js/localeRedirect.js')) {
    html = html.replace('    <!-- Google tag (gtag.js) -->', '    <script src="/src/js/localeRedirect.js"></script>\n    <!-- Google tag (gtag.js) -->');
  }
  if (!html.includes('class="top-right-nav"')) {
    html = html.replace('<body>\n', `<body>\n${languageMenu('en', slug)}\n`);
  }
  html = html.replace(/    <footer[\s\S]*?<\/footer>/, footerHtml('en'));
  fs.writeFileSync(file, html, 'utf8');
}

function schemaForExisting(langCode, slug) {
  const lang = languages.find((item) => item.code === langCode);
  const data = existingFaq[langCode][slug];
  const url = `${baseUrl}${pagePath(lang, slug)}`;
  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang.htmlLang,
    mainEntity: data.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang.home, item: `${baseUrl}${dirPath(lang)}` },
      { '@type': 'ListItem', position: 2, name: data.breadcrumb, item: url },
    ],
  };
  return `    <script type="application/ld+json">\n${jsonLd(faq)}\n    </script>\n    <script type="application/ld+json">\n${jsonLd(breadcrumb)}\n    </script>\n`;
}

function updateExistingLocalizedSeoPage(langCode, slug) {
  const lang = languages.find((item) => item.code === langCode);
  const file = path.join(root, lang.dir, `${slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const faqBlock = faqHtml(langCode, existingFaq[langCode][slug].faq);
  if (!html.includes(`<h2>${labels[langCode].faq}</h2>`)) {
    html = html.replace('    </main>', `${faqBlock}\n    </main>`);
  }
  if (!html.includes('"@type": "FAQPage"')) {
    html = html.replace('</body>', `${schemaForExisting(langCode, slug)}</body>`);
  }
  fs.writeFileSync(file, html, 'utf8');
}

function localizeLongtailLinks() {
  for (const lang of languages.filter((item) => item.code !== 'en')) {
    for (const file of fs.readdirSync(path.join(root, lang.dir)).filter((name) => name.endsWith('.html'))) {
      if (newLongtailSlugs.includes(path.basename(file, '.html'))) continue;
      const fullPath = path.join(root, lang.dir, file);
      let html = fs.readFileSync(fullPath, 'utf8');
      for (const slug of newLongtailSlugs) {
        html = html.replaceAll(`href="/${slug}.html"`, `href="/${lang.dir}/${slug}.html"`);
      }
      fs.writeFileSync(fullPath, html, 'utf8');
    }
  }
}

function sitemapAlternateBlock(slug) {
  const links = languages.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang.hreflang}" href="${baseUrl}${slug ? pagePath(lang, slug) : dirPath(lang)}" />`);
  links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${slug ? `/${slug}.html` : '/'}" />`);
  return links.join('\n');
}

function renderSitemap() {
  const entries = [];
  for (const lang of languages) {
    entries.push({
      loc: `${baseUrl}${dirPath(lang)}`,
      priority: lang.code === 'en' ? '1.0' : '0.95',
      changefreq: 'weekly',
      slug: '',
    });
  }
  for (const slug of seoSlugs) {
    for (const lang of languages) {
      const priority = slug === 'custom-spelling-words-game' ? '0.9'
        : slug === 'spelling-list-game' ? '0.85'
        : slug === 'weekly-spelling-practice' ? '0.8'
        : '0.75';
      entries.push({ loc: `${baseUrl}${pagePath(lang, slug)}`, priority, changefreq: 'monthly', slug });
    }
  }
  for (const slug of legalSlugs) {
    for (const lang of languages) {
      entries.push({ loc: `${baseUrl}${pagePath(lang, slug)}`, priority: '0.45', changefreq: 'monthly', slug });
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.map((entry) => `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n${sitemapAlternateBlock(entry.slug)}\n  </url>`).join('\n')}\n</urlset>\n`;
}

for (const lang of languages.filter((item) => item.code !== 'en')) {
  for (const slug of newLongtailSlugs) {
    const file = path.join(root, lang.dir, `${slug}.html`);
    fs.writeFileSync(file, renderPage(lang.code, slug), 'utf8');
  }
  for (const slug of existingLocalizedSlugs) {
    updateExistingLocalizedSeoPage(lang.code, slug);
  }
}

for (const slug of newLongtailSlugs) {
  updateEnglishLongtail(slug);
}

localizeLongtailLinks();
fs.writeFileSync(path.join(root, 'sitemap.xml'), renderSitemap(), 'utf8');

console.log('Generated localized long-tail pages, updated localized SEO schema, and rebuilt sitemap.xml');
