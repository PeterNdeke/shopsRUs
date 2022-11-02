import "reflect-metadata";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
const myEnv = dotenv.config();
expand(myEnv);

/**
 * cache ENV value, its faster!
 *
 */
const envGlobCache: { [x: string]: string } = {};

function getEnv(envKey: string) {
  if (envGlobCache[envKey] !== undefined) {
    return envGlobCache[envKey];
  }
  const newEnv = process.env[envKey];
  if (newEnv !== undefined) {
    envGlobCache[envKey] = newEnv;
    return newEnv;
  }
  return undefined;
}

function getEnvString(envKey: string) {
  const val = getEnv(envKey);
  if (val) {
    return val;
  }
  return "";
}

//@ts-ignore
function getEnvBool(envKey: string) {
  const val = getEnv(envKey);
  if (val !== undefined && String(val) === "true") {
    return true;
  }
  return false;
}

function getEnvNumber(envKey: string, defaultVal?: number) {
  const val = getEnv(envKey);
  if (val !== undefined && !isNaN(Number(val))) {
    return Number(val);
  }
  return defaultVal as any as number;
}

type IEnvironment = "production" | "staging" | "development" | "test";

export const envConfig = {
  db_host: getEnvString("DB_HOST"),
  db_name: getEnvString("DB_NAME"),
  db_password: getEnvString("DB_PASSWORD"),
  db_user: getEnvString("DB_USERNAME"),
  db_port: getEnvNumber("DB_PORT"),
  //
  test_db_user: getEnvString("TEST_DB_USERNAME"),
  test_db_password: getEnvString("TEST_DB_PASSWORD"),
  test_db_name: getEnvString("TEST_DB_NAME"),
  test_db_host: getEnvString("TEST_DB_HOST"),
  test_db_port: getEnvNumber("TEST_DB_PORT"),

  env: getEnvString("NODE_ENV") as IEnvironment,

  port: getEnvNumber("PORT"),
} as const;

export class Env {
  static all() {
    return envConfig;
  }
}
