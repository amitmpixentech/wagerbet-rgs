import { DataSource, DataSourceOptions } from 'typeorm';
import config from '../config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  namingStrategy: new SnakeNamingStrategy(),
};

export const dataSource = new DataSource(ormConfig);
