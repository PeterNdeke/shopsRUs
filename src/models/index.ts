import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dbSequelize from '../config/db';
import { LoggingService } from '../utils/logger';
const basename = path.basename(__filename);

const db: any = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(dbSequelize, Sequelize.DataTypes);
    LoggingService.info(model);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = dbSequelize;
db.Sequelize = Sequelize;

module.exports = db;
