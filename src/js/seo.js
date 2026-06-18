const BASE_URL = 'https://your-domain.example';

const HOME_SEO = {
  title: 'Custom Spelling Words Game | SpellRain',
  description: 'Paste a weekly spelling list into SpellRain and play a custom spelling words game. Replay missed words and share a no-login practice link.',
  keywords: 'custom spelling words game,spelling list game,spelling words typing game,spelling practice with own words,weekly spelling list game,sight word typing game,homeschool spelling practice,classroom spelling game,spelling test practice,no login spelling practice',
  url: `${BASE_URL}/`,
  image: `${BASE_URL}/images/typing-rain-og.png`,
};

function upsertMeta(attribute, value, content) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function upsertCanonical(href) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

export function updateSEOTags(seoData = HOME_SEO) {
  document.title = seoData.title;
  upsertMeta('name', 'description', seoData.description);
  upsertMeta('name', 'keywords', seoData.keywords);
  upsertMeta('property', 'og:title', 'Custom Spelling Words Game | SpellRain');
  upsertMeta('property', 'og:description', 'Paste this week\'s spelling list, play it as falling words, then replay missed words.');
  upsertMeta('property', 'og:url', seoData.url);
  upsertMeta('property', 'og:image', seoData.image);
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:alt', 'SpellRain custom spelling words game preview');
  upsertMeta('name', 'twitter:title', 'Custom Spelling Words Game | SpellRain');
  upsertMeta('name', 'twitter:description', 'Paste a weekly spelling list, play it as falling words, then replay missed words.');
  upsertMeta('name', 'twitter:image', seoData.image);
  upsertCanonical(seoData.url);
}

export function generateFAQStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I use my own spelling words?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Paste a weekly spelling list and SpellRain will use those exact words in the falling-word game.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can students replay missed words?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Missed words are saved at the end of the round so students can replay only the words that need more practice.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do students need an account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. SpellRain works in the browser with no student account, class setup, or login.',
        },
      },
    ],
  };
}

if (typeof window !== 'undefined') {
  window.seoModule = {
    updateSEOTags,
    generateFAQStructuredData,
  };
}
