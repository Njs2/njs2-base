const getMongooseConnection = () => {
  const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  if (mongoose.connection._readyState != 1) {
    const {
      MONGO_DB_URI, MONGO_USER_NAME, MONGO_DB_PASS, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_NAME, MONGO_OPTIONS
    } = process.env;

    console.log('=> using new database connection');
    const options = typeof MONGO_OPTIONS == "string" ? JSON.parse(MONGO_OPTIONS) : MONGO_OPTIONS;
    const uri = MONGO_DB_URI || `mongodb://${MONGO_USER_NAME ? `${MONGO_USER_NAME}:${MONGO_DB_PASS}@` : ''}${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;
    mongoose.connect(uri, options);
  }
  return mongoose;
};

let conn = null;
// Connecting to DB
const getSQLConnection = async () => {
  if (!conn) {
    const Sequelize = require("sequelize");
    const { SQL_DB_HOST, SQL_DB_NAME, SQL_DB_USER, SQL_DB_PORT, SQL_DB_PASSWORD, DATABASE_TYPE } = process.env;
    conn = new Sequelize({
      database: SQL_DB_NAME,
      host: SQL_DB_HOST,
      username: SQL_DB_USER,
      port: SQL_DB_PORT,
      password: SQL_DB_PASSWORD,
      dialect: DATABASE_TYPE,
      dialectOptions: {
        multipleStatements: true
      },
      pool: {
        max: 1,
        min: 0,
        idle: 20000,
        acquire: 20000
      },
      logging: false, // To avoid sql query logs
    });
  }

  return conn;
};

module.exports.getSQLConnection = getSQLConnection;
module.exports.getMongooseConnection = getMongooseConnection;
