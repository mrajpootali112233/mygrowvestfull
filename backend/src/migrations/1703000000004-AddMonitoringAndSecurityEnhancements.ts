import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class AddMonitoringAndSecurityEnhancements1703000000004 implements MigrationInterface {
  name = 'AddMonitoringAndSecurityEnhancements1703000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create system_logs table for monitoring
    await queryRunner.createTable(
      new Table({
        name: 'system_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'level',
            type: 'varchar',
            length: '10'
          },
          {
            name: 'message',
            type: 'text'
          },
          {
            name: 'context',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: true
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create rate_limit_tracking table
    await queryRunner.createTable(
      new Table({
        name: 'rate_limit_tracking',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'identifier',
            type: 'varchar',
            length: '255' // Can be IP, user ID, or combination
          },
          {
            name: 'endpoint',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'requestCount',
            type: 'int',
            default: 1
          },
          {
            name: 'windowStart',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'lastRequest',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create security_events table
    await queryRunner.createTable(
      new Table({
        name: 'security_events',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'eventType',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'severity',
            type: 'enum',
            enum: ['low', 'medium', 'high', 'critical']
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: true
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true
          },
          {
            name: 'userAgent',
            type: 'text',
            isNullable: true
          },
          {
            name: 'details',
            type: 'json',
            isNullable: true
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create file_uploads table for tracking uploads
    await queryRunner.createTable(
      new Table({
        name: 'file_uploads',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'userId',
            type: 'int'
          },
          {
            name: 'originalName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'fileName',
            type: 'varchar',
            length: '255'
          },
          {
            name: 'fileSize',
            type: 'int'
          },
          {
            name: 'mimeType',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'filePath',
            type: 'varchar',
            length: '500'
          },
          {
            name: 'uploadType',
            type: 'enum',
            enum: ['deposit_receipt', 'profile_image', 'kyc_document', 'other']
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['uploaded', 'processing', 'validated', 'rejected'],
            default: \"'uploaded'\"
          },
          {
            name: 'validationResults',
            type: 'json',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Create performance_metrics table
    await queryRunner.createTable(
      new Table({
        name: 'performance_metrics',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'metricName',
            type: 'varchar',
            length: '100'
          },
          {
            name: 'metricValue',
            type: 'decimal',
            precision: 10,
            scale: 4
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20'
          },
          {
            name: 'context',
            type: 'varchar',
            length: '100',
            isNullable: true
          },
          {
            name: 'metadata',
            type: 'json',
            isNullable: true
          },
          {
            name: 'timestamp',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    // Add indexes for performance
    await queryRunner.createIndex(
      'system_logs',
      new Index('IDX_system_logs_level_timestamp', ['level', 'timestamp'])
    );

    await queryRunner.createIndex(
      'system_logs',
      new Index('IDX_system_logs_context', ['context'])
    );

    await queryRunner.createIndex(
      'rate_limit_tracking',
      new Index('IDX_rate_limit_identifier_endpoint', ['identifier', 'endpoint'])
    );

    await queryRunner.createIndex(
      'rate_limit_tracking',
      new Index('IDX_rate_limit_window_start', ['windowStart'])
    );

    await queryRunner.createIndex(
      'security_events',
      new Index('IDX_security_events_type_severity', ['eventType', 'severity'])
    );

    await queryRunner.createIndex(
      'security_events',
      new Index('IDX_security_events_user_timestamp', ['userId', 'timestamp'])
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_user_type', ['userId', 'uploadType'])
    );

    await queryRunner.createIndex(
      'file_uploads',
      new Index('IDX_file_uploads_status', ['status'])
    );

    await queryRunner.createIndex(
      'performance_metrics',
      new Index('IDX_performance_metrics_name_timestamp', ['metricName', 'timestamp'])
    );

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE system_logs 
      ADD CONSTRAINT FK_system_logs_user 
      FOREIGN KEY (userId) REFERENCES users(id) 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE security_events 
      ADD CONSTRAINT FK_security_events_user 
      FOREIGN KEY (userId) REFERENCES users(id) 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE file_uploads 
      ADD CONSTRAINT FK_file_uploads_user 
      FOREIGN KEY (userId) REFERENCES users(id) 
      ON DELETE CASCADE
    `);

    // Add new columns to existing tables for enhanced functionality
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN lastLoginAt TIMESTAMP NULL,
      ADD COLUMN lastLoginIp VARCHAR(45) NULL,
      ADD COLUMN loginAttempts INT DEFAULT 0,
      ADD COLUMN lockedUntil TIMESTAMP NULL,
      ADD COLUMN twoFactorEnabled BOOLEAN DEFAULT FALSE,
      ADD COLUMN twoFactorSecret VARCHAR(255) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE deposits 
      ADD COLUMN ipAddress VARCHAR(45) NULL,
      ADD COLUMN userAgent TEXT NULL,
      ADD COLUMN processingNotes TEXT NULL,
      ADD COLUMN approvedBy INT NULL,
      ADD COLUMN approvedAt TIMESTAMP NULL
    `);

    await queryRunner.query(`
      ALTER TABLE withdrawals 
      ADD COLUMN ipAddress VARCHAR(45) NULL,
      ADD COLUMN userAgent TEXT NULL,
      ADD COLUMN processingNotes TEXT NULL,
      ADD COLUMN transactionHash VARCHAR(255) NULL,
      ADD COLUMN approvedBy INT NULL,
      ADD COLUMN approvedAt TIMESTAMP NULL
    `);

    // Add foreign keys for approval tracking
    await queryRunner.query(`
      ALTER TABLE deposits 
      ADD CONSTRAINT FK_deposits_approved_by 
      FOREIGN KEY (approvedBy) REFERENCES users(id) 
      ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE withdrawals 
      ADD CONSTRAINT FK_withdrawals_approved_by 
      FOREIGN KEY (approvedBy) REFERENCES users(id) 
      ON DELETE SET NULL
    `);

    // Create system_settings table for configurable parameters
    await queryRunner.createTable(
      new Table({
        name: 'system_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment'
          },
          {
            name: 'settingKey',
            type: 'varchar',
            length: '100',
            isUnique: true
          },
          {
            name: 'settingValue',
            type: 'text'
          },
          {
            name: 'dataType',
            type: 'enum',
            enum: ['string', 'number', 'boolean', 'json']
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'isPublic',
            type: 'boolean',
            default: false
          },
          {
            name: 'updatedBy',
            type: 'int',
            isNullable: true
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP'
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP'
          }
        ]
      }),
      true
    );

    await queryRunner.query(`
      ALTER TABLE system_settings 
      ADD CONSTRAINT FK_system_settings_updated_by 
      FOREIGN KEY (updatedBy) REFERENCES users(id) 
      ON DELETE SET NULL
    `);

    // Insert default system settings
    await queryRunner.query(`
      INSERT INTO system_settings (settingKey, settingValue, dataType, description, isPublic) VALUES
      ('minimum_deposit_amount', '100', 'number', 'Minimum deposit amount in USD', true),
      ('minimum_withdrawal_amount', '20', 'number', 'Minimum withdrawal amount in USD', true),
      ('platform_fee_percentage', '0', 'number', 'Platform fee percentage for withdrawals', false),
      ('max_file_upload_size', '5242880', 'number', 'Maximum file upload size in bytes (5MB)', false),
      ('allowed_file_types', '[\"image/jpeg\", \"image/png\", \"image/gif\", \"application/pdf\"]', 'json', 'Allowed file upload types', false),
      ('rate_limit_auth_attempts', '5', 'number', 'Max authentication attempts per window', false),
      ('rate_limit_auth_window', '900', 'number', 'Authentication rate limit window in seconds (15 minutes)', false),
      ('rate_limit_deposit_attempts', '3', 'number', 'Max deposit submissions per window', false),
      ('rate_limit_deposit_window', '3600', 'number', 'Deposit rate limit window in seconds (1 hour)', false),
      ('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', true),
      ('profit_calculation_enabled', 'true', 'boolean', 'Enable automatic profit calculations', false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints first
    await queryRunner.query('ALTER TABLE system_settings DROP FOREIGN KEY FK_system_settings_updated_by');
    await queryRunner.query('ALTER TABLE withdrawals DROP FOREIGN KEY FK_withdrawals_approved_by');
    await queryRunner.query('ALTER TABLE deposits DROP FOREIGN KEY FK_deposits_approved_by');
    await queryRunner.query('ALTER TABLE file_uploads DROP FOREIGN KEY FK_file_uploads_user');
    await queryRunner.query('ALTER TABLE security_events DROP FOREIGN KEY FK_security_events_user');
    await queryRunner.query('ALTER TABLE system_logs DROP FOREIGN KEY FK_system_logs_user');

    // Drop new columns from existing tables
    await queryRunner.query(`
      ALTER TABLE withdrawals 
      DROP COLUMN ipAddress,
      DROP COLUMN userAgent,
      DROP COLUMN processingNotes,
      DROP COLUMN transactionHash,
      DROP COLUMN approvedBy,
      DROP COLUMN approvedAt
    `);

    await queryRunner.query(`
      ALTER TABLE deposits 
      DROP COLUMN ipAddress,
      DROP COLUMN userAgent,
      DROP COLUMN processingNotes,
      DROP COLUMN approvedBy,
      DROP COLUMN approvedAt
    `);

    await queryRunner.query(`
      ALTER TABLE users 
      DROP COLUMN lastLoginAt,
      DROP COLUMN lastLoginIp,
      DROP COLUMN loginAttempts,
      DROP COLUMN lockedUntil,
      DROP COLUMN twoFactorEnabled,
      DROP COLUMN twoFactorSecret
    `);

    // Drop new tables
    await queryRunner.dropTable('system_settings');
    await queryRunner.dropTable('performance_metrics');
    await queryRunner.dropTable('file_uploads');
    await queryRunner.dropTable('security_events');
    await queryRunner.dropTable('rate_limit_tracking');
    await queryRunner.dropTable('system_logs');
  }
}"