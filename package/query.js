module.exports.DATABSE_QUERY = {
  "getTableSchema": {
    "mysql": "SELECT column_name as column_name, data_type as data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? ;",
    "postgres": "SELECT column_name, data_type FROM information_schema.COLUMNS WHERE TABLE_NAME = ? AND TABLE_SCHEMA = 'public' AND TABLE_CATALOG = ? ;"
  },
}
