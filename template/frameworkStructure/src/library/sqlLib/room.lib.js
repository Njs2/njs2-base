const tableName = "room";
let roomLibObj;
class roomLib {
  static getInstance() {
    roomLibObj = roomLibObj || new roomLib();
    return roomLibObj;
  }

  async getRoomDetails(roomId) {
    return await SQLManager.find(tableName, { roomId: roomId, status: 2 })[0];
  }

  async getRoomList(query) {
    return await SQLManager.find(tableName, query);
  }

  async updateRooms(query, updates) {
    return await SQLManager.update(tableName, query, updates);
  }

  async create(roomObj) {
    return await SQLManager.insert(tableName, roomObj);
  }

  async getCustomRoom(type) {
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM ${tableName} WHERE type = ?`, [type]);
  }

  async getCustomRoomData(type) {
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM ${tableName} WHERE type = :type`, { type: type });
  }
}

module.exports = roomLib;