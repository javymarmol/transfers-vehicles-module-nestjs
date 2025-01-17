import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixedForeingKeysForTransfersTable1737097424873
  implements MigrationInterface
{
  name = 'FixedForeingKeysForTransfersTable1737097424873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT IF EXISTS "FK_68e0e107716d20ee96e8b70a3d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT IF EXISTS "FK_d5e392e4ef0106120a2b4bea4be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT IF EXISTS "FK_21c4105c4ba2fecea287b30184c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT IF EXISTS "FK_fedff261a0bed67ed4cabc471db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT IF EXISTS "FK_b29756e65982ab22b064834d2ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP COLUMN IF EXISTS "organizationalUnitId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP COLUMN IF EXISTS "projectId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP COLUMN IF EXISTS "transmitterId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP COLUMN IF EXISTS "clientId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP COLUMN IF EXISTS "vehicleId"`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`ALTER TABLE "transfers" ADD "vehicleId" integer`);
    await queryRunner.query(`ALTER TABLE "transfers" ADD "clientId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD "transmitterId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "transfers" ADD "projectId" integer`);
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD "organizationalUnitId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_b29756e65982ab22b064834d2ac" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_fedff261a0bed67ed4cabc471db" FOREIGN KEY ("organizationalUnitId") REFERENCES "organizational_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_21c4105c4ba2fecea287b30184c" FOREIGN KEY ("transmitterId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_d5e392e4ef0106120a2b4bea4be" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_68e0e107716d20ee96e8b70a3d0" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
