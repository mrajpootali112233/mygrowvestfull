import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { typeOrmAsyncConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepositsModule } from './deposits/deposits.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { InvestmentsModule } from './investments/investments.module';
import { AdminModule } from './admin/admin.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    DepositsModule,
    WithdrawalsModule,
    InvestmentsModule,
    AdminModule,
    TicketsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}