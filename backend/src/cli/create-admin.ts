import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { UserRole } from '../common/enums';

// Load environment variables
require('dotenv').config();

async function createAdmin() {
  const dataSource = new DataSource({
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
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(User);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin user already exists with email:', adminEmail);
      if (existingAdmin.role === UserRole.ADMIN) {
        console.log('User already has admin role');
      } else {
        // Upgrade existing user to admin
        existingAdmin.role = UserRole.ADMIN;
        await userRepository.save(existingAdmin);
        console.log('Existing user upgraded to admin role');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      const referralCode = generateReferralCode();

      const admin = userRepository.create({
        email: adminEmail,
        passwordHash: hashedPassword,
        role: UserRole.ADMIN,
        referralCode,
        isSuspended: false,
      });

      await userRepository.save(admin);
      console.log('Admin user created successfully with email:', adminEmail);
      console.log('Admin referral code:', referralCode);
    }

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Database connection closed');
  }
}

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Run the script
createAdmin();