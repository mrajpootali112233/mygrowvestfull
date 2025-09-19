import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPlans1694000000001 implements MigrationInterface {
  name = 'SeedPlans1694000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Plan A and Plan B
    await queryRunner.query(`
      INSERT INTO "plans" ("name", "daily_percent", "lock_period_days", "refundable_principal") VALUES
      ('Plan A', 3.00, 30, true),
      ('Plan B', 7.00, 90, false)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "plans" WHERE "name" IN ('Plan A', 'Plan B')`);
  }
}