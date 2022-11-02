import { DB_SCHEMA, DefinedTableNames } from "../utils/constants";
import { DataTypes, QueryInterface, ModelAttributes } from "sequelize";

const tableName = {
  schema: DB_SCHEMA,
  tableName: DefinedTableNames.INVOICE_ITEMS,
};

module.exports = {
  up: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    const attributes: ModelAttributes = {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      invoice_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      item_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      item_description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      quantity: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      price_per_unit: {
        type: dataTypes.DOUBLE,
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: DataTypes.DOUBLE,
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
