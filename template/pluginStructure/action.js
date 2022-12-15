
class <method-name>Action extends baseAction {

  async executeMethod() {
    try {
      let res;
      const <method-name>Pkg = this.loadPkg("<lib-name>");
      res = await <method-name>Pkg.execute(this);

      this.setResponse(res.code, [], "<lib-name>");
      return res.data;
    } catch (e) {
      console.log("Error: <method-name>", e);
    }
  };

}
module.exports = <method-name>Action;