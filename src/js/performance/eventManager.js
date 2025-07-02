// 优化的事件管理器 - 提供防抖、节流、高性能事件处理

/**
 * 防抖函数 - 延迟执行，在停止触发后才执行
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数 - 限制执行频率
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 高性能节流函数 - 使用requestAnimationFrame
 * @param {Function} func - 要节流的函数
 * @returns {Function} 节流后的函数
 */
export function rafThrottle(func) {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * 事件管理器类
 */
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.passiveSupported = this.checkPassiveSupport();
  }
  
  /**
   * 检查是否支持passive事件监听
   */
  checkPassiveSupport() {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }
  
  /**
   * 添加事件监听器
   * @param {Element|Window} element - 目标元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 事件处理函数
   * @param {Object} options - 配置选项
   */
  on(element, event, handler, options = {}) {
    const key = this.getListenerKey(element, event, handler);
    
    // 智能选择事件选项
    const eventOptions = this.getOptimalEventOptions(event, options);
    
    element.addEventListener(event, handler, eventOptions);
    
    this.listeners.set(key, {
      element,
      event,
      handler,
      options: eventOptions
    });
  }
  
  /**
   * 移除事件监听器
   * @param {Element|Window} element - 目标元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 事件处理函数
   */
  off(element, event, handler) {
    const key = this.getListenerKey(element, event, handler);
    const listener = this.listeners.get(key);
    
    if (listener) {
      element.removeEventListener(event, handler, listener.options);
      this.listeners.delete(key);
    }
  }
  
  /**
   * 添加防抖事件监听器
   * @param {Element|Window} element - 目标元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 事件处理函数
   * @param {number} wait - 防抖延迟时间
   * @param {Object} options - 配置选项
   */
  onDebounced(element, event, handler, wait = 300, options = {}) {
    const debouncedHandler = debounce(handler, wait, options.immediate);
    this.on(element, event, debouncedHandler, options);
    return debouncedHandler;
  }
  
  /**
   * 添加节流事件监听器
   * @param {Element|Window} element - 目标元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 事件处理函数
   * @param {number} limit - 节流限制时间
   * @param {Object} options - 配置选项
   */
  onThrottled(element, event, handler, limit = 100, options = {}) {
    const throttledHandler = throttle(handler, limit);
    this.on(element, event, throttledHandler, options);
    return throttledHandler;
  }
  
  /**
   * 添加RAF节流事件监听器
   * @param {Element|Window} element - 目标元素
   * @param {string} event - 事件类型
   * @param {Function} handler - 事件处理函数
   * @param {Object} options - 配置选项
   */
  onRAFThrottled(element, event, handler, options = {}) {
    const rafThrottledHandler = rafThrottle(handler);
    this.on(element, event, rafThrottledHandler, options);
    return rafThrottledHandler;
  }
  
  /**
   * 获取监听器唯一键
   */
  getListenerKey(element, event, handler) {
    return `${element.constructor.name}_${event}_${handler.toString().slice(0, 50)}`;
  }
  
  /**
   * 获取最优事件选项
   */
  getOptimalEventOptions(event, userOptions) {
    const options = { ...userOptions };
    
    // 为滚动和触摸事件自动设置passive
    if (this.passiveSupported && 
        (event === 'scroll' || event === 'wheel' || 
         event === 'touchstart' || event === 'touchmove') && 
        !options.hasOwnProperty('passive')) {
      options.passive = true;
    }
    
    return options;
  }
  
  /**
   * 清理所有事件监听器
   */
  destroy() {
    this.listeners.forEach(({ element, event, handler, options }) => {
      element.removeEventListener(event, handler, options);
    });
    this.listeners.clear();
  }
  
  /**
   * 获取监听器数量
   */
  getListenerCount() {
    return this.listeners.size;
  }
}

// 创建全局事件管理器实例
const globalEventManager = new EventManager();

/**
 * 键盘事件优化器
 */
class KeyboardEventOptimizer {
  constructor() {
    this.keyStates = new Map();
    this.listeners = new Map();
    this.setupGlobalListeners();
  }
  
