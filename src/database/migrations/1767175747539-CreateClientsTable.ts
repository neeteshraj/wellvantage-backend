import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClientsTable1767175747539 implements MigrationInterface {
  name = 'CreateClientsTable1767175747539';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "trainer_id" uuid NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(50), "sessions_total" integer NOT NULL DEFAULT '0', "sessions_used" integer NOT NULL DEFAULT '0', "package_expiry_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_1c75adeb1f5ad1babdc2129b7d" ON "clients" ("trainer_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_b48860677afe62cd96e1265948" ON "clients" ("email") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_b48860677afe62cd96e1265948"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1c75adeb1f5ad1babdc2129b7d"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
