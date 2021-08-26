let constant = [];

constant.USER_TYPE = {
  EMAIL: 1,
  FACEBOOK: 2,
  GUEST: 3,
  APPLE: 4,
  GOOGLE : 5,
  PHONE : 6
}

constant.ACTIVE = 1;
constant.INACTIVE = 2;
constant.BLOCKED = 3;
constant.DELETED = 4;
constant.IN_PROGRESS = 5;
constant.PENDING = 6;

constant.EMAIL_VERIFICATION_MAX_TIME_SECONDS = 10 * 60;

module.exports = constant;