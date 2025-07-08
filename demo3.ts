export class AndOperateNode {
  onExecute() {
    let inputResultArray = [];

    for (let index = 0; index < 5; index++) {
      if (this.getInputData(index) || this.getInputData(index) == false) {
        inputResultArray.push(this.getInputData(index));
      }
    }

    let equaltion = "";
    if (inputResultArray.length > 0) {
      equaltion = inputResultArray.join("&&");
    } else {
      equaltion = "false";
    }

    this._value = new Function(`return ${equaltion}`)();

    this.value_widget.value = `computed:${this._value || 0}`;
    this.calculateResult = this._value || false;
    this.setOutputData(0, this._value);
  }
}