const [userMongoLib] = AutoLoad.loadLibray('mongoLib', ['user']);
const [userRedisLib] = AutoLoad.loadLibray('redisLib', ['room']);
const [userSqlLib] = AutoLoad.loadLibray('sqlLib', ['user']);
class userHelperLib {
  helperFunction() {
     await userMongoLib.getUserDetails({user_id : 1});
     await userRedisLib.getuser(1);
     await userSqlLib.getUserDetails({user_id : 1});
  }
}

module.exports = userHelperLib;