class userLib {
    async getUserDetails(user_id) {
      return await SQLManager.findOne("user", { user_id: user_id });
    }
  
    async getUserList(query) {
      return await SQLManager.find("user", query);
    }
  
    async updateUsers(query, updates) {
      return await SQLManager.update("user", query, updates);
    }
  
    async create(userObj) {
      return await SQLManager.insert("user", userObj);
    }
  
    async getCustomUserData(gender) {
      return await SQLManager.doExecuteRawQuery(`SELECT * FROM user WHERE gender = :gender`, { gender: gender });
    }
  }
  
  module.exports = userLib;