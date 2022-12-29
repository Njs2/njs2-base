
class <method-name>Action extends baseAction {

  async executeMethod() {
    
    try {
      let { inpVals } = this; 
      
      
      this.setResponse('SUCCESS');
      return {};
    } catch (e) {
      console.log(`Error: API: <method-name>`, e);
      throw e;
    }
  };

}
module.exports = <method-name>Action;