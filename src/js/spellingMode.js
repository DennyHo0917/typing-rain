import { gameState } from './gameState.js';
import { t } from './pageLocale.js';

const SAMPLE_WORDS = ['because', 'friend', 'beautiful', 'answer', 'enough', 'favorite', 'library', 'through'];
const STORAGE_KEY = 'typingRainSpellingWords';
const HEAR_KEY = 'typingRainHearWords';
const LEGACY_READ_KEY = 'typingRainReadWords';
const EASY_KEY = 'typingRainEasyMode';

export function parseWords(text) {
  return [...new Set((text || '')
    .toLowerCase()
    .split(/[^a-z'-]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && word.length <= 24))].slice(0, 80);
}

function textarea() {
  return document.getElementById('custom-word-list');
}

function status(text) {
  const el = document.getElementById('spelling-status');
  if (el) el.textContent = text;
}

function currentWords() {
  const words = parseWords(textarea()?.value || '');
  return words.length ? words : SAMPLE_WORDS;
}

function track(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

function loadWordsFromUrl() {
  const raw = new URLSearchParams(window.location.search).get('words');
  return raw ? parseWords(raw) : [];
}

export function initSpellingMode() {
  const input = textarea();
  if (!input) return;

  const fromUrl = loadWordsFromUrl();
  const saved = parseWords(localStorage.getItem(STORAGE_KEY) || '');
  input.value = (fromUrl.length ? fromUrl : saved.length ? saved : SAMPLE_WORDS).join('\n');

  const hearToggle = document.getElementById('hear-words-toggle');
  if (hearToggle) {
    hearToggle.checked = localStorage.getItem(HEAR_KEY) === '1' || localStorage.getItem(LEGACY_READ_KEY) === '1';
  }

  const easyToggle = document.getElementById('easy-mode-toggle');
  if (easyToggle) easyToggle.checked = localStorage.getItem(EASY_KEY) === '1';

  status(t('wordsReady', { count: currentWords().length }));
  input.addEventListener('input', () => status(t('wordsReady', { count: currentWords().length })));
}

export function loadSampleWords() {
  const input = textarea();
  if (!input) return;
  input.value = SAMPLE_WORDS.join('\n');
  status(t('sampleLoaded', { count: SAMPLE_WORDS.length }));
}

export function prepareSession() {
  if (!textarea()) return;
  const words = currentWords();
  gameState.spellingMode = true;
  gameState.mode = 'spelling';
  gameState.customWords = words;
  gameState.customWordCursor = 0;
  gameState.missedWordList = [];
  gameState.spellingRoundComplete = false;
  gameState.spellingWordsProcessed = 0;
  gameState.maxMisses = 5;
  gameState.level = 1;
  window.currentMode = 'spelling';

  const hearToggle = document.getElementById('hear-words-toggle');
  gameState.hearWords = !!hearToggle?.checked;
  const easyToggle = document.getElementById('easy-mode-toggle');
  gameState.easyMode = !!easyToggle?.checked;
  localStorage.setItem(STORAGE_KEY, words.join('\n'));
  localStorage.setItem(HEAR_KEY, gameState.hearWords ? '1' : '0');
  localStorage.removeItem(LEGACY_READ_KEY);
  localStorage.setItem(EASY_KEY, gameState.easyMode ? '1' : '0');
  status(t('wordsInRound', { count: words.length }));
  track('word_list_created', { word_count: words.length, easy_mode: gameState.easyMode });
}

export function getCustomWord() {
  if (!gameState.spellingMode || !gameState.customWords?.length) return null;
  const index = gameState.customWordCursor || 0;
  if (index >= gameState.customWords.length) return null;
  gameState.customWordCursor = index + 1;
  return gameState.customWords[index];
}

export function isRoundComplete(activeWordCount) {
  if (!gameState.spellingMode || !gameState.customWords?.length) return false;
  return gameState.spellingWordsProcessed >= gameState.customWords.length && activeWordCount === 0;
}

export function speakWord(word) {
  if (!gameState.spellingMode || !gameState.hearWords || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

export function markMissed(word) {
  if (!gameState.spellingMode || !word) return;
  if (!gameState.missedWordList.includes(word)) gameState.missedWordList.push(word);
  gameState.spellingWordsProcessed++;
  track('word_missed', { word });
}

export function markCorrect(word) {
  if (!gameState.spellingMode || !word) return;
  gameState.missedWordList = gameState.missedWordList.filter((item) => item !== word);
  gameState.spellingWordsProcessed++;
  track('word_completed', { word });
}

export function renderSummary() {
  const box = document.getElementById('spelling-summary');
  if (!box || !gameState.spellingMode) return;

  const missed = gameState.missedWordList || [];
  document.getElementById('game-over-title')?.replaceChildren(document.createTextNode(t('summaryTitle')));
  document.getElementById('spelling-result').textContent = missed.length
    ? t('summaryMissed', { count: missed.length })
    : t('summaryClean');

  const list = document.getElementById('missed-word-list');
  list.textContent = '';
  (missed.length ? missed : gameState.customWords).forEach((word) => {
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.textContent = word;
    list.appendChild(chip);
  });

  const replay = document.getElementById('replay-missed-btn');
  if (replay) replay.hidden = missed.length === 0;
  box.hidden = false;
  track('game_completed', { word_count: gameState.customWords.length, missed_count: missed.length });
}

export function replayMissedWords() {
  const missed = gameState.missedWordList || [];
  const input = textarea();
  if (!input || !missed.length) return;
  input.value = missed.join('\n');
  track('missed_words_replayed', { word_count: missed.length });
  window.restartGame?.(true);
}

export async function copyPracticeLink() {
  const words = currentWords();
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('words', words.join(','));
  try {
    await navigator.clipboard.writeText(url.toString());
    status(t('linkCopied'));
  } catch {
    window.prompt(t('copyPrompt'), url.toString());
    status(t('linkReady'));
  }
  track('practice_link_copied', { word_count: words.length });
}

if (typeof window !== 'undefined') {
  const api = {
    initSpellingMode,
    loadSampleWords,
    prepareSession,
    getCustomWord,
    isRoundComplete,
    speakWord,
    markMissed,
    markCorrect,
    renderSummary,
    replayMissedWords,
    copyPracticeLink,
  };
  window.spellingMode = api;
  Object.assign(window, api);
  document.addEventListener('DOMContentLoaded', initSpellingMode);
}
