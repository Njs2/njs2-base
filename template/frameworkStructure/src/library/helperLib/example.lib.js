class exampleHelperLib {  

  /*
      To call this function in any action class use below statement :
      let exampleHelper = AutoLoad.loadLibray("helperLib",["exampleHelper"]);
      exampleHelper.getServerTime()
   */
  
  getServerTime() {
    return new Date();
     
  }
}

module.exports = exampleHelperLib;