"use strict";

const { Sequelize, DataTypes } = require("sequelize");
const sequelizeConnection = require("../config/connection")
// const env = process.env.NODE_ENV || "dev";
// const config = require("../config/config")[env];

// const logging =
// 	process.env.NODE_ENV === "text"
// 		? false
// 		: /*(...msg) => console.log(msg) */ console.log;

// /** @type {import('sequelize').Sequelize} */
// const sequelize = new Sequelize(
// 	config.database,
// 	config.username,
// 	config.password,
// 	{
// 		host: config.host,
// 		dialect: config.dialect,
// 		logging: logging,
// 	}
// );

const sequelize = sequelizeConnection();

// register models here
const models = {
	User: require("./user")(sequelize, Sequelize.DataTypes),
	Course: require("./course")(sequelize, Sequelize.DataTypes),
	CourseSlot: require("./course-slot")(sequelize, Sequelize.DataTypes),
	Module: require("./module")(sequelize, Sequelize.DataTypes),
	Lesson: require("./lesson")(sequelize, Sequelize.DataTypes),
	ModuleSlot: require("./module-slot")(sequelize, Sequelize.DataTypes),
	Order: require("./order")(sequelize, Sequelize.DataTypes),

	// add more models here
};

Object.keys(models).forEach((modelName) => {
	if ("associate" in models[modelName]) {
		models[modelName].associate(models);
	}
});

module.exports = { sequelize, ...models };

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
