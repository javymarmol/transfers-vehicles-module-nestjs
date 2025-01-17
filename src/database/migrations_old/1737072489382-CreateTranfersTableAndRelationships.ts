import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTranfersTableAndRelationships1737072489382
  implements MigrationInterface
{
  name = 'CreateTranfersTableAndRelationships1737072489382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "vehicle_id" integer NOT NULL, "client_id" integer NOT NULL, "transmitter_id" integer NOT NULL, "project_id" integer NOT NULL, "organizational_unit_id" integer NOT NULL, "vehicleId" integer, "clientId" integer, "transmitterId" integer, "projectId" integer, "organizationalUnitId" integer, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_b29756e65982ab22b064834d2ac" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_21c4105c4ba2fecea287b30184c" FOREIGN KEY ("transmitterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_fedff261a0bed67ed4cabc471db" FOREIGN KEY ("organizationalUnitId") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_fedff261a0bed67ed4cabc471db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_21c4105c4ba2fecea287b30184c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_b29756e65982ab22b064834d2ac"`,
    );
    await queryRunner.query(`DROP TABLE "transfers"`);
  }
}
