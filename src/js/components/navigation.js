// 共享导航组件 - 统一管理顶部导航栏

/**
 * 生成顶部导航栏HTML
 * @returns {string} 导航栏HTML字符串
 */
export function generateTopNavHTML() {
  return `
    <div class="top-right-nav">
        <div class="language-switcher">
            <button class="lang-btn" onclick="toggleLanguageMenu()" id="lang-toggle" data-i18n-title="changeLanguage" title="Change Language">🌐</button>
            <div class="lang-menu" id="lang-menu">
                <div class="lang-option" onclick="switchLanguage('en')">🇺🇸 English</div>
                <div class="lang-option" onclick="switchLanguage('zh-tw')">🇹🇼 繁體中文</div>
                <div class="lang-option" onclick="switchLanguage('zh-cn')">🇨🇳 简体中文</div>
                <div class="lang-option" onclick="switchLanguage('ja')">🇯🇵 日本語</div>
                <div class="lang-option" onclick="switchLanguage('ko')">🇰🇷 한국어</div>
                <div class="lang-option" onclick="switchLanguage('de')">🇩🇪 Deutsch</div>
                <div class="lang-option" onclick="switchLanguage('fr')">🇫🇷 Français</div>
                <div class="lang-option" onclick="switchLanguage('es')">🇪🇸 Español</div>
                <div class="lang-option" onclick="switchLanguage('it')">🇮🇹 Italiano</div>
                <div class="lang-option" onclick="switchLanguage('ru')">🇷🇺 Русский</div>
                <div class="lang-option" onclick="switchLanguage('pt')">🇵🇹 Português</div>
            </div>
        </div>
        <div class="mode-switcher">
            <button class="lang-btn" onclick="toggleModeMenu()" id="mode-toggle" data-i18n-title="selectMode" title="Select Mode">🕹️</button>
            <div class="lang-menu" id="mode-menu">
                <div class="lang-option" onclick="chooseMode('level')" data-i18n="levelModeTitle">🎮 Level Mode</div>
                <div class="lang-option" onclick="chooseMode('practice')" data-i18n="practiceModeTitle">🎓 Practice Mode</div>
                <div class="lang-option" onclick="chooseMode('tournament')" data-i18n="tournamentModeTitle">🏆 Tournament Mode</div>
            </div>
        </div>
        <button class="share-btn" onclick="shareToTwitterLegacy()" data-i18n-title="shareOnTwitter" title="Share on X (Twitter)">📤</button>
        <button class="privacy-btn" onclick="showPrivacyPolicyLegacy()" data-i18n-title="privacyPolicyTooltip" title="Privacy Policy">🔒</button>
        <button class="sound-btn" onclick="toggleSound()" id="sound-toggle" data-i18n-title-dynamic="sound">🔊</button>
    </div>
  `;
}

/**
 * 生成游戏说明HTML
 * @returns {string} 游戏说明HTML字符串
 */
export function generateGameInstructionsHTML() {
  return `
    <div class="game-instructions">
        <div class="instructions-content">
            <h3>How to Play</h3>
            <p>• Type the falling words before they reach the bottom</p>
            <p>• Press <kbd>Enter</kbd> or <kbd>Space</kbd> to submit your word</p>
            <p>• Build combos by typing words consecutively</p>
            <p>• Higher levels bring faster and more challenging words</p>
            <p>• You have 5 chances to miss words before game over</p>
            
            <h4 style="color: #00f5ff; margin-top: 15px; margin-bottom: 8px;" data-i18n="powerUpsTitle">Power-ups</h4>
            <p>• ⏰ <strong data-i18n="powerUpNames.slowTime">Slow Time</strong> (1) - <span data-i18n="powerUpDescriptions.slowTime">Slows word falling speed</span></p>
            <p>• 🎯 <strong data-i18n="powerUpNames.precisionMode">Precision Mode</strong> (2) - <span data-i18n="powerUpDescriptions.precisionMode">Only need first 3 letters</span></p>
            <p>• 💎 <strong data-i18n="powerUpNames.doubleScore">Double Score</strong> (3) - <span data-i18n="powerUpDescriptions.doubleScore">2x points for next words</span></p>
            <p>• 🛡️ <strong data-i18n="powerUpNames.shield">Shield</strong> (4) - <span data-i18n="powerUpDescriptions.shield">Protects from missing words</span></p>
            <p>• 🌟 <strong data-i18n="powerUpNames.comboProtect">Combo Protect</strong> (5) - <span data-i18n="powerUpDescriptions.comboProtect">Maintains combo streak</span></p>
            <p>• 🔄 <strong data-i18n="powerUpNames.refreshWords">Word Refresh</strong> (6) - <span data-i18n="powerUpDescriptions.refreshWords">Clears screen, adds easy words</span></p>
            <p style="font-size: 0.9em; color: #4ecdc4;" data-i18n="powerUpsDesc">Earn power-ups by completing words and building combos! Each power-up has a fixed key.</p>
        </div>
    </div>
  `;
}

/**
 * 生成道具容器HTML
 * @returns {string} 道具容器HTML字符串
 */
export function generatePowerUpsContainerHTML() {
  return `
    <div class="power-ups-container">
        <div class="power-ups-title" data-i18n="powerUpsKeysHint">Power-ups (1:⏰ 2:🎯 3:💎 4:🛡️ 5:🌟 6:🔄)</div>
        <div class="power-ups-grid" id="power-ups-grid">
            <!-- 道具将在这里动态显示 -->
        </div>
        <div class="active-effects" id="active-effects">
            <!-- 激活的道具效果显示在这里 -->
        </div>
    </div>
  `;
}

/**
 * 生成完整的左侧面板HTML
 * @returns {string} 左侧面板HTML字符串
 */
export function generateLeftPanelHTML() {
  return `
    <div class="left-panel">
        ${generateGameInstructionsHTML()}
        ${generatePowerUpsContainerHTML()}
    </div>
  `;
}

/**
 * 注入导航组件到页面
 * @param {string} containerSelector - 容器选择器
 */
export function injectTopNavigation(containerSelector = 'body') {
  const container = document.querySelector(containerSelector);
  if (container) {
    const existingNav = container.querySelector('.top-right-nav');
    if (existingNav) {
      existingNav.remove();
    }
    container.insertAdjacentHTML('afterbegin', generateTopNavHTML());
  }
}

/**
 * 注入左侧面板到页面
 * @param {string} containerSelector - 容器选择器
 */
export function injectLeftPanel(containerSelector = '.main-content-wrapper') {
  const container = document.querySelector(containerSelector);
  if (container) {
    const existingPanel = container.querySelector('.left-panel');
    if (existingPanel) {
      existingPanel.remove();
    }
    container.insertAdjacentHTML('afterbegin', generateLeftPanelHTML());
  }
}

// 暴露到全局供旧代码使用
if (typeof window !== 'undefined') {
  window.navigationComponents = {
    generateTopNavHTML,
    generateGameInstructionsHTML,
    generatePowerUpsContainerHTML,
    generateLeftPanelHTML,
    injectTopNavigation,
    injectLeftPanel
  };
} 