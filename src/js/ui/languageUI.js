// Bridge module to access legacy language UI functions until full refactor.
import { languages } from '../languages.js';

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
  if (typeof window.initLanguage === 'function') {
    window.initLanguage();
  } else {
    // fallback: set default language and update
    window.currentLanguage = window.currentLanguage || 'en';
    updateLanguage();
  }
}

if (typeof window !== 'undefined') {
  if (typeof window.updateLanguage !== 'function') {
    window.updateLanguage = () => {
      const currentLang = window.currentLanguage || 'en';
      const pack = languages[currentLang] || languages['en'];
      if (!pack) return;

      const q = (sel) => document.querySelector(sel);
      // 基本标题区域
      q('.game-title') && (q('.game-title').textContent = pack.gameTitle);
      q('.start-title') && (q('.start-title').textContent = pack.gameTitle);
      q('.start-subtitle') && (q('.start-subtitle').textContent = pack.gameSubtitle);

      // 按钮
      q('.start-btn') && (q('.start-btn').textContent = pack.startGame);
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

      // 游戏开始界面描述
      const startDescEl = document.querySelector('.start-description');
      if (startDescEl) {
        if (pack.startDescription) {
          startDescEl.innerHTML = pack.startDescription;
        } else if (pack.mainDesc1 || pack.mainDesc2) {
          startDescEl.innerHTML = `${pack.mainDesc1 || ''}${pack.mainDesc1 && pack.mainDesc2 ? '<br>' : ''}${pack.mainDesc2 || ''}`;
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
    };
  }
  if (typeof window.toggleLanguageMenu !== 'function') {
    window.toggleLanguageMenu = () => {
      const menu = document.getElementById('lang-menu');
      if (menu) menu.classList.toggle('show');
    };
  }
} 