/**
 * 性能监控工具类
 * 用于监控渲染时间、CPU使用率、内存占用率、FPS等指标
 */

export interface PerformanceMetrics {
  renderTime: number; // 渲染时间 (ms)
  cpuUsage: number; // CPU使用率 (%)
  memoryUsage: number; // 内存占用 (MB)
  fps: number; // 帧率
  nodeCount: number; // 节点数量
  linkCount: number; // 连接数量
  timestamp: number; // 时间戳
}

export interface PerformanceStats {
  avgRenderTime: number;
  maxRenderTime: number;
  minRenderTime: number;
  avgFPS: number;
  minFPS: number;
  avgMemoryUsage: number;
  maxMemoryUsage: number;
  avgCPUUsage: number;
  maxCPUUsage: number;
  crashCount: number;
  totalSamples: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private frameCount: number = 0;
  private lastFrameTime: number = 0;
  private fps: number = 0;
  private rafId: number | null = null;
  private isMonitoring: boolean = false;
  private crashCount: number = 0;
  private renderTimeHistory: number[] = [];
  private memoryHistory: number[] = [];
  private cpuHistory: number[] = [];
  private fpsHistory: number[] = [];
  
  // 用于计算CPU使用率
  private lastCpuTime: number = 0;
  private lastIdleTime: number = 0;
  
  // 回调函数
  private onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  private onCrash?: (error: Error) => void;

  constructor() {
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
  }

  /**
   * 开始监控
   */
  start(onMetricsUpdate?: (metrics: PerformanceMetrics) => void, onCrash?: (error: Error) => void) {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.onMetricsUpdate = onMetricsUpdate;
    this.onCrash = onCrash;
    this.metrics = [];
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
    
    // 监听错误
    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    // 开始FPS监控
    this.monitorFPS();
    
    // 开始性能监控循环
    this.monitorLoop();
  }