  setupGlobalListeners() {
    // 注意：不覆盖现有的键盘事件监听器，只作为状态跟踪
    // 使用passive监听器来避免影响现有的键盘事件处理
    globalEventManager.on(document, 'keydown', (e) => {
      this.keyStates.set(e.code, true);
      // 只通知道具快捷键监听器，不影响游戏的常规按键处理
      if (e.code.startsWith('Digit') && !e.repeat) {
        this.notifyListeners('keydown', e);
      }
    }, { passive: true });
    
    globalEventManager.on(document, 'keyup', (e) => {
      this.keyStates.set(e.code, false);
      if (e.code.startsWith('Digit')) {
        this.notifyListeners('keyup', e);
      }
    }, { passive: true });
  }
  
  /**
   * 检查按键是否按下
   * @param {string} keyCode - 按键代码
   * @returns {boolean} 是否按下
   */
  isKeyPressed(keyCode) {
    return this.keyStates.get(keyCode) || false;
  }
  
  /**
   * 添加按键监听器
   * @param {string} keyCode - 按键代码
   * @param {Function} callback - 回调函数
   * @param {string} event - 事件类型 ('keydown' | 'keyup')
   */
  addKeyListener(keyCode, callback, event = 'keydown') {
    const key = `${keyCode}_${event}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
  }
  
  /**
   * 移除按键监听器
   */
  removeKeyListener(keyCode, callback, event = 'keydown') {
    const key = `${keyCode}_${event}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(key);
      }
    }
  }
  
  /**
   * 通知监听器
   */
  notifyListeners(event, e) {
    const key = `${e.code}_${event}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(e);
        } catch (error) {
          console.error('Error in key listener:', error);
        }
      });
    }
  }
  
  /**
   * 清理所有监听器
   */
  destroy() {
    this.listeners.clear();
    this.keyStates.clear();
  }
}

// 创建全局键盘事件优化器
const keyboardOptimizer = new KeyboardEventOptimizer();

/**
 * 游戏特定的事件绑定
 */
export function setupGameEvents() {
  const canvas = document.getElementById('game-canvas');
  const particlesCanvas = document.getElementById('particles-canvas');
  
  if (canvas && particlesCanvas) {
    // 优化resize事件
    globalEventManager.onThrottled(window, 'resize', () => {
      if (window.resizeCanvas) {
        window.resizeCanvas();
      }
    }, 250);
    
    // 优化scroll事件（如果需要）
    globalEventManager.onRAFThrottled(window, 'scroll', () => {
      // 处理滚动相关的游戏逻辑
    });
  }
  
  // 设置游戏专用按键 - 注意：不对 input 事件使用防抖，避免影响音频反馈
  const gameInput = document.getElementById('word-input');
  if (gameInput) {
    // 移除防抖，直接使用原生事件处理以保持音频实时反馈
    // globalEventManager.onDebounced(gameInput, 'input', (e) => {
    //   if (window.handleInput) {
    //     window.handleInput(e);
    //   }
    // }, 50);
  }
  
  // 注意：道具快捷键已在input.js中处理，避免重复添加监听器
  // for (let i = 1; i <= 6; i++) {
  //   keyboardOptimizer.addKeyListener(`Digit${i}`, () => {
  //     if (window.usePowerUp) {
  //       window.usePowerUp(i - 1);
  //     }
  //   });
  // }
}

/**
 * 清理游戏事件
 */
export function cleanupGameEvents() {
  globalEventManager.destroy();
  keyboardOptimizer.destroy();
}

/**
 * 获取事件管理器统计信息
 */
export function getEventManagerStats() {
  return {
    globalListeners: globalEventManager.getListenerCount(),
    keyboardListeners: keyboardOptimizer.listeners.size,
    passiveSupported: globalEventManager.passiveSupported
  };
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.eventManager = globalEventManager;
  window.keyboardOptimizer = keyboardOptimizer;
  window.gameEventUtils = {
    setupGameEvents,
    cleanupGameEvents,
    getStats: getEventManagerStats,
    debounce,
    throttle,
    rafThrottle
  };
  
  // 开发模式下的事件监控
  if (window.location.hostname === 'localhost') {
    window.eventPerf = {
      logStats: () => {
        const stats = getEventManagerStats();
        console.log('Event Manager Stats:', stats);
        return stats;
      },
      monitorEventLoad: () => {
        setInterval(() => {
          const stats = getEventManagerStats();
          if (stats.globalListeners > 50) {
            console.warn('High event listener count:', stats.globalListeners);
          }
        }, 10000);
      }
    };
  }
} 