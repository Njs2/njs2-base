class roomLib {
  async getRoomDetails(roomId) {
    return await SQLManager.find("room", { roomId: roomId, status: 2 })[0];
  }

  async getRoomList(query) {
    return await SQLManager.find("room", query);
  }

  async updateRooms(query, updates) {
    return await SQLManager.update("room", query, updates);
  }

  async create(roomObj) {
    return await SQLManager.insert("room", roomObj);
  }

  async getCustomRoom(type) {
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM room WHERE type = ?`, [type]);
  }

  async getCustomRoomData(type) {
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM room WHERE type = :type`, { type: type });
  }
}

module.exports = roomLib;