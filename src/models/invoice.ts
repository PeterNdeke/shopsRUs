import Sequelize, { DataTypes, Optional } from "sequelize";
import dbConnection from "../config/db";
import { IInvoice } from "../types/models";
import { DefinedTableNames, INVOICE_STATUS } from "../utils/constants";
import { BaseModel } from "./baseModel";
import { InvoiceItem } from "./invoiceItem";

export interface Invoice extends IInvoice {}
export class Invoice extends BaseModel<IInvoice, Optional<IInvoice, "id">> {}

Invoice.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    discount_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    total_discount_amount: {
      type: DataTypes.DOUBLE,
    },
    total_amount_paid_after_discount: {
      type: DataTypes.DOUBLE,
    },
    total_original_amount: {
      type: DataTypes.DOUBLE,
    },
    status: {
      type: DataTypes.ENUM(...Object.keys(INVOICE_STATUS)),
      allowNull: false,
    },
  },
  {
    tableName: DefinedTableNames.INVOICE,
    sequelize: dbConnection,
  }
);
Invoice.hasMany(InvoiceItem, { as: "invoice_items", foreignKey: "invoice_id" });
