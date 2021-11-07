const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Url = sequelize.define(
  "Url",
  {
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      unique: true,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
  },
  {
    tableName: "Urls",
  }
);

module.exports = Url;
