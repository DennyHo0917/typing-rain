(function () {
  const PREF_KEY = 'mySpellingGamePreferredLocale';
  const SESSION_KEY = 'mySpellingGameAutoLocaleRedirected';

  const localePaths = {
    en: '',
    es: '/es',
    'pt-BR': '/pt-br',
    fr: '/fr',
    id: '/id',
    zh: '/zh',
  };

  const localizedSlugs = new Set([
    '',
    'about',
    'contact',
    'privacy',
    'custom-spelling-words-game',
    'homeschool-spelling-practice',
    'sight-word-typing-game',
    'spelling-list-game',
    'vocabulary-typing-game',
    'weekly-spelling-practice',
  ]);

  function normalizeLocale(locale) {
    const value = String(locale || '').toLowerCase();
    if (value.startsWith('zh')) return 'zh';
    if (value.startsWith('pt')) return 'pt-BR';
    if (value.startsWith('es')) return 'es';
    if (value.startsWith('fr')) return 'fr';
    if (value.startsWith('id') || value.startsWith('in')) return 'id';
    return 'en';
  }

  function slugFromPath(pathname) {
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    if (cleanPath === '/' || cleanPath === '/index.html') return '';
    if (!cleanPath.startsWith('/')) return null;
    const bare = cleanPath.slice(1);
    if (bare.includes('/')) return null;
    return bare.replace(/\.html$/, '');
  }

  function targetFor(locale, slug) {
    if (!localizedSlugs.has(slug) || locale === 'en') return null;
    const prefix = localePaths[locale];
    if (prefix === undefined) return null;
    if (slug === '') return `${prefix}/`;
    return `${prefix}/${slug}`;
  }

  function readStoredLocale() {
    try {
      const stored = localStorage.getItem(PREF_KEY);
      return stored ? normalizeLocale(stored) : '';
    } catch (_) {
      return '';
    }
  }

  function writeStoredLocale(locale) {
    try {
      localStorage.setItem(PREF_KEY, normalizeLocale(locale));
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (_) {
      // Storage can be blocked in private or hardened browsers.
    }
  }

  function browserLocale() {
    const languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    for (const language of languages) {
      const locale = normalizeLocale(language);
      if (locale !== 'en') return locale;
    }
    return 'en';
  }

  document.addEventListener('click', function (event) {
    const link = event.target.closest && event.target.closest('a.lang-option[hreflang]');
    if (!link) return;
    writeStoredLocale(link.getAttribute('hreflang'));
  });

  const slug = slugFromPath(window.location.pathname);
  if (slug === null) return;
  if (!localizedSlugs.has(slug)) return;

  const params = new URLSearchParams(window.location.search);
  const queryLocale = params.get('lang');
  if (queryLocale) {
    writeStoredLocale(queryLocale);
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
    return;
  }

  const preferredLocale = readStoredLocale();
  const preferredTarget = targetFor(preferredLocale, slug);
  if (preferredTarget) {
    window.location.replace(preferredTarget + window.location.search + window.location.hash);
    return;
  }
  if (preferredLocale === 'en') return;

  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch (_) {
    // Continue without session memory; the URL guard still prevents loops.
  }

  const detectedTarget = targetFor(browserLocale(), slug);
  if (detectedTarget) {
    window.location.replace(detectedTarget + window.location.search + window.location.hash);
  }
})();
