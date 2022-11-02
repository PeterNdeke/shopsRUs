import { Env } from "./env";
import { Options } from "sequelize";

const env = Env.all();

interface OptionsExtra extends Options {
  use_env_variable?: string;
}

const config: Record<string, OptionsExtra> = {
  development: {
    username: env.db_user,
    password: env.db_password,
    database: env.db_name,
    host: env.db_host,
    port: env.db_port,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  staging: {
    username: env.db_user,
    password: env.db_password,
    database: env.db_name,
    host: env.db_host,
    port: env.db_port,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  production: {
    username: env.db_user,
    password: env.db_password,
    database: env.db_name,
    host: env.db_host,
    port: env.db_port,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
  test: {
    username: env.test_db_user,
    password: env.test_db_password,
    database: env.test_db_name,
    host: env.test_db_host,
    port: env.test_db_port,
    dialect: "postgres",
  },
};

export const connectionConfig = { ...config };
module.exports = { ...config };
module.exports.connectionConfig = { ...config };
