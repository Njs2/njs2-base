let testLibObj;
class testLib {
  static getInstance() {
    testLibObj = testLibObj || new testLib();
    return testLibObj;
  }

  testFunction() {
    console.log('testFunction');
  }
}

module.exports = testLib;