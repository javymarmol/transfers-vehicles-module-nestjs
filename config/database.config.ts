import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('dbConfig', () => {
  return {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    dbName: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  };
});
