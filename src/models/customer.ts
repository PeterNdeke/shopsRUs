import Sequelize, { DataTypes, Optional } from "sequelize";
import dbConnection from "../config/db";
import { ICustomer } from "../types/models";
import {
  CUSTOMER_STATUS,
  CUSTOMER_TYPE,
  DefinedTableNames,
} from "../utils/constants";
import { BaseModel } from "./baseModel";

export interface Customer extends ICustomer {}
export class Customer extends BaseModel<ICustomer, Optional<ICustomer, "id">> {}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(CUSTOMER_STATUS)),
      allowNull: false,
    },
    customer_type: {
      type: DataTypes.ENUM(...Object.keys(CUSTOMER_TYPE)),
    },
  },
  {
    tableName: DefinedTableNames.CUSTOMERS,
    sequelize: dbConnection,
  }
);
