const tableName = "room_user";
class roomUserLib {
  static async getRoomUserDetails(roomUserId) {
    return await SQLManager.find(tableName, { roomUserId: roomUserId, status: 2 })[0];
  }

  static async getRoomUserList(query) {
    return await SQLManager.find(tableName, query);
  }

  static async updateRoomUsers(query, updates) {
    return await SQLManager.update(tableName, query, updates);
  }

  static async create(roomUserObj) {
    return await SQLManager.insert(tableName, roomUserObj);
  }

  static async getCustomRoomUser(type) {
    return await SQLManager.doExecuteRawQuery(tableName, `SELECT * FROM ${tableName} WHERE type = ?`, [type]);
  }
}

module.exports = roomUserLib;