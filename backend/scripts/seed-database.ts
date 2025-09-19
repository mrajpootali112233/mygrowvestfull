import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { Plan } from '../src/entities/plan.entity';
import { Investment } from '../src/entities/investment.entity';
import { Deposit } from '../src/entities/deposit.entity';
import { Withdrawal } from '../src/entities/withdrawal.entity';
import { SupportTicket } from '../src/entities/support-ticket.entity';
import { ProfitLedger } from '../src/entities/profit-ledger.entity';
import * as bcrypt from 'bcrypt';

interface SeedOptions {
  environment: 'development' | 'staging' | 'production';
  includeTestData: boolean;
}

class DatabaseSeeder {
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async seedInvestmentPlans() {
    console.log('🌱 Seeding investment plans...');
    
    const planRepository = this.dataSource.getRepository(Plan);
    
    const plans = [
      {
        name: 'Basic Plan',
        type: 'basic',
        description: 'Perfect for beginners looking to start their investment journey',
        dailyRate: 0.007, // 0.7% daily
        minimumAmount: 100,
        maximumAmount: 1000,
        durationDays: 30,
        features: [
          'Daily profit distribution',
          'Basic customer support',
          'Secure wallet integration',
          '24/7 portfolio monitoring'
        ],
        isActive: true,
        displayOrder: 1
      },
      {
        name: 'Standard Plan',
        type: 'standard',
        description: 'Ideal for experienced investors seeking balanced returns',
        dailyRate: 0.010, // 1.0% daily
        minimumAmount: 500,
        maximumAmount: 5000,
        durationDays: 45,
        features: [
          'Enhanced daily returns',
          'Priority customer support',
          'Advanced analytics dashboard',
          'Risk management tools',
          'Weekly performance reports'
        ],
        isActive: true,
        displayOrder: 2
      },
      {
        name: 'Premium Plan',
        type: 'premium',
        description: 'Maximum returns for serious investors and institutions',
        dailyRate: 0.013, // 1.3% daily
        minimumAmount: 1000,
        maximumAmount: 10000,
        durationDays: 60,
        features: [
          'Highest daily profit rates',
          'Dedicated account manager',
          'Custom investment strategies',
          'Advanced portfolio tools',
          'Institutional-grade security',
          'Daily market insights'
        ],
        isActive: true,
        displayOrder: 3
      },
      {
        name: 'VIP Plan',
        type: 'vip',
        description: 'Exclusive plan for high-net-worth individuals',
        dailyRate: 0.015, // 1.5% daily
        minimumAmount: 10000,
        maximumAmount: 100000,
        durationDays: 90,
        features: [
          'Premium profit rates',
          'White-glove service',
          'Custom investment solutions',
          'Direct line to management',
          'Exclusive market opportunities',
          'Personalized risk assessment'
        ],
        isActive: false, // Initially disabled
        displayOrder: 4
      }
    ];

    for (const planData of plans) {
      const existingPlan = await planRepository.findOne({ 
        where: { type: planData.type } 
      });
      
      if (!existingPlan) {
        const plan = planRepository.create(planData);
        await planRepository.save(plan);
        console.log(`✅ Created plan: ${planData.name}`);
      } else {
        console.log(`⏭️  Plan already exists: ${planData.name}`);
      }
    }
  }

