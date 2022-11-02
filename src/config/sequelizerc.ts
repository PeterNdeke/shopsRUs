import path from 'path';
import { Env } from './env';

const { env } = Env.all();

const rc = {
  config: path.resolve('dist', 'config', 'config.js'),
  'models-path': path.resolve('dist', 'models'),
  'seeders-path': path.resolve('dist', 'seeders'),
  'migrations-path': path.resolve('dist', 'migrations'),
  'options-path': path.resolve('dist', 'config', 'options.json'),
  env,
  debug: true,
};

module.exports = rc;
