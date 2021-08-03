const { Sequelize } = require("sequelize");

module.exports = new Sequelize("myDB", process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: "postgres"
});
