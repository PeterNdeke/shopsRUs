import { DB_SCHEMA, DefinedTableNames } from "../utils/constants";
import { DataTypes, QueryInterface, ModelAttributes } from "sequelize";

const tableName = {
  schema: DB_SCHEMA,
  tableName: DefinedTableNames.DISCOUNTS,
};

module.exports = {
  up: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    const attributes: ModelAttributes = {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      discount_percent: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      discount_amount: {
        type: dataTypes.DOUBLE,
        allowNull: true,
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
