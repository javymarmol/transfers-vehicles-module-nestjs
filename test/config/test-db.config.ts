import { DataType, newDb } from 'pg-mem';
import 'reflect-metadata';

export async function TempDB(entities: any[]): Promise<any> {
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
    entities: ['../../src/**/*.entity.ts'],
    database: 'test',
    synchronize: true,
    migrations: ['../../src/database/migrations/*.ts'],
    migrationsRun: true,
  });

  // Initialize datasource
  await datasource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialize');
    })
    .catch(() => console.error('Error during data source initialization.'));

  // create schema
  await datasource
    .synchronize()
    .then(() => {
      console.log('Data Source has been synchronize');
    })
    .catch(() => console.error('Error during data source sync.'));

  return datasource;
}
