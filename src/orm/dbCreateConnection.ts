import { DataSource } from 'typeorm';

import { dataSource } from './ormconfig';

export default async (): Promise<DataSource | null> => {
  return dataSource.initialize();
};
