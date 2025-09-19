import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Investment } from '../entities/investment.entity';
import { Plan } from '../entities/plan.entity';
import { User } from '../entities/user.entity';
import { InvestmentStatus } from '../common/enums';
import { GetUser } from '../common/decorators/auth.decorators';
import { CreateInvestmentDto, InvestmentResponseDto } from './dto/investment.dto';

@Controller('investments')
@UseGuards(AuthGuard('jwt'))
export class InvestmentsController {
  constructor(
    @InjectRepository(Investment)
    private readonly investmentRepository: Repository<Investment>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  @Post('activate')
  async activateInvestment(
    @Body() createInvestmentDto: CreateInvestmentDto,
    @GetUser() user: User,
  ): Promise<InvestmentResponseDto> {
    const { planId, amount } = createInvestmentDto;

    // Validate plan exists
    const plan = await this.planRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new BadRequestException('Investment plan not found');
    }

    // TODO: Check if user has approved deposit with sufficient balance
    // For now, we'll create the investment directly

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.lockPeriodDays);

    const investment = this.investmentRepository.create({
      userId: user.id,
      planId,
      amount,
      profitAccrued: 0,
      startDate,
      endDate,
      status: InvestmentStatus.ACTIVE,
    });

    await this.investmentRepository.save(investment);

    return {
      id: investment.id,
      userId: investment.userId,
      planId: investment.planId,
      amount: investment.amount,
      profitAccrued: investment.profitAccrued,
      startDate: investment.startDate,
      endDate: investment.endDate,
      status: investment.status,
      createdAt: investment.createdAt,
    };
  }
}