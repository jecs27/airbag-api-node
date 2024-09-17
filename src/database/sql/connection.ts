import 'dotenv/config';

import { DataSource } from 'typeorm';
import UserPG from './entities/users.entity';
import VehiclePG from './entities/vehicles.entity';

/* This code snippet is setting up a data source configuration for a PostgreSQL database using TypeORM
in a TypeScript environment. */
const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME
} = process.env;
export const dataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  synchronize: false,
  logging: ['error'],
  entities: [
    UserPG,
    VehiclePG
  ],
  migrations: ['src/database/sql/migrations/*.ts'],
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});

export const getDataSourceRepository = async (entity: any) => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.manager.getRepository(entity);
};
