import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOorganizationalUnitsTableAndRelationsWithUsersAndproject1737063834850
  implements MigrationInterface
{
  name =
    'CreateOorganizationalUnitsTableAndRelationsWithUsersAndproject1737063834850';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organizational_units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_d818d009beb8256752e477fe4c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizational_units_users_users" ("organizationalUnitsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_ad5bc5f83c0cb03924e706a90ed" PRIMARY KEY ("organizationalUnitsId", "usersId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cd20dd68de505af450a7c14787" ON "organizational_units_users_users" ("organizationalUnitsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a3bf363c9da567ae04b9061027" ON "organizational_units_users_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units" ADD CONSTRAINT "FK_61dd863f92ac6772639063001cb" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" ADD CONSTRAINT "FK_cd20dd68de505af450a7c14787e" FOREIGN KEY ("organizationalUnitsId") REFERENCES "organizational_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" ADD CONSTRAINT "FK_a3bf363c9da567ae04b90610273" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" DROP CONSTRAINT "FK_a3bf363c9da567ae04b90610273"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" DROP CONSTRAINT "FK_cd20dd68de505af450a7c14787e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units" DROP CONSTRAINT "FK_61dd863f92ac6772639063001cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a3bf363c9da567ae04b9061027"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd20dd68de505af450a7c14787"`,
    );
    await queryRunner.query(`DROP TABLE "organizational_units_users_users"`);
    await queryRunner.query(`DROP TABLE "organizational_units"`);
  }
}
