// 粒子对象池 - 优化内存管理和垃圾回收

/**
 * 对象池类
 */
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 50) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.activeObjects = [];
    
    // 预分配对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }
  
  acquire(...args) {
    let obj;
    if (this.pool.length > 0) {
      obj = this.pool.pop();
      this.resetFn(obj, ...args);
    } else {
      obj = this.createFn(...args);
    }
    this.activeObjects.push(obj);
    return obj;
  }
  
  release(obj) {
    const index = this.activeObjects.indexOf(obj);
    if (index > -1) {
      this.activeObjects.splice(index, 1);
      this.pool.push(obj);
    }
  }
  
  update() {
    for (let i = this.activeObjects.length - 1; i >= 0; i--) {
      const obj = this.activeObjects[i];
      obj.update();
      
      // 检查对象是否应该被回收
      if (obj.shouldRecycle && obj.shouldRecycle()) {
        this.release(obj);
      }
    }
  }
  
  draw(context) {
    this.activeObjects.forEach(obj => {
      if (obj.draw) obj.draw(context);
    });
  }
  
  clear() {
    this.pool.push(...this.activeObjects);
    this.activeObjects.length = 0;
  }
  
  getActiveCount() {
    return this.activeObjects.length;
  }
  
  getPoolSize() {
    return this.pool.length;
  }
}

/**
 * 优化的粒子类
 */
class PooledParticle {
  constructor() {
    this.reset(0, 0, '#ffffff', 2);
  }
  
  reset(x, y, color, size = 2, velocity = null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity || { 
      x: (Math.random() - 0.5) * 4, 
      y: (Math.random() - 0.5) * 4 
    };
    this.life = 1;
    this.decay = 0.02;
    this.maxLife = 1;
  }
  
  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= this.decay;
    this.velocity.x *= 0.99;
    this.velocity.y *= 0.99;
  }
  
  draw(context) {
    if (this.life <= 0) return;
    
    context.save();
    context.globalAlpha = this.life;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
  
  shouldRecycle() {
    return this.life <= 0;
  }
}

/**
 * 优化的背景粒子类
 */
class PooledBackgroundParticle {
  constructor() {
    this.reset();
  }
  
  reset() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: Math.random() * 0.5 + 0.1,
    };
    this.opacity = Math.random() * 0.5 + 0.1;
    this.recycleTimer = 0;
    this.maxLifetime = 30000; // 30秒后回收
  }
  
  update() {
    const canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.recycleTimer += 16; // 假设60fps，每帧16ms
    
    // 边界检查和重置
    if (this.y > canvas.height) {
      this.y = -10;
      this.x = Math.random() * canvas.width;
    }
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
  }
  
  draw() {
    const particlesCanvas = document.getElementById('particles-canvas');
    if (!particlesCanvas) return;
    
    const particlesCtx = particlesCanvas.getContext('2d');
    particlesCtx.save();
    particlesCtx.globalAlpha = this.opacity;
    particlesCtx.fillStyle = '#00f5ff';
    particlesCtx.beginPath();
    particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particlesCtx.fill();
    particlesCtx.restore();
  }
  
  shouldRecycle() {
    return this.recycleTimer > this.maxLifetime;
  }
}

// 创建全局粒子池
const particlePool = new ObjectPool(
  () => new PooledParticle(),
  (particle, x, y, color, size, velocity) => particle.reset(x, y, color, size, velocity),
  100
);

const backgroundParticlePool = new ObjectPool(
  () => new PooledBackgroundParticle(),
  (particle) => particle.reset(),
  50
);

/**
 * 创建爆炸效果（优化版）
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} color - 颜色
 * @param {number} count - 粒子数量
 */
export function createOptimizedExplosion(x, y, color, count = 15) {
  for (let i = 0; i < count; i++) {
    const velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    };
    const size = Math.random() * 3 + 1;
    particlePool.acquire(x, y, color, size, velocity);
  }
}

/**
 * 初始化优化的背景粒子
 * @param {number} count - 粒子数量
 */
export function initOptimizedBackgroundParticles(count = 50) {
  // 清空现有粒子
  backgroundParticlePool.clear();
  
  // 创建新粒子
  for (let i = 0; i < count; i++) {
    backgroundParticlePool.acquire();
  }
}

/**
 * 更新和绘制粒子系统
 * @param {CanvasRenderingContext2D} gameCtx - 游戏画布上下文
 * @param {CanvasRenderingContext2D} particlesCtx - 粒子画布上下文
 */
export function updateAndDrawParticles(gameCtx, particlesCtx) {
  // 更新前景粒子
  particlePool.update();
  if (gameCtx) {
    particlePool.draw(gameCtx);
  }
  
  // 更新背景粒子
  backgroundParticlePool.update();
  if (particlesCtx) {
    backgroundParticlePool.draw(particlesCtx);
  }
}

/**
 * 获取性能统计
 * @returns {Object} 性能统计对象
 */
export function getParticleStats() {
  return {
    foregroundParticles: {
      active: particlePool.getActiveCount(),
      pooled: particlePool.getPoolSize(),
      total: particlePool.getActiveCount() + particlePool.getPoolSize()
    },
    backgroundParticles: {
      active: backgroundParticlePool.getActiveCount(),
      pooled: backgroundParticlePool.getPoolSize(),
      total: backgroundParticlePool.getActiveCount() + backgroundParticlePool.getPoolSize()
    }
  };
}

/**
 * 清理所有粒子
 */
export function clearAllParticles() {
  particlePool.clear();
  backgroundParticlePool.clear();
}

// 暴露到全局以兼容旧代码
if (typeof window !== 'undefined') {
  window.optimizedParticles = {
    createExplosion: createOptimizedExplosion,
    initBackgroundParticles: initOptimizedBackgroundParticles,
    updateAndDraw: updateAndDrawParticles,
    getStats: getParticleStats,
    clearAll: clearAllParticles
  };
  
  // 性能监控（开发模式）
  if (window.location.hostname === 'localhost') {
    window.particlePerf = {
      logStats: () => {
        const stats = getParticleStats();
        console.log('Particle Pool Stats:', stats);
        return stats;
      },
      enableMonitoring: () => {
        setInterval(() => {
          const stats = getParticleStats();
          if (stats.foregroundParticles.active > 100) {
            console.warn('High foreground particle count:', stats.foregroundParticles.active);
          }
        }, 5000);
      }
    };
  }
} 