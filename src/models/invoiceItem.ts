import Sequelize, { DataTypes, Optional } from "sequelize";
import dbConnection from "../config/db";
import { IInvoiceItem } from "../types/models";
import { DefinedTableNames } from "../utils/constants";
import { BaseModel } from "./baseModel";
import { Invoice } from "./invoice";

export interface InvoiceItem extends IInvoiceItem {}
export class InvoiceItem extends BaseModel<
  IInvoiceItem,
  Optional<IInvoiceItem, "id">
> {}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Invoice,
        key: "id",
      },
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_description: {
      type: DataTypes.STRING,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    price_per_unit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: DefinedTableNames.INVOICE_ITEMS,
    sequelize: dbConnection,
  }
);
