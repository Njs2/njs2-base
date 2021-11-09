let userModel;
const initUserModel = async () => {
  try {
    if (userModel) return userModel;

    let userStructure = {
      user_id: {
        type: Number,
      },
      user_name: {
        type: Number,
      },
    };

    let userScehma = await MONGOManager.createSchema(userStructure);
    await MONGOManager.createIndex(userScehma, { user_id: 1 }, "USERID");
    userModel = await MONGOManager.createModel("user", userScehma, "user");

    return userModel;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = {
    initUserModel,
};
