import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from './logger.service';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MonitoringService {
  private readonly startTime: Date;
  private requestCount = 0;
  private errorCount = 0;
  private performanceMetrics: { [key: string]: number[] } = {};

  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private configService: ConfigService,
    private logger: CustomLoggerService
  ) {
    this.startTime = new Date();
    
    // Start periodic health checks
    this.startPeriodicHealthChecks();
  }

  async getSystemHealth(): Promise<any> {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: this.getUptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: this.configService.get('NODE_ENV', 'development'),
      
      // Database health
      database: await this.checkDatabaseHealth(),
      
      // System resources
      system: this.getSystemMetrics(),
      
      // Application metrics
      application: this.getApplicationMetrics(),
      
      // API metrics
      api: this.getApiMetrics(),
      
      // Disk space
      disk: await this.getDiskUsage(),
      
      // Memory usage
      memory: this.getMemoryUsage()
    };

    // Determine overall health status
    healthData.status = this.determineOverallHealth(healthData);
    
    return healthData;
  }

  async checkDatabaseHealth(): Promise<any> {
    try {
      const startTime = Date.now();
      await this.dataSource.query('SELECT 1');
      const responseTime = Date.now() - startTime;
      
      const connectionStatus = this.dataSource.isInitialized;
      
      return {
        status: connectionStatus ? 'connected' : 'disconnected',
        responseTime: `${responseTime}ms`,
        connections: {
          active: this.dataSource.driver.master ? 1 : 0,
          idle: 0
        },
        type: this.dataSource.options.type,
        database: this.dataSource.options.database
      };
    } catch (error) {
      this.logger.error('Database health check failed', error.stack, 'MonitoringService');
      return {
        status: 'error',
        error: error.message,
        responseTime: null
      };
    }
  }

  getSystemMetrics(): any {
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    
    return {
      platform: os.platform(),
      architecture: os.arch(),
      nodeVersion: process.version,
      cpu: {
        model: cpus[0]?.model,
        cores: cpus.length,
        loadAverage: {
          '1m': loadAvg[0],
          '5m': loadAvg[1],
          '15m': loadAvg[2]
        }
      },
      hostname: os.hostname()
    };
  }

  getApplicationMetrics(): any {
    const memUsage = process.memoryUsage();
    
    return {
      uptime: this.getUptime(),
      processId: process.pid,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
      memory: {
        rss: this.formatBytes(memUsage.rss),
        heapTotal: this.formatBytes(memUsage.heapTotal),
        heapUsed: this.formatBytes(memUsage.heapUsed),
        external: this.formatBytes(memUsage.external)
      }
    };
  }

  getApiMetrics(): any {
    return {
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      averageResponseTime: this.getAverageResponseTime(),
      endpointMetrics: this.getEndpointMetrics()
    };
  }

  getMemoryUsage(): any {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
      total: this.formatBytes(totalMem),
      free: this.formatBytes(freeMem),
      used: this.formatBytes(usedMem),
      percentage: ((usedMem / totalMem) * 100).toFixed(2) + '%'
    };
  }

  async getDiskUsage(): Promise<any> {
    try {
      const stats = await fs.promises.statSync('.');
      return {
        available: 'N/A', // Would need additional library for cross-platform disk usage
        used: 'N/A',
        total: 'N/A'
      };
    } catch (error) {
      return {
        error: 'Unable to retrieve disk usage',
        available: 'N/A',
        used: 'N/A',
        total: 'N/A'
      };
    }
  }

  // Request tracking methods
  incrementRequestCount(): void {
    this.requestCount++;
  }

  incrementErrorCount(): void {
    this.errorCount++;
  }

  recordResponseTime(endpoint: string, responseTime: number): void {
    if (!this.performanceMetrics[endpoint]) {
      this.performanceMetrics[endpoint] = [];
    }
    
    this.performanceMetrics[endpoint].push(responseTime);
    
    // Keep only last 100 measurements per endpoint
    if (this.performanceMetrics[endpoint].length > 100) {
      this.performanceMetrics[endpoint].shift();
    }
  }

  // Alert methods
  async checkAlerts(): Promise<any[]> {
    const alerts = [];
    const health = await this.getSystemHealth();
    
    // High error rate alert
    if (health.application.errorRate > 5) {
      alerts.push({
        type: 'HIGH_ERROR_RATE',
        severity: 'warning',
        message: `Error rate is ${health.application.errorRate.toFixed(2)}%`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Database connection alert
    if (health.database.status !== 'connected') {
      alerts.push({
        type: 'DATABASE_DISCONNECTED',
        severity: 'critical',
        message: 'Database connection lost',
        timestamp: new Date().toISOString()
      });
    }
    
    // High memory usage alert
    const memUsage = parseFloat(health.memory.percentage);
    if (memUsage > 85) {
      alerts.push({
        type: 'HIGH_MEMORY_USAGE',
        severity: 'warning',
        message: `Memory usage is ${memUsage}%`,
        timestamp: new Date().toISOString()
      });
    }
    
    return alerts;
  }

  // Utility methods
  private getUptime(): string {
    const uptimeMs = Date.now() - this.startTime.getTime();
    const seconds = Math.floor(uptimeMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getAverageResponseTime(): number {
    const allTimes = Object.values(this.performanceMetrics).flat();
    if (allTimes.length === 0) return 0;
    return allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length;
  }

  private getEndpointMetrics(): any {
    const metrics = {};
    Object.keys(this.performanceMetrics).forEach(endpoint => {
      const times = this.performanceMetrics[endpoint];
      if (times.length > 0) {
        metrics[endpoint] = {
          calls: times.length,
          averageResponseTime: times.reduce((sum, time) => sum + time, 0) / times.length,
          minResponseTime: Math.min(...times),
          maxResponseTime: Math.max(...times)
        };
      }
    });
    return metrics;
  }

  private determineOverallHealth(healthData: any): string {
    if (healthData.database.status !== 'connected') {
      return 'unhealthy';
    }
    
    if (healthData.application.errorRate > 10) {
      return 'degraded';
    }
    
    const memUsage = parseFloat(healthData.memory.percentage);
    if (memUsage > 90) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  private startPeriodicHealthChecks(): void {
    // Log system metrics every 5 minutes
    setInterval(async () => {
      try {
        const health = await this.getSystemHealth();
        this.logger.logPerformanceMetric('system_health_check', 1, 'count', 'Monitoring');
        
        // Log alerts if any
        const alerts = await this.checkAlerts();
        if (alerts.length > 0) {
          alerts.forEach(alert => {
            this.logger.logSecurityEvent(alert.type, alert, alert.severity as any);
          });
        }
      } catch (error) {
        this.logger.error('Periodic health check failed', error.stack, 'MonitoringService');
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}"