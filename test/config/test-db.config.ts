import { DataType, newDb } from 'pg-mem';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export async function TempDB(entities: EntityClassOrSchema[]): Promise<any> {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    name: 'version',
    returns: DataType.text,
    implementation: () => '13.2',
  });

  db.public.registerFunction({
    name: 'now',
    returns: DataType.timestamp,
    implementation: () => new Date(),
  });

  db.createSchema('test');

  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_schema',
  });
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  });

  const datasource = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [entities],
    database: 'test',
    migrations: ['../../src/database/migrations/*.ts'],
  });

  // Initialize datasource
  await datasource.initialize();
  // create schema
  await datasource.synchronize();

  return datasource;
}
