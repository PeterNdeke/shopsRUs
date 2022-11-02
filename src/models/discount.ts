import Sequelize, { DataTypes, Optional } from "sequelize";
import dbConnection from "../config/db";
import { IDiscount } from "../types/models";
import { DefinedTableNames } from "../utils/constants";
import { BaseModel } from "./baseModel";

export interface Discount extends IDiscount {}
export class Discount extends BaseModel<IDiscount, Optional<IDiscount, "id">> {}

Discount.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount_amount: {
      type: DataTypes.DOUBLE,
    },
  },
  {
    tableName: DefinedTableNames.DISCOUNTS,
    sequelize: dbConnection,
  }
);
