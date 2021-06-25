const { DATABSE_QUERY } = require('./query');
const { getSQLConnection } = require('./dbConnect');

let dbManager = {};

/**
 * Database Insert
 * @function insert
 * @param {string} tableName
 * @param {Object} query
 * @returns {Promise<Number>} Number of rows inserted
 */
dbManager.insert = async (tableName, query) => {
  const conn = await getSQLConnection();
  let sql = `INSERT into ${{ "postgres": '"public".', "mysql": '' }[process.env.DATABASE_TYPE]}"${tableName}" (`;
  let keys = Object.keys(query);
  let replacements = [];

  // Add keys from json to SQL query
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    sql += `"${key}" ${i != keys.length - 1 ? ', ' : ''} `;
  }

  sql += ") VALUES (";

  // Add values from json to SQL query
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = query[key];

    if (typeof value == 'object') {
      value = JSON.stringify(value);
    }
    sql += ` ? ${i != keys.length - 1 ? ', ' : ''} `;
    replacements.push(value);
  }

  sql += `)`;

  // Remove double qoutes from mysql query and replace single qoutes to double
  if (process.env.DATABASE_TYPE == "postgres") {
    // DATABASE_TYPE == "postgres" ? sql += ' RETURNING * ' : '';
    sql = sql.replace(/'/g, '"');
  } else if (process.env.DATABASE_TYPE == "mysql")
    sql = sql.replace(/"/g, '');

  let res = await conn.query(sql, {
    replacements: replacements, raw: true
  });

  // console.log(res);
  return { "postgres": res[1], "mysql": res[1] }[process.env.DATABASE_TYPE];
};

/**
 * Database find
 * @function find
 * @param {string} tableName
 * @param {Object} query
 * @param {Object} order
 * @returns {Promise<Object>}
 */
dbManager.find = async (tableName, query, order = {}) => {
  const conn = await getSQLConnection();
  let sql = `SELECT * FROM ${{ "postgres": '"public".', "mysql": '' }[process.env.DATABASE_TYPE]}"${tableName}" WHERE `;
  let keys = Object.keys(query);
  let replacements = [];

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = query[key];
    let eq = '=';

    if (typeof value == 'object') {
      const fieldVal = Object.keys(value)[0];
      switch (fieldVal) {
        case '$lt':
          eq = '<';
          value = value[fieldVal];
          break;

        case '$lte':
          eq = '<=';
          value = value[fieldVal];
          break;

        case '$gt':
          eq = '>';
          value = value[fieldVal];
          break;

        case '$gte':
          eq = '>=';
          value = value[fieldVal];
          break;
      }

      if (typeof value == 'object')
        value = JSON.stringify(value);
    }

    sql += ` "${key}" ${eq} ? ${i != keys.length - 1 ? ' AND ' : ''}`;
    replacements.push(value);
  }

  keys = Object.keys(order);
  for (let i = 0; i < keys.length; i++) {
    if (i == 0) sql += " ORDER BY ";
    let key = keys[i];
    let value = order[key];

    sql += ` "${key}" ${value == 1 ? ' ASC ' : ' DESC '} ${i != keys.length - 1 ? ', ' : ''}`;
  }

  // Remove double qoutes from mysql query and replace single qoutes to double
  if (process.env.DATABASE_TYPE == "postgres")
    sql = sql.replace(/'/g, '"');
  else if (process.env.DATABASE_TYPE == "mysql")
    sql = sql.replace(/"/g, '');

  const res = await conn.query(sql, {
    replacements: replacements, raw: true, nest: true
  });
  return res;
};

/**
 * Database Update
 * @function update
 * @param {string} tableName
 * @param {Object} query
 * @param {Object} updates
 * @returns {Promise<Number>} Number of rows affected
 */
dbManager.update = async (tableName, query, updates) => {
  const conn = await getSQLConnection();
  let sql = `UPDATE ${{ "postgres": '"public".', "mysql": '' }[process.env.DATABASE_TYPE]}"${tableName}" SET `;
  let keys = Object.keys(updates);
  let replacements = [];

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = updates[key];
    let eq = '=';

    if (typeof value == 'object') {
      const fieldVal = Object.keys(value)[0];
      switch (fieldVal) {
        case '$inc':
          eq = ` = "${key}" + `;
          value = value[fieldVal];
          break;

        case '$dec':
          eq = ` = "${key}" + `;
          value = value[fieldVal];
          break;
      }

      if (typeof value == 'object')
        value = JSON.stringify(value);
    }

    sql += ` "${key}" ${eq} ? ${i != keys.length - 1 ? ', ' : ''}`;
    replacements.push(value);
  }

  keys = Object.keys(query);
  for (let i = 0; i < keys.length; i++) {
    if (i == 0) sql += " WHERE ";

    let key = keys[i];
    let value = query[key];
    let eq = '=';

    if (typeof value == 'object') {
      const fieldVal = Object.keys(value)[0];
      switch (fieldVal) {
        case '$lt':
          eq = '<';
          value = value[fieldVal];
          break;

        case '$lte':
          eq = '<=';
          value = value[fieldVal];
          break;

        case '$gt':
          eq = '>';
          value = value[fieldVal];
          break;

        case '$gte':
          eq = '>=';
          value = value[fieldVal];
          break;
      }

      if (typeof value == 'object')
        value = JSON.stringify(value);
    }

    sql += ` "${key}" ${eq} ? ${i != keys.length - 1 ? ' AND ' : ''}`;
    replacements.push(value);
  }

  // Remove double qoutes from mysql query and replace single qoutes to double
  if (process.env.DATABASE_TYPE == "postgres") {
    // sql += ' RETURNING * ';
    sql = sql.replace(/'/g, '"');
  } else if (process.env.DATABASE_TYPE == "mysql")
    sql = sql.replace(/"/g, '');

  let res = await conn.query(sql, {
    replacements: replacements, raw: true
  });

  // console.log(res);
  return { "postgres": res[1].rowCount, "mysql": res[1].affectedRows }[process.env.DATABASE_TYPE];
};

dbManager.doExecute = async (sqlObj, replacements) => {
  const conn = await getSQLConnection();
  const res = await conn.query(sqlObj[process.env.DATABASE_TYPE], {
    replacements: replacements, raw: true, nest: true
  });
  return res;
};

dbManager.doExecuteRawQuery = async (sqlQuery, replacements) => {
  const conn = await getSQLConnection();
  const res = await conn.query(sqlQuery, {
    replacements: replacements, raw: true, nest: true
  });
  return res;
};

dbManager.verifyTbl = async (tableName, model) => {
  const schema = await dbManager.doExecute(DATABSE_QUERY['getTableSchema'], [tableName, process.env.SQL_DB_NAME]);

  const dbSchema = {};
  let dbResult = [];
  schema.map(fields => dbSchema[fields.column_name] = fields.data_type);

  const DATA_TYPE = require("../lib/dataType");
  if (model[process.env.DATABASE_TYPE]) {
    Object.keys(model[process.env.DATABASE_TYPE]).map(field => {
      let type = model[process.env.DATABASE_TYPE][field];
      if (type.indexOf("$") == 0) {
        type = DATA_TYPE[type.split('$').join('')] ? DATA_TYPE[type.split('$').join('')][process.env.DATABASE_TYPE] : type;
      }
      if (type != dbSchema[field]) {
        let result = `Database Schema Error of ${tableName} table : Invalid database field ${field}. ${dbSchema[field] ? `Expected type: ${type}, Current type: ${dbSchema[field]}` : `Missing field ${field} of type ${type}`}`;
        dbResult.push(result);
      }
    });
  } else {
    Object.keys(model['default']).map(field => {
      let type = model['default'][field];
      if (type.indexOf("$") == 0) {
        type = DATA_TYPE[type.split('$').join('')] ? DATA_TYPE[type.split('$').join('')][process.env.DATABASE_TYPE] : type;
      }
      if (type != dbSchema[field]) {
        let result = `Database Schema Error of ${tableName} table : Invalid database field ${field}. ${dbSchema[field] ? `Expected type: ${type}, Current type: ${dbSchema[field]}` : `Missing field ${field} of type ${type}`}`;
        dbResult.push(result);
      }
    });
  }

  return dbResult;
};

dbManager.verifyAccessToken = async (accessToken) => {
  const jwt = require("./jwt");
  const decodedVal = await jwt.decodeJwtToken(accessToken, process.env.JWT_SECRET);
  if (!decodedVal || !decodedVal[process.env.ACCESS_TOKEN_DECODED_KEY]) {
    return false;
  }

  const verifedUser = await dbManager.find(process.env.AUTH_TABLE_NAME, { [process.env.ACCESS_TOKEN_KEY]: accessToken, [process.env.ACCESS_TOKEN_DECODED_KEY]: decodedVal[process.env.ACCESS_TOKEN_DECODED_KEY] });
  if (verifedUser.length > 0) {
    return verifedUser[0];
  };

  return false;
};

module.exports = { dbManager: dbManager };
