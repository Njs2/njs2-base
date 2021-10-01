const tableName = "room_user";
let roomUserLibObj;
class roomUserLib {
  static getInstance() {
    roomUserLibObj = roomUserLibObj || new roomUserLib();
    return roomUserLibObj;
  }
  
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
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM ${tableName} WHERE type = ?`, [type]);
  }
}

module.exports = roomUserLib;