import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions, DefaultNamingStrategy } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  namingStrategy: new DefaultNamingStrategy(),
};

const migrationsDataSource = new DataSource(dataSourceOptions);

export default migrationsDataSource;
