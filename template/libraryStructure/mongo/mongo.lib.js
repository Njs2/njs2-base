const { init<function-name>Model } = require("./model/<class-name>");

class <class-name> {

  async get<function-name>Detail(query, options = []) {
    let <class-name>Model = await init<function-name>Model();
    return await <class-name>Model.findOne(query).lean();
  }

  async get<function-name>List(query, options = []) {
    let <class-name>Model = await init<function-name>Model();
    return await <class-name>Model.find(query).lean();
  }
  
  async update<function-name>(query, data) {
    let <class-name>Model = await init<function-name>Model();
    return await <class-name>Model.findOneAndUpdate(query, data, {
      new: true
    });
  }

  async create<function-name>(data) {
    let <class-name>Model = await init<function-name>Model();
    let new<function-name> = new <class-name>Model(data);
    return new<function-name>.save();
  }
  
  async delete<function-name>(query) {
    let <class-name>Model = await init<function-name>Model();
    return await <class-name>Model.findOneAndDelete(query);
  }
}

module.exports = <class-name>;

   