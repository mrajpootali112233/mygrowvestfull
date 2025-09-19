import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1694000000000 implements MigrationInterface {
  name = 'InitialMigration1694000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "email" varchar NOT NULL UNIQUE,
        "password_hash" varchar NOT NULL,
        "role" varchar NOT NULL DEFAULT 'user',
        "is_suspended" boolean NOT NULL DEFAULT false,
        "referral_code" varchar UNIQUE,
        "referred_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_users_referred_by" FOREIGN KEY ("referred_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create plans table
    await queryRunner.query(`
      CREATE TABLE "plans" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "daily_percent" decimal(5,2) NOT NULL,
        "lock_period_days" integer NOT NULL,
        "refundable_principal" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create investments table
    await queryRunner.query(`
      CREATE TABLE "investments" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "plan_id" integer NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "profit_accrued" decimal(15,2) NOT NULL DEFAULT 0,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "status" varchar NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_investments_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_investments_plan_id" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE
      )
    `);

    // Create deposits table
    await queryRunner.query(`
      CREATE TABLE "deposits" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "method" varchar NOT NULL,
        "tx_id" varchar,
        "proof_url" varchar,
        "status" varchar NOT NULL DEFAULT 'pending',
        "reviewed_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_deposits_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_deposits_reviewed_by" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create withdrawals table
    await queryRunner.query(`
      CREATE TABLE "withdrawals" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "amount" decimal(15,2) NOT NULL,
        "method_details" text NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "reviewed_by" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_withdrawals_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_withdrawals_reviewed_by" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);

    // Create profit_ledgers table
    await queryRunner.query(`
      CREATE TABLE "profit_ledgers" (
        "id" SERIAL PRIMARY KEY,
        "date" DATE NOT NULL,
        "total_distributed" decimal(15,2) NOT NULL,
        "created_by" integer NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_profit_ledgers_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create referrals table
    await queryRunner.query(`
      CREATE TABLE "referrals" (
        "id" SERIAL PRIMARY KEY,
        "referrer_id" integer NOT NULL,
        "referred_id" integer NOT NULL,
        "commission_amount" decimal(15,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_referrals_referrer_id" FOREIGN KEY ("referrer_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_referrals_referred_id" FOREIGN KEY ("referred_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create support_tickets table
    await queryRunner.query(`
      CREATE TABLE "support_tickets" (
        "id" SERIAL PRIMARY KEY,
        "user_id" integer NOT NULL,
        "subject" varchar NOT NULL,
        "message" text NOT NULL,
        "status" varchar NOT NULL DEFAULT 'open',
        "admin_replies" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_support_tickets_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create admin_logs table
    await queryRunner.query(`
      CREATE TABLE "admin_logs" (
        "id" SERIAL PRIMARY KEY,
        "admin_id" integer NOT NULL,
        "action" varchar NOT NULL,
        "meta" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_admin_logs_admin_id" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_logs"`);
    await queryRunner.query(`DROP TABLE "support_tickets"`);
    await queryRunner.query(`DROP TABLE "referrals"`);
    await queryRunner.query(`DROP TABLE "profit_ledgers"`);
    await queryRunner.query(`DROP TABLE "withdrawals"`);
    await queryRunner.query(`DROP TABLE "deposits"`);
    await queryRunner.query(`DROP TABLE "investments"`);
    await queryRunner.query(`DROP TABLE "plans"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}