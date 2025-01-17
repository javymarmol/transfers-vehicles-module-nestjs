import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRealtionshipUserToOrgUnits1737074066006
  implements MigrationInterface
{
  name = 'FixRealtionshipUserToOrgUnits1737074066006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_organizational_units_organizational_units" ("usersId" integer NOT NULL, "organizationalUnitsId" integer NOT NULL, CONSTRAINT "PK_5bea342e8f7f5a3e3c119dd92a8" PRIMARY KEY ("usersId", "organizationalUnitsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9cead92903347dd3fe61911ff9" ON "users_organizational_units_organizational_units" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_738044d105683b7eabe96d693c" ON "users_organizational_units_organizational_units" ("organizationalUnitsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_organizational_units_organizational_units" ADD CONSTRAINT "FK_9cead92903347dd3fe61911ff97" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_organizational_units_organizational_units" ADD CONSTRAINT "FK_738044d105683b7eabe96d693c5" FOREIGN KEY ("organizationalUnitsId") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_organizational_units_organizational_units" DROP CONSTRAINT "FK_738044d105683b7eabe96d693c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_organizational_units_organizational_units" DROP CONSTRAINT "FK_9cead92903347dd3fe61911ff97"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_738044d105683b7eabe96d693c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cead92903347dd3fe61911ff9"`,
    );
    await queryRunner.query(
      `DROP TABLE "users_organizational_units_organizational_units"`,
    );
  }
}
