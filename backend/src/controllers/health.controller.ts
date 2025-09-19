import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from '../services/monitoring.service';
import { CustomLoggerService } from '../services/logger.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private monitoringService: MonitoringService,
    private logger: CustomLoggerService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed system health check' })
  @ApiResponse({ status: 200, description: 'Detailed health information' })
  async getDetailedHealth() {
    try {
      const healthData = await this.monitoringService.getSystemHealth();
      
      // Log health check
      this.logger.logSystemEvent('health_check_detailed', {
        status: healthData.status,
        requestedAt: new Date().toISOString()
      });
      
      return healthData;
    } catch (error) {
      this.logger.error('Detailed health check failed', error.stack, 'HealthController');
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        details: error.message
      };
    }
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get system alerts' })
  @ApiResponse({ status: 200, description: 'Current system alerts' })
  async getAlerts() {
    try {
      const alerts = await this.monitoringService.checkAlerts();
      
      this.logger.logSystemEvent('alerts_check', {
        alertCount: alerts.length,
        requestedAt: new Date().toISOString()
      });
      
      return {
        alerts,
        count: alerts.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Alerts check failed', error.stack, 'HealthController');
      return {
        alerts: [],
        count: 0,
        error: 'Failed to retrieve alerts',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get performance metrics' })
  @ApiResponse({ status: 200, description: 'System performance metrics' })
  async getMetrics() {
    try {
      const healthData = await this.monitoringService.getSystemHealth();
      
      const metrics = {
        application: healthData.application,
        api: healthData.api,
        system: healthData.system,
        memory: healthData.memory,
        database: {
          status: healthData.database.status,
          responseTime: healthData.database.responseTime
        },
        timestamp: new Date().toISOString()
      };
      
      this.logger.logSystemEvent('metrics_check', {
        requestedAt: new Date().toISOString()
      });
      
      return metrics;
    } catch (error) {
      this.logger.error('Metrics check failed', error.stack, 'HealthController');
      return {
        error: 'Failed to retrieve metrics',
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes/Docker' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async getReadiness() {
    try {
      const dbHealth = await this.monitoringService.checkDatabaseHealth();
      
      if (dbHealth.status === 'connected') {
        return {
          status: 'ready',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'ok'
          }
        };
      } else {
        return {
          status: 'not ready',
          timestamp: new Date().toISOString(),
          checks: {
            database: 'fail'
          }
        };
      }
    } catch (error) {
      this.logger.error('Readiness check failed', error.stack, 'HealthController');
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes/Docker' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async getLiveness() {
    // Simple liveness check - if we can respond, we're alive
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      pid: process.pid
    };
  }
}