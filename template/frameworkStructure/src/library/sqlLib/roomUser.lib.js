class roomUserLib {
  async getRoomUserDetails(roomUserId) {
    return await SQLManager.find("room_user", { roomUserId: roomUserId, status: 2 })[0];
  }

  async getRoomUserList(query) {
    return await SQLManager.find("room_user", query);
  }

  async updateRoomUsers(query, updates) {
    return await SQLManager.update("room_user", query, updates);
  }

  async create(roomUserObj) {
    return await SQLManager.insert("room_user", roomUserObj);
  }

  async getCustomRoomUser(type) {
    return await SQLManager.doExecuteRawQuery(`SELECT * FROM room_user WHERE type = ?`, [type]);
  }
}

module.exports = roomUserLib;