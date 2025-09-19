import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositsController } from './deposits.controller';
import { Deposit } from '../entities/deposit.entity';
import { multerConfig } from '../config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deposit]),
    multerConfig,
  ],
  controllers: [DepositsController],
  providers: [],
  exports: [],
})
export class DepositsModule {}