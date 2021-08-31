const dbManager = require("../../helper/dbManager").dbManager;

const connect = async (accessToken, socketId) => {
  if (!accessToken || typeof accessToken != "string" || accessToken.trim() == "") {
    return { code: 403, body: 'Invalid access_token' };
  }

  const validatedUser = await dbManager.verifyAccessToken(accessToken);
  if (!validatedUser) {
    return { code: 403, body: 'Invalid access_token' };
  }
  await dbManager.update("user", { user_id: validatedUser.user_id }, { socket_id: socketId });
  return { code: 200, body: {}, user: validatedUser };
}

const disconnect = async (socketId) => {
  let user = (await dbManager.find('user', { socket_id: socketId }))[0];
  if (!user) return { code: 400, body: {} };
  await dbManager.update("user", { user_id: user.user_id }, { socket_id: '' });
  return { code: 200, body: {}, user: user };
}

module.exports = {
  connect,
  disconnect
}