  async seedAdminUser() {
    console.log('🌱 Seeding admin user...');
    
    const userRepository = this.dataSource.getRepository(User);
    
    const adminEmail = 'admin@mygrowvest.com';
    const existingAdmin = await userRepository.findOne({ 
      where: { email: adminEmail } 
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!@#', 12);
      
      const adminUser = userRepository.create({
        firstName: 'System',
        lastName: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        isEmailVerified: true,
        referralCode: 'ADMIN001',
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      
      await userRepository.save(adminUser);
      console.log('✅ Created admin user: admin@mygrowvest.com');
      console.log('🔑 Default password: Admin123!@#');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('⏭️  Admin user already exists');
    }
  }

  async seedTestUsers(includeTestData: boolean) {
    if (!includeTestData) {
      console.log('⏭️  Skipping test users (production mode)');
      return;
    }

    console.log('🌱 Seeding test users...');
    
    const userRepository = this.dataSource.getRepository(User);
    
    const testUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Test123!@#',
        role: 'USER' as const,
        referralCode: 'JD001'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'Test123!@#',
        role: 'USER' as const,
        referralCode: 'JS002'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        password: 'Test123!@#',
        role: 'USER' as const,
        referralCode: 'BJ003'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await userRepository.findOne({ 
        where: { email: userData.email } 
      });
      
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const user = userRepository.create({
          ...userData,
          password: hashedPassword,
          isActive: true,
          isEmailVerified: true,
          createdAt: new Date()
        });
        
        await userRepository.save(user);
        console.log(`✅ Created test user: ${userData.email}`);
      } else {
        console.log(`⏭️  Test user already exists: ${userData.email}`);
      }
    }
  }

  async seedTestInvestments(includeTestData: boolean) {
    if (!includeTestData) {
      console.log('⏭️  Skipping test investments (production mode)');
      return;
    }

    console.log('🌱 Seeding test investments...');
    
    const userRepository = this.dataSource.getRepository(User);
    const planRepository = this.dataSource.getRepository(Plan);
    const depositRepository = this.dataSource.getRepository(Deposit);
    const investmentRepository = this.dataSource.getRepository(Investment);
    
    // Get test users and plans
    const testUser = await userRepository.findOne({ 
      where: { email: 'john.doe@example.com' } 
    });
    const basicPlan = await planRepository.findOne({ 
      where: { type: 'basic' } 
    });
    
    if (testUser && basicPlan) {
      // Create test deposit
      const existingDeposit = await depositRepository.findOne({
        where: { userId: testUser.id }
      });
      
      if (!existingDeposit) {
        const deposit = depositRepository.create({
          userId: testUser.id,
          amount: 500,
          planType: 'basic',
          receiptUrl: '/uploads/test-receipt.jpg',
          status: 'APPROVED',
          createdAt: new Date(),
          approvedAt: new Date()
        });
        
        await depositRepository.save(deposit);
        
        // Create test investment
        const investment = investmentRepository.create({
          userId: testUser.id,
          planId: basicPlan.id,
          amount: 500,
          dailyRate: basicPlan.dailyRate,
          startDate: new Date(),
          endDate: new Date(Date.now() + basicPlan.durationDays * 24 * 60 * 60 * 1000),
          status: 'ACTIVE',
          totalEarnings: 0,
          createdAt: new Date()
        });
        
        await investmentRepository.save(investment);
        console.log('✅ Created test investment for John Doe');
      } else {
        console.log('⏭️  Test investments already exist');
      }
    }
  }

  async seedSystemSettings() {
    console.log('🌱 Seeding system settings...');
    
    // System settings would be inserted via the migration
    // This is just a placeholder for any additional settings
    console.log('✅ System settings initialized via migrations');
  }

  async seedSampleData(includeTestData: boolean) {
    if (!includeTestData) {
      console.log('⏭️  Skipping sample data (production mode)');
      return;
    }

    console.log('🌱 Seeding sample support tickets...');
    
    const userRepository = this.dataSource.getRepository(User);
    const ticketRepository = this.dataSource.getRepository(SupportTicket);
    
    const testUser = await userRepository.findOne({ 
      where: { email: 'jane.smith@example.com' } 
    });
    
    if (testUser) {
      const existingTicket = await ticketRepository.findOne({
        where: { userId: testUser.id }
      });
      
      if (!existingTicket) {
        const sampleTickets = [
          {
            userId: testUser.id,
            subject: 'Question about withdrawal process',
            category: 'general',
            priority: 'medium',
            status: 'open',
            description: 'Hi, I would like to know more about the withdrawal process and timeframes. Thank you!'
          },
          {
            userId: testUser.id,
            subject: 'Account verification help needed',
            category: 'account',
            priority: 'high',
            status: 'in_progress',
            description: 'I am having trouble with my account verification. Can someone please assist me?'
          }
        ];
        
        for (const ticketData of sampleTickets) {
          const ticket = ticketRepository.create({
            ...ticketData,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          
          await ticketRepository.save(ticket);
        }
        
        console.log('✅ Created sample support tickets');
      } else {
        console.log('⏭️  Sample tickets already exist');
      }
    }
  }

  async run(options: SeedOptions) {
    console.log('🚀 Starting database seeding...');
    console.log(`📍 Environment: ${options.environment}`);
    console.log(`🧪 Include test data: ${options.includeTestData}`);
    console.log('================================');
    
    try {
      // Essential data (always seed)
      await this.seedInvestmentPlans();
      await this.seedAdminUser();
      await this.seedSystemSettings();
      
      // Test/development data (conditional)
      await this.seedTestUsers(options.includeTestData);
      await this.seedTestInvestments(options.includeTestData);
      await this.seedSampleData(options.includeTestData);
      
      console.log('================================');
      console.log('✅ Database seeding completed successfully!');
      
      if (options.includeTestData) {
        console.log('');
        console.log('🧪 Test Users Created:');
        console.log('   - admin@mygrowvest.com (Admin) - Password: Admin123!@#');
        console.log('   - john.doe@example.com (User) - Password: Test123!@#');
        console.log('   - jane.smith@example.com (User) - Password: Test123!@#');
        console.log('   - bob.johnson@example.com (User) - Password: Test123!@#');
        console.log('');
        console.log('⚠️  Remember to change admin password in production!');
      }
      
    } catch (error) {
      console.error('❌ Database seeding failed:', error);
      throw error;
    }
  }
}

async function main() {
  console.log('🌱 MyGrowVest Database Seeder');
  console.log('==============================');
  
  // Get environment from command line args or environment variable
  const environment = (process.argv[2] || process.env.NODE_ENV || 'development') as 'development' | 'staging' | 'production';
  const includeTestData = environment !== 'production';
  
  try {
    // Initialize NestJS application to get DataSource
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    
    // Run seeder
    const seeder = new DatabaseSeeder(dataSource);
    await seeder.run({ environment, includeTestData });
    
    // Close application
    await app.close();
    
    console.log('🎉 Seeding process completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Seeding process failed:', error);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  main();
}

export { DatabaseSeeder };"