import { Sequelize } from 'sequelize';
import { Env } from './env';
import { DB_SCHEMA } from '../utils/constants';
import { connectionConfig } from './config';

const env = Env.all();
const dbConfig = connectionConfig[env.env];

let sequelize: Sequelize;

if (dbConfig.use_env_variable) {
  const connStr = process.env[dbConfig.use_env_variable] || '';
  sequelize = new Sequelize(connStr, {
    ...dbConfig,
    dialect: 'postgres',
    logging: false,
    define: {
      schema: DB_SCHEMA,
      hooks: {
        beforeFind: (options) => {
          options.raw = true;
        },
      },
    },
  });
} else {
  sequelize = new Sequelize({
    ...dbConfig,
    dialect: 'postgres',
    logging: false,
    define: {
      schema: DB_SCHEMA,
      hooks: {
        beforeFind: (options) => {
          options.raw = true;
        },
      },
    },
  });
}

export default sequelize;
export const sequelizeDb = sequelize;
