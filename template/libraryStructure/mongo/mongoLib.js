const { init<function-name>Model } = require("./model/<class-name>");

class <class-name>Lib {
  async create<function-name>(data) {
    try {
      let <class-name>Model = await init<function-name>Model();
      let new<class-name> = new <class-name>Model(data);
      return new<class-name>.save();
    } catch (e) {
      console.log(e);
    }
  }

  async get<function-name>Detail(query, options = []) {
    try {
      let <class-name>Model = await init<function-name>Model();
      return await <class-name>Model.findOne(query).lean();
    } catch (e) {
      console.log(e);
    }
  }

  async update<function-name>(query, data) {
    try {
      let <class-name>Model = await init<function-name>Model();
      return await <class-name>Model.findOneAndUpdate(query, data, {
        new: true
      });
    } catch (e) {
      console.log(e);
    }
  }

  async delete<function-name>(query) {
    try {
      let <class-name>Model = await init<function-name>Model();
      return await <class-name>Model.findOneAndDelete(query);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = <class-name>Lib;

   