import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Plan } from '../entities/plan.entity';
import { Investment } from '../entities/investment.entity';
import { Deposit } from '../entities/deposit.entity';
import { Withdrawal } from '../entities/withdrawal.entity';
import { ProfitLedger } from '../entities/profit-ledger.entity';
import { Referral } from '../entities/referral.entity';
import { SupportTicket } from '../entities/support-ticket.entity';
import { AdminLog } from '../entities/admin-log.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<DataSourceOptions> => {
    const isProduction = configService.get('NODE_ENV') === 'production';
    const databaseType = configService.get('DATABASE_TYPE') || 'sqlite';
    
    const entities = [
      User,
      Plan,
      Investment,
      Deposit,
      Withdrawal,
      ProfitLedger,
      Referral,
      SupportTicket,
      AdminLog,
    ];

    if (databaseType === 'postgres') {
      return {
        type: 'postgres',
        host: configService.get('DATABASE_HOST') || 'localhost',
        port: parseInt(configService.get('DATABASE_PORT')) || 5432,
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities,
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: !isProduction,
        logging: !isProduction,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
      };
    } else {
      // SQLite fallback for development
      return {
        type: 'sqlite',
        database: configService.get('DATABASE_NAME') || './mygrowvest.db',
        entities,
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: !isProduction,
        logging: !isProduction,
      };
    }
  },
};

// DataSource for migrations
export default new DataSource({
  type: process.env.DATABASE_TYPE === 'postgres' ? 'postgres' : 'sqlite',
  ...(process.env.DATABASE_TYPE === 'postgres' ? {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  } : {
    database: process.env.DATABASE_NAME || './mygrowvest.db',
  }),
  entities: ['src/entities/*{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  logging: process.env.NODE_ENV !== 'production',
  synchronize: false,
} as DataSourceOptions);