// 全局错误处理和兼容性系统

/**
 * 错误处理器类
 */
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
    this.isProduction = window.location.hostname !== 'localhost';
    this.setupGlobalHandlers();
  }
  
  /**
   * 设置全局错误处理器
   */
  setupGlobalHandlers() {
    // 捕获 JavaScript 错误
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error,
        timestamp: Date.now()
      });
    });
    
    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        error: event.reason,
        timestamp: Date.now()
      });
    });
    
    // 捕获资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError({
          type: 'resource',
          message: `Failed to load resource: ${event.target.src || event.target.href}`,
          element: event.target.tagName,
          timestamp: Date.now()
        });
      }
    }, true);
  }
  
  /**
   * 处理错误
   * @param {Object} errorInfo - 错误信息
   */
  handleError(errorInfo) {
    // 记录错误
    this.logError(errorInfo);
    
    // 在开发模式下显示详细错误
    if (!this.isProduction) {
      console.error('Game Error:', errorInfo);
    }
    
    // 显示用户友好的错误信息
    this.showUserError(errorInfo);
    
    // 尝试自动恢复
    this.attemptRecovery(errorInfo);
  }
  
  /**
   * 记录错误到内存
   * @param {Object} errorInfo - 错误信息
   */
  logError(errorInfo) {
    this.errors.push(errorInfo);
    
    // 限制错误数量，避免内存泄漏
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
  }
  
  /**
   * 显示用户友好的错误信息
   * @param {Object} errorInfo - 错误信息
   */
  showUserError(errorInfo) {
    const userMessage = this.getUserFriendlyMessage(errorInfo);
    
    // 创建错误提示元素
    const errorToast = this.createErrorToast(userMessage);
    document.body.appendChild(errorToast);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (errorToast.parentNode) {
        errorToast.parentNode.removeChild(errorToast);
      }
    }, 3000);
  }
  
  /**
   * 创建错误提示元素
   * @param {string} message - 错误消息
   * @returns {HTMLElement} 错误提示元素
   */
  createErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 107, 107, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 10000;
      font-family: 'Rajdhani', sans-serif;
      font-size: 14px;
      max-width: 300px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: slideInRight 0.3s ease-out;
    `;
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">⚠️</span>
        <span>${message}</span>
      </div>
    `;
    
    // 添加动画样式
    if (!document.getElementById('error-toast-styles')) {
      const styles = document.createElement('style');
      styles.id = 'error-toast-styles';
      styles.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    return toast;
  }
  
  /**
   * 获取用户友好的错误消息
   * @param {Object} errorInfo - 错误信息
   * @returns {string} 用户友好的消息
   */
  getUserFriendlyMessage(errorInfo) {
    const messages = {
      javascript: '游戏运行时出现问题，正在尝试恢复...',
      promise: '数据加载失败，请检查网络连接',
      resource: '资源加载失败，请刷新页面重试',
      canvas: '图形渲染出现问题，请检查浏览器兼容性',
      audio: '音频播放失败，游戏将继续无声运行',
      storage: '数据保存失败，请检查浏览器设置'
    };
    
    return messages[errorInfo.type] || '遇到未知错误，请刷新页面重试';
  }
  
  /**
   * 尝试自动恢复
   * @param {Object} errorInfo - 错误信息
   */
  attemptRecovery(errorInfo) {
    switch (errorInfo.type) {
      case 'canvas':
        this.recoverCanvas();
        break;
      case 'audio':
        this.recoverAudio();
        break;
      case 'storage':
        this.recoverStorage();
        break;
      case 'javascript':
        this.recoverGameState();
        break;
    }
  }
  
  /**
   * 恢复画布
   */
  recoverCanvas() {
    try {
      const canvas = document.getElementById('game-canvas');
      if (canvas && window.resizeCanvas) {
        window.resizeCanvas();
      }
    } catch (e) {
      console.warn('Canvas recovery failed:', e);
    }
  }
  
  /**
   * 恢复音频
   */
  recoverAudio() {
    try {
      if (window.initAudio) {
        window.initAudio();
      }
    } catch (e) {
      console.warn('Audio recovery failed:', e);
    }
  }
  
  /**
   * 恢复存储
   */
  recoverStorage() {
    try {
      // 测试localStorage是否可用
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      // 如果localStorage不可用，使用内存存储
      this.setupMemoryStorage();
    }
  }
  
  /**
   * 恢复游戏状态
   */
  recoverGameState() {
    try {
      if (window.gameState && window.resetGameState) {
        window.resetGameState();
      }
    } catch (e) {
      console.warn('Game state recovery failed:', e);
    }
  }
  
  /**
   * 设置内存存储（localStorage不可用时的降级方案）
   */
  setupMemoryStorage() {
    if (!window.memoryStorage) {
      window.memoryStorage = new Map();
      
      // 模拟localStorage接口
      window.localStorage = {
        setItem: (key, value) => window.memoryStorage.set(key, value),
        getItem: (key) => window.memoryStorage.get(key) || null,
        removeItem: (key) => window.memoryStorage.delete(key),
        clear: () => window.memoryStorage.clear(),
        get length() { return window.memoryStorage.size; },
        key: (index) => Array.from(window.memoryStorage.keys())[index] || null
      };
    }
  }
  
  /**
   * 获取错误统计
   * @returns {Object} 错误统计信息
   */
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      recent: this.errors.slice(-10)
    };
    
    this.errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });
    
    return stats;
  }
  
  /**
   * 清理错误日志
   */
  clearErrors() {
    this.errors.length = 0;
  }
  
  /**
   * 手动报告错误
   * @param {string} type - 错误类型
   * @param {string} message - 错误消息
   * @param {Object} extra - 额外信息
   */
  reportError(type, message, extra = {}) {
    this.handleError({
      type,
      message,
      ...extra,
      timestamp: Date.now(),
      manual: true
    });
  }
}

