import { DB_SCHEMA, DefinedTableNames } from "../utils/constants";
import { DataTypes, QueryInterface, ModelAttributes, DOUBLE } from "sequelize";

const tableName = {
  schema: DB_SCHEMA,
  tableName: DefinedTableNames.INVOICE,
};

module.exports = {
  up: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    const attributes: ModelAttributes = {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      invoice_number: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      due_date: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      discount_id: {
        type: dataTypes.UUID,
        allowNull: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      total_amount_paid_after_discount: {
        type: DataTypes.DOUBLE,
      },
      total_original_amount: {
        type: DataTypes.DOUBLE,
      },
      total_discount_amount: {
        type: DOUBLE,
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE,
    };
    return await queryInterface.createTable(tableName, attributes);
  },

  down: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    return queryInterface.dropTable(tableName);
  },
};
