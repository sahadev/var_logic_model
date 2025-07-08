export class EqualAssertNode {
  onExecute() {
    const expression = this.options.expression;

    let equaltion = expression;

    equaltion = this.replace(equaltion, "input2", this.getInputData(1));
    equaltion = this.replace(equaltion, "input3", this.getInputData(2));

    equaltion = equaltion.replace("input", `${this.getInputData(0)}`);

    const calcResult = new Function(`return ${equaltion}`)();
    this.updateResult(calcResult);
    this.exp_widget.value = expression;
  }

  replace(equaltion: string, inputHolder: string, inputValue: any): string {
    if (inputValue || inputValue === 0 || !inputValue) {
      equaltion = equaltion.replace(inputHolder, `${inputValue}`);
    }
    return equaltion;
  }

  updateResult(result: any) {
    this.setOutputData(0, result);
    this.result_widget.value = result;
    this.calculateResult = result;
  }
}
