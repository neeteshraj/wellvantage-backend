import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCalendarTables1767104850223 implements MigrationInterface {
  name = 'CreateCalendarTables1767104850223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookings" ("id" character varying(50) NOT NULL, "trainer_id" character varying(50) NOT NULL, "member_id" character varying(50) NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'confirmed', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_2627d11ec25da695fefdc2a692" ON "bookings" ("trainer_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_1dc7e0f9ea4c487f6c4095bc15" ON "bookings" ("member_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_8e7c82b1d5f5993174b9e2ae51" ON "bookings" ("date") `);
    await queryRunner.query(`CREATE INDEX "IDX_03f4f9e3dc649aeb6c71d0a784" ON "bookings" ("trainer_id", "date") `);
    await queryRunner.query(
      `CREATE TABLE "availability_blocks" ("id" character varying(50) NOT NULL, "trainer_id" character varying(50) NOT NULL, "date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_954296de8b743d25b9550b087e0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_604da1b4ea0c044d1c9a4149bf" ON "availability_blocks" ("trainer_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_517c8897460b63f33ef083859c" ON "availability_blocks" ("date") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_6f8c05588d340d5174e2161d09" ON "availability_blocks" ("trainer_id", "date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_6f8c05588d340d5174e2161d09"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_517c8897460b63f33ef083859c"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_604da1b4ea0c044d1c9a4149bf"`);
    await queryRunner.query(`DROP TABLE "availability_blocks"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_03f4f9e3dc649aeb6c71d0a784"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_8e7c82b1d5f5993174b9e2ae51"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_1dc7e0f9ea4c487f6c4095bc15"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2627d11ec25da695fefdc2a692"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
  }
}
