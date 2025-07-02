// Bridge module to access legacy language UI functions until full refactor.
import { languages } from '../languages.js';
import { initLanguageSystem as initLangSystem } from '../language.js';

export function updateLanguage() {
  if (typeof window.updateLanguage === 'function') {
    window.updateLanguage();
  }
}

export function switchLanguage(lang) {
  if (typeof window.switchLanguage === 'function') {
    window.switchLanguage(lang);
  } else {
    // fallback: simple assign and call update
    if (languages[lang]) {
      window.currentLanguage = lang;
      updateLanguage();
    }
  }
}

export function initLanguageSystem() {
  // 使用新的语言系统初始化
  initLangSystem();
  
  // 兼容旧的初始化逻辑
  if (typeof window.initLanguage === 'function') {
    window.initLanguage();
  }
  
  // 确保语言更新
  updateLanguage();
}

if (typeof window !== 'undefined') {
  if (typeof window.updateLanguage !== 'function') {
    window.updateLanguage = () => {
      const currentLang = window.currentLanguage || 'en';
      const pack = languages[currentLang] || languages['en'];
      if (!pack) return;
  
      const q = (sel) => document.querySelector(sel);
      
      // 使用统一的SEO模块
      if (typeof window !== 'undefined' && window.seoModule && window.seoModule.updateSEOForLanguage) {
        window.seoModule.updateSEOForLanguage(currentLang);
      }
      
      // 基本标题区域
      q('.game-title') && (q('.game-title').textContent = pack.gameTitle);
      q('.start-title') && (q('.start-title').textContent = pack.gameTitle);
      
      // 根据模式设置副标题
      const subtitleEl = q('.start-subtitle');
      if (subtitleEl) {
        const mode = window.currentMode || 'level';
        switch(mode) {
          case 'practice':
            subtitleEl.textContent = pack.practiceModeTitle || pack.gameSubtitle;
            break;
          case 'tournament':
            subtitleEl.textContent = pack.tournamentModeTitle || pack.gameSubtitle;
            break;
          default: // level mode
            subtitleEl.textContent = pack.levelModeTitle || pack.gameSubtitle;
        }
      }

      // 按钮
      if (q('.start-btn') && window.currentMode === 'tournament') {
        q('.start-btn').textContent = pack.findMatch || pack.startGame;
      } else if (q('.start-btn')) {
        q('.start-btn').textContent = pack.startGame;
      }
      document.querySelectorAll('.restart-btn').forEach((btn) => {
        btn.textContent = pack.playAgain;
      });

      // Game Over & Name Input
      q('.game-over-title') && (q('.game-over-title').textContent = pack.gameOver);
      q('.name-input-title') && (q('.name-input-title').textContent = pack.highScore);
      q('.leaderboard-title') && (q('.leaderboard-title').textContent = pack.leaderboard);

      // 左侧 How to Play 标题
      const instrTitle = document.querySelector('.instructions-content h3');
      instrTitle && (instrTitle.textContent = pack.howToPlay);

      // 游戏开始界面描述 - 根据模式设置不同描述
      const startDescEl = document.querySelector('.start-description');
      if (startDescEl) {
        const mode = window.currentMode || 'level';
        
        switch(mode) {
          case 'practice':
            const practiceDesc1 = pack.practiceModeDesc1 || pack.mainDesc1;
            const practiceDesc2 = pack.practiceModeDesc2 || pack.mainDesc2;
            startDescEl.innerHTML = `${practiceDesc1 || ''}${practiceDesc1 && practiceDesc2 ? '<br>' : ''}${practiceDesc2 || ''}`;
            break;
            
          case 'tournament':
            const defaultRules = `
              <strong>Tournament Rules</strong><br>
              • Each run lasts <strong>2&nbsp;minutes</strong>.<br>
              • Total score = 0.6×typed points + 10×WPM + 5×accuracy − 20×misses.<br>
              • Rankings are based on highest total score.<br>
              • Same rules apply to every contestant.`;
            const tournamentDesc1 = pack.tournamentModeDesc1;
            const tournamentDesc2 = pack.tournamentModeDesc2;
            if (tournamentDesc1 || tournamentDesc2) {
              startDescEl.innerHTML = `${tournamentDesc1 || ''}${tournamentDesc1 && tournamentDesc2 ? '<br>' : ''}${tournamentDesc2 || ''}`;
            } else {
              startDescEl.innerHTML = pack.tournamentRules || defaultRules;
            }
            break;
            
          default: // level mode
            const levelDesc1 = pack.levelModeDesc1 || pack.mainDesc1;
            const levelDesc2 = pack.levelModeDesc2 || pack.mainDesc2;
            if (pack.startDescription) {
              startDescEl.innerHTML = pack.startDescription;
            } else {
              startDescEl.innerHTML = `${levelDesc1 || ''}${levelDesc1 && levelDesc2 ? '<br>' : ''}${levelDesc2 || ''}`;
            }
        }
      }

      // 简要指令段落
      const instrParas = document.querySelectorAll('.instructions-content p');
      pack.instructions && instrParas.forEach((p, idx) => {
        if (pack.instructions[idx]) p.textContent = pack.instructions[idx];
      });

      // 统计标签
      const statLabels = document.querySelectorAll('.stat-label');
      statLabels.forEach((label) => {
        const key = label.getAttribute('data-key');
        if (key && pack[key]) label.textContent = pack[key];
      });

      // === 修改：处理所有data-i18n属性的元素（支持嵌套属性）===
      document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.getAttribute('data-i18n');
        if (key) {
          // 支持嵌套属性访问，如 "powerUpNames.comboProtect"
          const value = key.split('.').reduce((obj, prop) => obj && obj[prop], pack);
          if (value) {
            // 特殊处理模式选择器，保留图标emoji
            if (key === 'levelModeTitle') {
              element.textContent = '🎮 ' + value;
            } else if (key === 'practiceModeTitle') {
              element.textContent = '🎓 ' + value;
            } else if (key === 'tournamentModeTitle') {
              element.textContent = '🏆 ' + value;
            } else {
              element.textContent = value;
            }
          }
        }
      });

      // === 处理data-i18n-placeholder属性的元素 ===
      document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (key && pack[key]) {
          element.placeholder = pack[key];
        }
      });

      // === 处理data-i18n-title属性的元素 ===
      document.querySelectorAll('[data-i18n-title]').forEach((element) => {
        const key = element.getAttribute('data-i18n-title');
        if (key) {
          // 支持嵌套属性访问，如 "powerUpNames.comboProtect"
          const value = key.split('.').reduce((obj, prop) => obj && obj[prop], pack);
          if (value) {
            element.title = value;
          }
        }
      });

      // === 处理data-i18n-title-dynamic属性的元素（特殊处理声音按钮） ===
      document.querySelectorAll('[data-i18n-title-dynamic]').forEach((element) => {
        const key = element.getAttribute('data-i18n-title-dynamic');
        if (key === 'sound') {
          // 根据当前声音状态设置title
          const soundEnabled = window.soundEnabled !== false;
          const titleKey = soundEnabled ? 'soundOn' : 'soundOff';
          if (pack[titleKey]) {
            element.title = pack[titleKey];
          }
        }
      });

      // === 处理排行榜空状态消息 ===
      const emptyLeaderboard = document.querySelector('.empty-leaderboard');
      if (emptyLeaderboard && pack.emptyLeaderboard) {
        emptyLeaderboard.textContent = pack.emptyLeaderboard;
      }

      // --- Privacy Policy dynamic section ---
      const privacyWrap = document.querySelector('#privacy-policy .privacy-content');
      if (privacyWrap) {
        // 标题与按钮
        const privacyTitleEl = privacyWrap.querySelector('.privacy-title');
        privacyTitleEl && (privacyTitleEl.textContent = pack.privacyPolicy || privacyTitleEl.textContent);

        const closeBtn = privacyWrap.querySelector('.close-privacy-btn');
        closeBtn && (closeBtn.textContent = pack.close || closeBtn.textContent);

        const clearBtn = privacyWrap.querySelector('.clear-data-btn');
        clearBtn && (clearBtn.textContent = pack.clearMyData || clearBtn.textContent);

        // 内容主体
        const pText = (lines) => lines.map((l) => `<p>${l}</p>`).join('');
        const privacyHTMLParts = [];
        if (pack.dataCollection) {
          privacyHTMLParts.push(`<h3>${pack.dataCollection}</h3>`);
        }
        if (pack.privacyIntro) {
          privacyHTMLParts.push(`<p>${pack.privacyIntro}</p>`);
        }

        const sectionMap = [
          { key: 'localStorage', descKey: 'localStorageDesc' },
          { key: 'analytics', descKey: 'analyticsDesc' },
          { key: 'advertising', descKey: 'advertisingDesc' },
          { key: 'yourRights', descKey: 'rightsDesc' },
          { key: 'contact', descKey: 'contactDesc' },
        ];

        sectionMap.forEach(({ key, descKey }) => {
          if (pack[key]) {
            privacyHTMLParts.push(`<h4>${pack[key]}</h4>`);
            if (Array.isArray(pack[descKey])) {
              privacyHTMLParts.push(pText(pack[descKey]));
            } else if (pack[descKey]) {
              privacyHTMLParts.push(`<p>${pack[descKey]}</p>`);
            }
          }
        });

        // 最后更新时间
        if (pack.lastUpdated) {
          const dateStr = new Date().toLocaleDateString(currentLang);
          privacyHTMLParts.push(`<p class="privacy-update">${pack.lastUpdated} <span id="privacy-date">${dateStr}</span></p>`);
        }

        const privacyTextEl = privacyWrap.querySelector('.privacy-text');
        if (privacyTextEl) {
          privacyTextEl.innerHTML = privacyHTMLParts.join('\n');
        }
      }

      // --- Below-game SEO long content ---
      const belowGameWrap = document.querySelector('.below-game');
      if (belowGameWrap) {
        // 如果存在 seoTitle1，则构建整段内容。
        if (pack.seoTitle1) {
          const buildSeoSections = () => {
            const parts = [];
            let idx = 1;
            // 标题 + 段落
            while (pack[`seoTitle${idx}`]) {
              parts.push(`<h2>${pack[`seoTitle${idx}`]}</h2>`);
              if (pack[`seoPara${idx}`]) {
                parts.push(`<p>${pack[`seoPara${idx}`]}</p>`);
              }
              // 规则或提示列表
              const ruleKey = idx === 3 ? 'seoRules' : idx === 4 ? 'seoTips' : null;
              if (ruleKey && Array.isArray(pack[ruleKey])) {
                const liList = pack[ruleKey].map((item) => `<li>${item}</li>`).join('');
                parts.push(`<ul style="text-align: left; max-width: 800px;">${liList}</ul>`);
              }
              idx++;
            }
            // 结论
            if (pack.seoConclusion) {
              parts.push(`<p>${pack.seoConclusion}</p>`);
            }
            return parts.join('\n');
          };
          belowGameWrap.innerHTML = buildSeoSections();
        } else if (pack.mainTitle) {
          // Fallback 使用 mainTitle/Desc
          belowGameWrap.innerHTML = `
            <h2>${pack.mainTitle}</h2>
            ${pack.mainDesc1 ? `<p>${pack.mainDesc1}</p>` : ''}
            ${pack.mainDesc2 ? `<p>${pack.mainDesc2}</p>` : ''}`;
        }
      }

      // --- SEO dynamic section ---
      const seoWrap = document.getElementById('seo-content');
      if (seoWrap) {
        if (pack.seo) {
          // 新结构：pack.seo = { title, para1, para2, conclusion }
          seoWrap.innerHTML = `
            <h1>${pack.seo.title}</h1>
            <p>${pack.seo.para1}</p>
            <p>${pack.seo.para2}</p>
            <p>${pack.seo.conclusion}</p>`;
        } else if (pack.mainTitle) {
          // 兼容旧字段：mainTitle / mainDesc1 / mainDesc2 / seoConclusion
          const para1 = pack.mainDesc1 || pack.seoPara1 || '';
          const para2 = pack.mainDesc2 || pack.seoPara2 || '';
          const conclusion = pack.seoConclusion || '';
          seoWrap.innerHTML = `
            <h1>${pack.mainTitle}</h1>
            ${para1 ? `<p>${para1}</p>` : ''}
            ${para2 ? `<p>${para2}</p>` : ''}
            ${conclusion ? `<p>${conclusion}</p>` : ''}`;
        } else if (pack.seoTitle1) {
          // 另一种旧字段格式：seoTitle1/seoPara1...
          const buildParagraphs = () => {
            const htmlParts = [];
            let i = 1;
            while (pack[`seoPara${i}`]) {
              htmlParts.push(`<p>${pack[`seoPara${i}`]}</p>`);
              i++;
            }
            return htmlParts.join('');
          };
          seoWrap.innerHTML = `
            <h1>${pack.seoTitle1}</h1>
            ${buildParagraphs()}`;
        }
      }

      // 设置全局总分标签
      window.totalScoreLabel = pack.totalScoreLabel || 'Total Score';

      // Practice 模式标签更新
      if (window.currentMode === 'practice') {
        const setLabel = (id, text) => {
          const el = document.getElementById(id);
          if (el && text) {
            // text node 在 label 的第一个 child
            if (el.childNodes.length > 0) {
              el.childNodes[0].nodeValue = text + ': ';
            }
          }
        };
        setLabel('duration-label', pack.durationLabel);
        setLabel('difficulty-label', pack.difficultyLabel);
        setLabel('speed-label', pack.speedLabel);
      }

      // Tournament 开始按钮文本
      const startBtn = document.getElementById('start-tournament-btn');
      if (startBtn && pack.startTournament) startBtn.textContent = pack.startTournament;

      // 结算面板 Duration / Missed 标签
      const durationRow = document.getElementById('duration-row');
      if (durationRow && pack.durationLabel) {
        const parts = durationRow.innerHTML.split(':');
        durationRow.innerHTML = `${pack.durationLabel}:${parts.slice(1).join(':')}`;
      }
      const missedEl = document.getElementById('final-missed');
      if (missedEl && pack.missedLabel) {
        const row = missedEl.parentElement;
        if (row && row.childNodes.length > 0) {
          row.childNodes[0].nodeValue = pack.missedLabel + ': ';
        }
      }

      // 更新道具显示（如果存在）
      if (typeof window.updatePowerUpDisplay === 'function') {
        window.updatePowerUpDisplay();
      }
    };
  }
  if (typeof window.toggleLanguageMenu !== 'function') {
    window.toggleLanguageMenu = () => {
      const menu = document.getElementById('lang-menu');
      if (menu) menu.classList.toggle('show');
    };
  }
  if (typeof window.toggleModeMenu !== 'function') {
    window.toggleModeMenu = () => {
      const menu = document.getElementById('mode-menu');
      if (menu) menu.classList.toggle('show');
    };
  }
  if (typeof window.chooseMode !== 'function') {
    window.chooseMode = (mode) => {
      if (mode === 'practice') {
        window.location.href = 'practice.html';
      } else if (mode === 'tournament') {
        window.location.href = 'tournament.html';
      } else {
        window.location.href = 'index.html';
      }
      const menu = document.getElementById('mode-menu');
      if (menu) menu.classList.remove('show');
    };
  }
}