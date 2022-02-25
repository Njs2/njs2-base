class <class-name> {   
    async get<function-name>Detail(<class-name>_id) {
      return await SQLManager.findOne("<class-name>", { <class-name>_id: <class-name>_id });
    }
  
    async get<function-name>List(whereClause) {
      return await SQLManager.find("<class-name>", whereClause);
    }
  
    async update<function-name>(whereClause, updateData) {
      return await SQLManager.update("<class-name>", whereClause, updateData);
    }
  
    async create<function-name>(<class-name>Obj) {
      return await SQLManager.insert("<class-name>", <class-name>Obj);
    }
  
    async getCustom<function-name>Data(gender) {
      return await SQLManager.doExecuteRawQuery(`SELECT * FROM <class-name> WHERE gender = :gender`, { gender: gender });
    }
  }
  
  module.exports = <class-name>;