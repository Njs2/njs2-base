const dbManager = require("njs2-base/package/dbManager.js").dbManager;

let roomUserLib = [];
roomUserLib.getroomUserDetails = async (roomUserId) => {
  return await dbManager.find('roomUser', { roomUserId: roomUserId, status: 2 })[0];
}

roomUserLib.getroomUserList = async (query) => {
  return await dbManager.find('roomUser', query);
}

roomUserLib.updateroomUsers = async (query, updates) => {
  return await dbManager.update('roomUser', query, updates);
}

module.exports = roomUserLib;