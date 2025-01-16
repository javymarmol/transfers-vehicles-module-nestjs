import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProjectTableAndRelationsWithUsers1737051877469
  implements MigrationInterface
{
  name = 'CreateProjectTableAndRelationsWithUsers1737051877469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "projects"
                             (
                                 "id"          SERIAL            NOT NULL,
                                 "name"        character varying NOT NULL,
                                 "description" character varying NOT NULL,
                                 "created_at"  TIMESTAMP         NOT NULL DEFAULT now(),
                                 CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "users_projects_projects"
                             (
                                 "usersId"    integer NOT NULL,
                                 "projectsId" integer NOT NULL,
                                 CONSTRAINT "PK_a91f75f7e14f99fea39021e60c2" PRIMARY KEY ("usersId", "projectsId")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_1adafab12f396fa125182f0756" ON "users_projects_projects" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0922cc630203931d8048fce1d" ON "users_projects_projects" ("projectsId") `,
    );
    await queryRunner.query(`ALTER TABLE "users_projects_projects"
        ADD CONSTRAINT "FK_1adafab12f396fa125182f07564" FOREIGN KEY ("usersId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "users_projects_projects"
        ADD CONSTRAINT "FK_a0922cc630203931d8048fce1da" FOREIGN KEY ("projectsId") REFERENCES "projects" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_a0922cc630203931d8048fce1da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_projects_projects" DROP CONSTRAINT "FK_1adafab12f396fa125182f07564"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a0922cc630203931d8048fce1d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1adafab12f396fa125182f0756"`,
    );
    await queryRunner.query(`DROP TABLE "users_projects_projects"`);
    await queryRunner.query(`DROP TABLE "projects"`);
  }
}
