const tableName = "room";
class roomLib {
  static async getRoomDetails(roomId) {
    return await SQLManager.find(tableName, { roomId: roomId, status: 2 })[0];
  }

  static async getRoomList(query) {
    return await SQLManager.find(tableName, query);
  }

  static async updateRooms(query, updates) {
    return await SQLManager.update(tableName, query, updates);
  }

  static async create(roomObj) {
    return await SQLManager.insert(tableName, roomObj);
  }

  static async getCustomRoom(type) {
    return await SQLManager.doExecuteRawQuery(tableName, `SELECT * FROM ${tableName} WHERE type = ?`, [type]);
  }
}

module.exports = roomLib;