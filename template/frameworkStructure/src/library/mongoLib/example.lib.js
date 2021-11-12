const { initExampleModel } = require("./model/example");
    /*
    NOTE :
      1.  Pre-requisite : Install mongo package via following command : npm i @njs2/mongo
      2.  To call this function in any action class use below statement :
          let exampleModel = AutoLoad.loadLibray("mongoLib",["example"]);
          exampleHelper.getExampleDetail({example_id : 1});
      3.  Remove mongoLib folder if mongoDB is not used in project.
   */

class exampleLib {
  async createExample(data) {
    try {
      let exampleModel = await initExampleModel();
      let newexample = new exampleModel(data);
      return newexample.save();
    } catch (e) {
      console.log(e);
    }
  }

  async getExampleDetail(query, options = []) {
    try {
      let exampleModel = await initExampleModel();
      return await exampleModel.findOne(query).lean();
    } catch (e) {
      console.log(e);
    }
  }

  async updateExample(query, data) {
    try {
      let exampleModel = await initExampleModel();
      return await exampleModel.findOneAndUpdate(query, data, {
        new: true
      });
    } catch (e) {
      console.log(e);
    }
  }

  async deleteExample(query) {
    try {
      let exampleModel = await initExampleModel();
      return await exampleModel.findOneAndDelete(query);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = exampleLib;

   