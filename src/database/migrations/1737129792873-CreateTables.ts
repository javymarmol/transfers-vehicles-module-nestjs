import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1737129792873 implements MigrationInterface {
  name = 'CreateTables1737129792873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vehicles" ("id" SERIAL NOT NULL, "plate" character varying NOT NULL, "service" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizational_units" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "projectId" integer, CONSTRAINT "PK_d818d009beb8256752e477fe4c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "vehicle_id" integer NOT NULL, "client_id" integer NOT NULL, "transmitter_id" integer NOT NULL, "project_id" integer NOT NULL, "organizational_unit_id" integer NOT NULL, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "permissions_roles_roles" ("permissionsId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_4a0eb2f30d7d81ba1069abaa94d" PRIMARY KEY ("permissionsId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aff2f66944175a2cb34cfa8a50" ON "permissions_roles_roles" ("permissionsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b746e554e30a7c6027aab29cda" ON "permissions_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_projects_projects" ("usersId" integer NOT NULL, "projectsId" integer NOT NULL, CONSTRAINT "PK_a91f75f7e14f99fea39021e60c2" PRIMARY KEY ("usersId", "projectsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1adafab12f396fa125182f0756" ON "users_projects_projects" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0922cc630203931d8048fce1d" ON "users_projects_projects" ("projectsId") `,
    );
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
      `ALTER TABLE "organizational_units" ADD CONSTRAINT "FK_61dd863f92ac6772639063001cb" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_9249ca69c046f687f06bafa43bb" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_b51bdb870765d09872dd4400451" FOREIGN KEY ("transmitter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_fc2701ec117b3be7833dd385de0" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_74d763f971b949e14a946b2fbe8" FOREIGN KEY ("organizational_unit_id") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" ADD CONSTRAINT "FK_cd20dd68de505af450a7c14787e" FOREIGN KEY ("organizationalUnitsId") REFERENCES "organizational_units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" ADD CONSTRAINT "FK_a3bf363c9da567ae04b90610273" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" ADD CONSTRAINT "FK_b746e554e30a7c6027aab29cda6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_projects_projects" ADD CONSTRAINT "FK_1adafab12f396fa125182f07564" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_projects_projects" ADD CONSTRAINT "FK_a0922cc630203931d8048fce1da" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_a0922cc630203931d8048fce1da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_1adafab12f396fa125182f07564"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_b746e554e30a7c6027aab29cda6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions_roles_roles" DROP CONSTRAINT "FK_aff2f66944175a2cb34cfa8a503"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" DROP CONSTRAINT "FK_a3bf363c9da567ae04b90610273"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units_users_users" DROP CONSTRAINT "FK_cd20dd68de505af450a7c14787e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_74d763f971b949e14a946b2fbe8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_fc2701ec117b3be7833dd385de0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_b51bdb870765d09872dd4400451"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_9249ca69c046f687f06bafa43bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_4a5eedc863f271f9a6c9a17dab3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizational_units" DROP CONSTRAINT "FK_61dd863f92ac6772639063001cb"`,
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
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0922cc630203931d8048fce1d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1adafab12f396fa125182f0756"`,
    );
    await queryRunner.query(`DROP TABLE "users_projects_projects"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b746e554e30a7c6027aab29cda"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aff2f66944175a2cb34cfa8a50"`,
    );
    await queryRunner.query(`DROP TABLE "permissions_roles_roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a3bf363c9da567ae04b9061027"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cd20dd68de505af450a7c14787"`,
    );
    await queryRunner.query(`DROP TABLE "organizational_units_users_users"`);
    await queryRunner.query(`DROP TABLE "transfers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "organizational_units"`);
    await queryRunner.query(`DROP TABLE "vehicles"`);
  }
}
