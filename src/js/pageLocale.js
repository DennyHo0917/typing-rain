const LOCALE_ALIASES = {
  'pt-br': 'pt-BR',
  'pt_BR': 'pt-BR',
  'zh-cn': 'zh',
  'zh-CN': 'zh',
  'zh-hans': 'zh',
  'zh-Hans': 'zh',
};

const MESSAGES = {
  en: {
    wordsReady: '{count} words ready',
    sampleLoaded: '{count} sample words loaded',
    wordsInRound: '{count} words in this round',
    summaryTitle: 'Practice Complete',
    summaryMissed: '{count} words need another round',
    summaryClean: 'Clean round. No missed words left.',
    linkCopied: 'Practice link copied',
    linkReady: 'Practice link ready',
    copyPrompt: 'Copy this practice link:',
    clearConfirm: 'Clear the spelling list and practice preferences saved in this browser?',
    clearSuccess: 'Your local spelling practice data has been cleared.',
    dateLocale: 'en-US',
  },
  es: {
    wordsReady: '{count} palabras listas',
    sampleLoaded: '{count} palabras de ejemplo cargadas',
    wordsInRound: '{count} palabras en esta ronda',
    summaryTitle: 'Práctica terminada',
    summaryMissed: '{count} palabras necesitan otra ronda',
    summaryClean: 'Ronda limpia. No quedan palabras falladas.',
    linkCopied: 'Enlace de práctica copiado',
    linkReady: 'Enlace de práctica listo',
    copyPrompt: 'Copia este enlace de práctica:',
    clearConfirm: '¿Borrar la lista de palabras y las preferencias guardadas en este navegador?',
    clearSuccess: 'Se borraron los datos locales de práctica.',
    dateLocale: 'es',
  },
  'pt-BR': {
    wordsReady: '{count} palavras prontas',
    sampleLoaded: '{count} palavras de exemplo carregadas',
    wordsInRound: '{count} palavras nesta rodada',
    summaryTitle: 'Prática concluída',
    summaryMissed: '{count} palavras precisam de outra rodada',
    summaryClean: 'Rodada limpa. Nenhuma palavra ficou para trás.',
    linkCopied: 'Link de prática copiado',
    linkReady: 'Link de prática pronto',
    copyPrompt: 'Copie este link de prática:',
    clearConfirm: 'Apagar a lista de palavras e as preferências salvas neste navegador?',
    clearSuccess: 'Os dados locais de prática foram apagados.',
    dateLocale: 'pt-BR',
  },
  fr: {
    wordsReady: '{count} mots prêts',
    sampleLoaded: '{count} mots d’exemple chargés',
    wordsInRound: '{count} mots dans cette partie',
    summaryTitle: 'Entraînement terminé',
    summaryMissed: '{count} mots à refaire',
    summaryClean: 'Partie réussie. Aucun mot manqué.',
    linkCopied: 'Lien d’entraînement copié',
    linkReady: 'Lien d’entraînement prêt',
    copyPrompt: 'Copiez ce lien d’entraînement :',
    clearConfirm: 'Effacer la liste de mots et les préférences enregistrées dans ce navigateur ?',
    clearSuccess: 'Les données locales d’entraînement ont été effacées.',
    dateLocale: 'fr',
  },
  id: {
    wordsReady: '{count} kata siap',
    sampleLoaded: '{count} contoh kata dimuat',
    wordsInRound: '{count} kata di ronde ini',
    summaryTitle: 'Latihan selesai',
    summaryMissed: '{count} kata perlu diulang',
    summaryClean: 'Ronde bersih. Tidak ada kata yang terlewat.',
    linkCopied: 'Link latihan disalin',
    linkReady: 'Link latihan siap',
    copyPrompt: 'Salin link latihan ini:',
    clearConfirm: 'Hapus daftar kata dan pilihan latihan yang tersimpan di browser ini?',
    clearSuccess: 'Data latihan lokal sudah dihapus.',
    dateLocale: 'id-ID',
  },
  zh: {
    wordsReady: '已准备 {count} 个单词',
    sampleLoaded: '已载入 {count} 个示例单词',
    wordsInRound: '本轮 {count} 个单词',
    summaryTitle: '练习完成',
    summaryMissed: '还有 {count} 个单词需要再练一轮',
    summaryClean: '这一轮很干净，没有漏掉的单词。',
    linkCopied: '练习链接已复制',
    linkReady: '练习链接已准备好',
    copyPrompt: '复制这个练习链接：',
    clearConfirm: '要清除这个浏览器里保存的单词表和练习设置吗？',
    clearSuccess: '本地练习数据已清除。',
    dateLocale: 'zh-CN',
  },
};

function normalizeLocale(locale) {
  const raw = locale || 'en';
  return LOCALE_ALIASES[raw] || LOCALE_ALIASES[raw.toLowerCase?.()] || raw.split('-')[0] || 'en';
}

export function getPageLocale() {
  if (typeof window === 'undefined') return 'en';
  return normalizeLocale(window.pageLocale || document.documentElement.lang || 'en');
}

export function t(key, values = {}) {
  const locale = getPageLocale();
  const pack = MESSAGES[locale] || MESSAGES.en;
  const template = pack[key] || MESSAGES.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}

export function dateLocale() {
  const locale = getPageLocale();
  return (MESSAGES[locale] || MESSAGES.en).dateLocale;
}

if (typeof window !== 'undefined') {
  window.pageLocaleAPI = { getPageLocale, t, dateLocale };
  window.currentLanguage = getPageLocale();
}