/**
 * 浏览器兼容性检查器
 */
class CompatibilityChecker {
  constructor() {
    this.features = {
      canvas: false,
      localStorage: false,
      audioContext: false,
      webgl: false,
      es6: false,
      modules: false
    };
    
    this.checkCompatibility();
  }
  
  /**
   * 检查浏览器兼容性
   */
  checkCompatibility() {
    // 检查Canvas支持
    this.features.canvas = !!document.createElement('canvas').getContext;
    
    // 检查localStorage支持
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      this.features.localStorage = true;
    } catch (e) {
      this.features.localStorage = false;
    }
    
    // 检查AudioContext支持
    this.features.audioContext = !!(window.AudioContext || window.webkitAudioContext);
    
    // 检查WebGL支持
    try {
      const canvas = document.createElement('canvas');
      this.features.webgl = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      this.features.webgl = false;
    }
    
    // 检查ES6支持
    try {
      eval('class Test {}; const test = () => {}; const {a} = {}; ');
      this.features.es6 = true;
    } catch (e) {
      this.features.es6 = false;
    }
    
    // 检查ES6模块支持
    this.features.modules = 'noModule' in HTMLScriptElement.prototype;
  }
  
  /**
   * 获取不支持的功能列表
   * @returns {Array} 不支持的功能
   */
  getUnsupportedFeatures() {
    return Object.keys(this.features).filter(feature => !this.features[feature]);
  }
  
  /**
   * 检查是否支持游戏运行
   * @returns {boolean} 是否支持
   */
  isGameSupported() {
    return this.features.canvas && this.features.es6;
  }
  
  /**
   * 显示兼容性警告
   */
  showCompatibilityWarning() {
    const unsupported = this.getUnsupportedFeatures();
    
    if (unsupported.length > 0) {
      const warning = document.createElement('div');
      warning.className = 'compatibility-warning';
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
        color: white;
        padding: 15px;
        text-align: center;
        z-index: 10000;
        font-family: 'Rajdhani', sans-serif;
        font-size: 16px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      `;
      
      warning.innerHTML = `
        <div>
          <strong>⚠️ 浏览器兼容性提醒</strong><br>
          您的浏览器可能不完全支持游戏功能。建议使用最新版本的 Chrome、Firefox 或 Edge 浏览器。
          <button onclick="this.parentNode.parentNode.remove()" style="margin-left: 15px; padding: 5px 10px; border: none; background: rgba(255,255,255,0.2); color: white; border-radius: 4px; cursor: pointer;">知道了</button>
        </div>
      `;
      
      document.body.insertBefore(warning, document.body.firstChild);
    }
  }
}

// 创建全局实例
const errorHandler = new ErrorHandler();
const compatibilityChecker = new CompatibilityChecker();

/**
 * 安全执行函数 - 包装可能出错的代码
 * @param {Function} fn - 要执行的函数
 * @param {string} context - 执行上下文
 * @returns {*} 函数返回值或undefined
 */
export function safeExecute(fn, context = 'unknown') {
  try {
    return fn();
  } catch (error) {
    errorHandler.reportError('javascript', `Error in ${context}`, { error });
    return undefined;
  }
}

/**
 * 安全的DOM操作
 * @param {string} selector - CSS选择器
 * @param {Function} callback - 回调函数
 */
export function safeDOMOperation(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    safeExecute(() => callback(element), `DOM operation on ${selector}`);
  } else {
    errorHandler.reportError('javascript', `Element not found: ${selector}`);
  }
}

/**
 * 初始化错误处理和兼容性检查
 */
export function initErrorHandling() {
  // 检查兼容性
  if (!compatibilityChecker.isGameSupported()) {
    compatibilityChecker.showCompatibilityWarning();
  }
  
  // 设置内存存储降级方案
  if (!compatibilityChecker.features.localStorage) {
    errorHandler.setupMemoryStorage();
  }
}

// 暴露到全局
if (typeof window !== 'undefined') {
  window.errorHandler = errorHandler;
  window.compatibilityChecker = compatibilityChecker;
  window.errorUtils = {
    safeExecute,
    safeDOMOperation,
    initErrorHandling
  };
  
  // 开发模式下的错误管理工具
  if (window.location.hostname === 'localhost') {
    window.devError = {
      getStats: () => errorHandler.getErrorStats(),
      clearErrors: () => errorHandler.clearErrors(),
      testError: () => {
        throw new Error('Test error for development');
      },
      checkCompatibility: () => {
        console.log('Browser Features:', compatibilityChecker.features);
        console.log('Unsupported:', compatibilityChecker.getUnsupportedFeatures());
        return compatibilityChecker.features;
      }
    };
  }
} 