import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit } from '../entities/deposit.entity';
import { User } from '../entities/user.entity';
import { DepositStatus, UserRole } from '../common/enums';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, GetUser } from '../common/decorators/auth.decorators';
import { CreateDepositDto, DepositResponseDto } from './dto/deposit.dto';

@Controller('deposits')
@UseGuards(AuthGuard('jwt'))
export class DepositsController {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('proof'))
  async createDeposit(
    @Body() createDepositDto: CreateDepositDto,
    @GetUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<DepositResponseDto> {
    const deposit = this.depositRepository.create({
      ...createDepositDto,
      userId: user.id,
      proofUrl: file?.filename || null,
      status: DepositStatus.PENDING,
    });

    await this.depositRepository.save(deposit);

    return {
      id: deposit.id,
      userId: deposit.userId,
      amount: deposit.amount,
      method: deposit.method,
      txId: deposit.txId,
      proofUrl: deposit.proofUrl,
      status: deposit.status,
      createdAt: deposit.createdAt,
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDeposits(
    @Query('status') status?: DepositStatus,
    @Query('userId') userId?: number,
  ): Promise<DepositResponseDto[]> {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const deposits = await this.depositRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    return deposits.map(deposit => ({
      id: deposit.id,
      userId: deposit.userId,
      amount: deposit.amount,
      method: deposit.method,
      txId: deposit.txId,
      proofUrl: deposit.proofUrl,
      status: deposit.status,
      createdAt: deposit.createdAt,
    }));
  }
}