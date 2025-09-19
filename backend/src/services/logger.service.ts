import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: WinstonLogger;

  constructor(private configService: ConfigService) {
    this.logger = createLogger({
      level: this.configService.get('LOG_LEVEL', 'info'),
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.json(),
        format.prettyPrint()
      ),
      defaultMeta: { service: 'mygrowvest-api' },
      transports: [
        // Console transport
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple()
          )
        }),
        
        // File transport for errors
        new transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          maxSize: '20m',
          maxFiles: '14d'
        }),
        
        // File transport for all logs
        new transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d'
        })
      ]
    });

    // Add file transport only in production
    if (this.configService.get('NODE_ENV') === 'production') {
      this.logger.add(new transports.File({
        filename: 'logs/error.log',
        level: 'error'
      }));
      this.logger.add(new transports.File({ 
        filename: 'logs/combined.log' 
      }));
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for specific logging needs
  logUserAction(userId: number, action: string, details: any, ip?: string) {
    this.logger.info('User Action', {
      userId,
      action,
      details,
      ip,
      timestamp: new Date().toISOString(),
      context: 'UserAction'
    });
  }

  logSecurityEvent(event: string, details: any, severity: 'low' | 'medium' | 'high' = 'medium') {
    this.logger.warn('Security Event', {
      event,
      details,
      severity,
      timestamp: new Date().toISOString(),
      context: 'Security'
    });
  }

  logTransaction(type: 'deposit' | 'withdrawal' | 'profit', amount: number, userId: number, details: any) {
    this.logger.info('Transaction', {
      type,
      amount,
      userId,
      details,
      timestamp: new Date().toISOString(),
      context: 'Transaction'
    });
  }

  logSystemEvent(event: string, details: any) {
    this.logger.info('System Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
      context: 'System'
    });
  }

  logApiRequest(method: string, url: string, userId?: number, responseTime?: number, statusCode?: number) {
    this.logger.info('API Request', {
      method,
      url,
      userId,
      responseTime,
      statusCode,
      timestamp: new Date().toISOString(),
      context: 'API'
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string, context?: string) {
    this.logger.info('Performance Metric', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
      context: context || 'Performance'
    });
  }
}