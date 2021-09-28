
class <method-name>Action extends baseAction {

  async executeMethod() {
    let { inpVals } = this;
    
    this.setResponse('SUCCESS');
    return {};
  };

}
module.exports = <method-name>Action;