  /**
   * 停止监控
   */
  stop() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  /**
   * 记录一次渲染
   */
  recordRender(nodeCount: number, linkCount: number) {
    if (!this.isMonitoring) {
      return;
    }

    const renderStart = performance.now();
    
    // 使用 requestAnimationFrame 来测量实际渲染时间
    requestAnimationFrame(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      
      const metrics: PerformanceMetrics = {
        renderTime,
        cpuUsage: this.getCPUUsage(),
        memoryUsage: this.getMemoryUsage(),
        fps: this.fps,
        nodeCount,
        linkCount,
        timestamp: Date.now()
      };

      this.metrics.push(metrics);
      this.renderTimeHistory.push(renderTime);
      this.memoryHistory.push(metrics.memoryUsage);
      this.cpuHistory.push(metrics.cpuUsage);
      this.fpsHistory.push(metrics.fps);

      // 限制历史记录长度
      const maxHistory = 1000;
      if (this.renderTimeHistory.length > maxHistory) {
        this.renderTimeHistory.shift();
        this.memoryHistory.shift();
        this.cpuHistory.shift();
        this.fpsHistory.shift();
      }

      if (this.onMetricsUpdate) {
        this.onMetricsUpdate(metrics);
      }
    });
  }

  /**
   * 获取统计信息
   */
  getStats(): PerformanceStats {
    if (this.renderTimeHistory.length === 0) {
      return {
        avgRenderTime: 0,
        maxRenderTime: 0,
        minRenderTime: 0,
        avgFPS: 0,
        minFPS: 0,
        avgMemoryUsage: 0,
        maxMemoryUsage: 0,
        avgCPUUsage: 0,
        maxCPUUsage: 0,
        crashCount: this.crashCount,
        totalSamples: 0
      };
    }

    const renderTimes = this.renderTimeHistory;
    const fpsValues = this.fpsHistory;
    const memoryValues = this.memoryHistory;
    const cpuValues = this.cpuHistory;

    return {
      avgRenderTime: renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length,
      maxRenderTime: Math.max(...renderTimes),
      minRenderTime: Math.min(...renderTimes),
      avgFPS: fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length,
      minFPS: Math.min(...fpsValues),
      avgMemoryUsage: memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length,
      maxMemoryUsage: Math.max(...memoryValues),
      avgCPUUsage: cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length,
      maxCPUUsage: Math.max(...cpuValues),
      crashCount: this.crashCount,
      totalSamples: this.metrics.length
    };
  }

  /**
   * 获取所有指标
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * 清空指标
   */
  clear() {
    this.metrics = [];
    this.renderTimeHistory = [];
    this.memoryHistory = [];
    this.cpuHistory = [];
    this.fpsHistory = [];
    this.crashCount = 0;
  }

  /**
   * 监控FPS
   */
  private monitorFPS() {
    const measureFPS = () => {
      if (!this.isMonitoring) {
        return;
      }

      const now = performance.now();
      const delta = now - this.lastFrameTime;
      
      this.frameCount++;
      
      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }

      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);
  }

  /**
   * 性能监控循环
   */
  private monitorLoop() {
    // 定期记录性能指标
    setInterval(() => {
      if (!this.isMonitoring) {
        return;
      }

      // 这里可以定期记录一些指标
      // 主要指标通过 recordRender 方法记录
    }, 1000);
  }

  /**
   * 获取内存使用情况 (MB)
   */
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round((memory.usedJSHeapSize / 1048576) * 100) / 100;
    }
    return 0;
  }

  /**
   * 获取CPU使用率 (%)
   * 注意：浏览器环境无法直接获取真实CPU使用率，这里使用近似方法
   */
  private getCPUUsage(): number {
    // 使用 performance.now() 来估算CPU使用率
    // 这是一个简化的方法，实际CPU使用率需要通过其他方式获取
    const now = performance.now();
    const timeDelta = now - (this.lastCpuTime || now);
    
    // 基于帧率和渲染时间来估算CPU使用率
    if (this.fps > 0 && timeDelta > 0) {
      // 假设60fps为100%使用率，当前fps越低，CPU使用率越高
      const estimatedUsage = Math.max(0, Math.min(100, (60 - this.fps) / 60 * 100));
      this.lastCpuTime = now;
      return Math.round(estimatedUsage * 100) / 100;
    }
    
    return 0;
  }

  /**
   * 错误处理
   */
  private handleError = (event: ErrorEvent) => {
    this.crashCount++;
    if (this.onCrash) {
      this.onCrash(new Error(event.message));
    }
  };

  /**
   * 未处理的Promise拒绝
   */
  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.crashCount++;
    if (this.onCrash) {
      this.onCrash(new Error(event.reason?.toString() || 'Unhandled promise rejection'));
    }
  };

  /**
   * 测试大于1MB数据的加载成功率
   */
  async testLargeDataLoad(dataSizeMB: number = 1): Promise<{ success: boolean; loadTime: number; error?: string }> {
    const startTime = performance.now();
    
    try {
      // 生成测试数据
      const testData = this.generateTestData(dataSizeMB);
      
      // 尝试序列化和反序列化
      const serialized = JSON.stringify(testData);
      const parsed = JSON.parse(serialized);
      
      const loadTime = performance.now() - startTime;
      
      return {
        success: true,
        loadTime: Math.round(loadTime * 100) / 100
      };
    } catch (error) {
      const loadTime = performance.now() - startTime;
      return {
        success: false,
        loadTime: Math.round(loadTime * 100) / 100,
        error: (error as Error).message
      };
    }
  }

  /**
   * 生成测试数据
   */
  private generateTestData(sizeMB: number): any {
    const bytesPerMB = 1024 * 1024;
    const targetSize = sizeMB * bytesPerMB;
    const data: any = {
      nodes: [],
      links: [],
      metadata: {}
    };

    // 生成足够大的数据
    let currentSize = 0;
    let nodeId = 0;
    
    while (currentSize < targetSize) {
      const node = {
        id: nodeId++,
        type: 'test',
        title: `Test Node ${nodeId}`,
        pos: [Math.random() * 1000, Math.random() * 1000],
        properties: {
          value: Math.random(),
          data: 'x'.repeat(1000) // 每个节点1KB数据
        }
      };
      
      data.nodes.push(node);
      currentSize += JSON.stringify(node).length;
    }

    return data;
  }
}

