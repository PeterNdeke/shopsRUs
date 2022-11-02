import { DB_SCHEMA, DefinedTableNames } from "../utils/constants";
import { DataTypes, QueryInterface, ModelAttributes } from "sequelize";

const tableName = {
  schema: DB_SCHEMA,
  tableName: DefinedTableNames.CUSTOMERS,
};

module.exports = {
  up: async (queryInterface: QueryInterface, dataTypes: typeof DataTypes) => {
    const attributes: ModelAttributes = {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customer_email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      customer_phone: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      country: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      customer_type: {
        allowNull: false,
        type: DataTypes.STRING,
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
