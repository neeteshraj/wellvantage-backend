import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWorkoutTables1767165303631 implements MigrationInterface {
  name = 'CreateWorkoutTables1767165303631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exercises" ("id" character varying(50) NOT NULL, "workout_day_id" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "sets" character varying(50) NOT NULL, "reps" character varying(50) NOT NULL, CONSTRAINT "PK_c4c46f5fa89a58ba7c2d894e3c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_af446695a3f98b2cc3bc3fe5ba" ON "exercises" ("workout_day_id") `);
    await queryRunner.query(
      `CREATE TABLE "workout_days" ("id" character varying(50) NOT NULL, "workout_plan_id" character varying(50) NOT NULL, "day_number" integer NOT NULL, "body_part" character varying(100) NOT NULL, CONSTRAINT "PK_bc5724d5cb04625732f1bab0965" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_0bf9441a5f06c3965b19b1d8e0" ON "workout_days" ("workout_plan_id") `);
    await queryRunner.query(
      `CREATE TABLE "workout_plans" ("id" character varying(50) NOT NULL, "trainer_id" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9ae1bdd02db446a7541e2e5b161" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_1ec73ce1e3da6c59fa40f23c6e" ON "workout_plans" ("trainer_id") `);
    await queryRunner.query(
      `ALTER TABLE "exercises" ADD CONSTRAINT "FK_af446695a3f98b2cc3bc3fe5bab" FOREIGN KEY ("workout_day_id") REFERENCES "workout_days"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "workout_days" ADD CONSTRAINT "FK_0bf9441a5f06c3965b19b1d8e03" FOREIGN KEY ("workout_plan_id") REFERENCES "workout_plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "workout_days" DROP CONSTRAINT "FK_0bf9441a5f06c3965b19b1d8e03"`);
    await queryRunner.query(`ALTER TABLE "exercises" DROP CONSTRAINT "FK_af446695a3f98b2cc3bc3fe5bab"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1ec73ce1e3da6c59fa40f23c6e"`);
    await queryRunner.query(`DROP TABLE "workout_plans"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_0bf9441a5f06c3965b19b1d8e0"`);
    await queryRunner.query(`DROP TABLE "workout_days"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_af446695a3f98b2cc3bc3fe5ba"`);
    await queryRunner.query(`DROP TABLE "exercises"`);
  }
}
