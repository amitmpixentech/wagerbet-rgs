import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config';

const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.db,
  logging: false,
  synchronize: false,
  entities: [`${__dirname}/entities/**/*{.js,.ts}`],
  migrations: [`${__dirname}/migrations/**/*{.js,.ts}`],
};

export const dataSource = new DataSource(ormConfig);
