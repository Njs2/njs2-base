
class <method-name>Action extends baseAction {

  async executeMethod() {
    let { inpVals } = this;
    try {
      
    } catch (e) {
      console.log(`Error: ${<method-name>}`, e);
    }
    this.setResponse('SUCCESS');
    return {};
  };

}
module.exports = <method-name>Action;