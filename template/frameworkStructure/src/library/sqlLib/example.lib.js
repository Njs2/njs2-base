    /*
    NOTE :
      1.  Pre-requisite : Install sql package via following command : npm i @njs2/sql
      2.  To call this function in any action class use below statement :
          let exampleModel = AutoLoad.loadLibray("sqlLib",["example"]);
          exampleHelper.getExampleDetail(1);
      3.  Remove sqlLib folder if SQL is not used in project.
   */
class exampleLib {   
    async getExampleDetail(example_id) {
      return await SQLManager.findOne("example", { example_id: example_id });
    }
  
    async getExampleList(whereClause) {
      return await SQLManager.find("example", whereClause);
    }
  
    async updateExample(whereClause, updateData) {
      return await SQLManager.update("example", whereClause, updateData);
    }
  
    async createExample(exampleObj) {
      return await SQLManager.insert("example", exampleObj);
    }
  
    async getCustomExampleData(gender) {
      return await SQLManager.doExecuteQuery(`SELECT * FROM example WHERE gender = :gender`, { gender: gender });
    }
  }
  
  module.exports = exampleLib;
