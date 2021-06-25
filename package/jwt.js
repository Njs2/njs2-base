const jwt = require('jsonwebtoken');

const jwtHelper = {};

jwtHelper.createJwtToken = async (userId, JWT_SECRET, expiresIn) => jwt.sign(userId, JWT_SECRET, expiresIn ? { expiresIn: expiresIn } : {});

jwtHelper.decodeJwtToken = async (token, JWT_SECRET) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {

  }
};

module.exports = jwtHelper;