// 排行榜功能模块化实现

const LEADERBOARD_KEY = 'typingRainLeaderboard';
let currentPlayerEntry = null;

export function getLeaderboard() {
  const saved = localStorage.getItem(LEADERBOARD_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveLeaderboard(list) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
}

export function addToLeaderboard(name, score, level, wpm, accuracy) {
  const leaderboard = getLeaderboard();
  const entry = {
    name: name || 'Anonymous',
    score,
    level,
    wpm,
    accuracy,
    date: new Date().toLocaleDateString(),
  };
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard.splice(10);
  saveLeaderboard(leaderboard);
  currentPlayerEntry = entry;
  return entry;
}

export function isHighScore(score) {
  const leaderboard = getLeaderboard();
  return leaderboard.length < 10 || score > leaderboard[leaderboard.length - 1].score;
}

function createEntryDiv(entry, index) {
  const div = document.createElement('div');
  div.className = 'leaderboard-entry';
  if (
    currentPlayerEntry &&
    entry.name === currentPlayerEntry.name &&
    entry.score === currentPlayerEntry.score &&
    entry.date === currentPlayerEntry.date
  ) {
    div.classList.add('current-player');
  }
  div.innerHTML = `
    <div class="entry-rank">#${index + 1}</div>
    <div class="entry-name">${entry.name}</div>
    <div class="entry-score">${entry.score}</div>`;
  return div;
}

export function showLeaderboard() {
  const leaderboardEl = document.getElementById('leaderboard');
  const listEl = document.getElementById('leaderboard-list');
  if (!leaderboardEl || !listEl) return;

  const data = getLeaderboard();
  listEl.innerHTML = '';
  if (data.length === 0) {
    listEl.innerHTML = '<div class="empty-leaderboard">No scores yet. Be the first to play!</div>';
  } else {
    data.forEach((entry, idx) => listEl.appendChild(createEntryDiv(entry, idx)));
  }

  document.getElementById('game-over')?.style && (document.getElementById('game-over').style.display = 'none');
  leaderboardEl.style.display = 'flex';
}

export function closeLeaderboard() {
  const leaderboardEl = document.getElementById('leaderboard');
  if (leaderboardEl) leaderboardEl.style.display = 'none';
  const gameOver = document.getElementById('game-over');
  if (gameOver) gameOver.style.display = 'flex';
}

export const leaderboard = {
  getLeaderboard,
  saveLeaderboard,
  addToLeaderboard,
  showLeaderboard,
  closeLeaderboard,
  isHighScore,
};

// 同步到全局，兼容旧代码
if (typeof window !== 'undefined') {
  Object.assign(window, leaderboard);
  window.leaderboardBridge = leaderboard;
  window.LEADERBOARD_KEY = LEADERBOARD_KEY;
  window.currentPlayerEntry = currentPlayerEntry;
} 