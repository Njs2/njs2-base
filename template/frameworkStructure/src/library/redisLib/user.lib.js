
class userRedisLib {
    async createuser(userId, userData) {
        try {
            const user = {
                userId: 1,
                userName: "User1"
            };
            await REDISManager.setKey("user_" + userId, JSON.stringify(user));
            return true;
        } catch (err) {
            console.log(err);
        }
    }

    async getuser(userId) {
        try {
            let user = await REDISManager.getKey("user_" + userId);
            return user;
        } catch (err) {
            console.log(err);
        }
    }

    async deleteuser(userId) {
        try {
            await REDISManager.deleteKey("user_" + userId);
            return true;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = userRedisLib;
