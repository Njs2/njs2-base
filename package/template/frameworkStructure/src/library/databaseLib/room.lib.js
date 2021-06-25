const dbManager = require("njs2-base/package/dbManager.js").dbManager;

let roomLib = [];

roomLib.getRoomDetails = async (roomId) => {
  return await dbManager.find('room', { roomId: roomId, status: 2 })[0];
}

roomLib.getRoomList = async (query) => {
  return await dbManager.find('room', query);
}

roomLib.updateRooms = async (query, updates) => {
  return await dbManager.update('room', query, updates);
}

roomLib.create = async (roomObj) => {
  return await dbManager.insert('room', roomObj);
}

roomLib.getCustomRoom = async (type) => {
  return await dbManager.doExecuteRawQuery('room', 'SELECT * FROM room WHERE type = ?', [type]);
}

module.exports = roomLib;