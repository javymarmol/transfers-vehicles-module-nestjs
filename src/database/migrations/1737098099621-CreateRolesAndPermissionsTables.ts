import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesAndPermissionsTables1737098099621
  implements MigrationInterface
{
  name = 'CreateRolesAndPermissionsTables1737098099621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions_roles_roles" ("permissionsId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_4a0eb2f30d7d81ba1069abaa94d" PRIMARY KEY ("permissionsId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aff2f66944175a2cb34cfa8a50" ON "permissions_roles_roles" ("permissionsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b746e554e30a7c6027aab29cda" ON "permissions_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "roleId" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_b746e554e30a7c6027aab29cda6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_b746e554e30a7c6027aab29cda6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b746e554e30a7c6027aab29cda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aff2f66944175a2cb34cfa8a50"`,
    );
    await queryRunner.query(`DROP TABLE "permissions_roles_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
