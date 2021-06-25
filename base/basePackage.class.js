/**
 * Abstract class basePkg
 * @class basePkg
 */
class basePkg {
  constructor() {
    if (this.constructor === basePkg) {
      throw new Error("Can't instantiate abstract class!");
    }
  }

  async execute(initParams, optionalParams = {}) {
    throw new Error("Method 'async execute()' must be implemented.");
  }
}

module.exports = basePkg;