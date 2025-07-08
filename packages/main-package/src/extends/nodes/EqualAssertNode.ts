import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

export type EqualAssertNodeOptions = NodeParams & {
  expression: string;
};

/**
 * 等式断言节点
 * @param title 表达式含义
 */
export class EqualAssertNode extends LGraphNode {
  exp_widget: any;
  result_widget: any;
  title: string;
  expression: string;
  options: EqualAssertNodeOptions;
  properties: any;

  constructor(title: string, options: EqualAssertNodeOptions) {
    super(title || "等式断言节点");

    this.properties = this.options = Object.assign(
      {
        expression: "input",
        property: "expression",
      },
      options
    );

    this.title = title;

    // 表达式输入框，可以修改表达式的值
    this.exp_widget = this.addWidget(
      "string",
      "表达式",
      this.options.expression,
      (v: any) => {
        this.options.expression = v;
      },
      this.options
    );

    // 计算结果展示框，可以修改标题
    this.result_widget = this.addWidget(
      "string",
      "运算结果",
      false,
      (v: any) => {
        // 修改标题
        // this.setProperty("title", v); // 设置控件的属性，这里是title的属性。如果控件有title的属性，则会更新title这个属性
        this.result_widget.name = v;
        this.title = v;
      },
      {
        modifyName: true,
        title: "", // 申明了title后，才能通过setProperty修改这个属性的值
      }
    );

    // 外部输入节点
    this.addInput("Input", "number");
    // 保持原子节点的唯一性，不要做太多事情
    this.addInput("Input 2", "number");
    this.addInput("Input 3", "number");
    this.addOutput("Output", "boolean");

  }

  replace(equaltion: string, inputHolder:string, inputValue: any): string {
    if (inputValue || inputValue === 0 || !inputValue) {
      equaltion = equaltion.replace(inputHolder, `${inputValue}`);
    }
    return equaltion;
  }

  onExecute() {

    // expression 来自于外部的options
    const expression = this.options.expression;

    let equaltion = expression;

    equaltion = this.replace(equaltion, "input2", this.getInputData(1));
    equaltion = this.replace(equaltion, "input3", this.getInputData(2));
    equaltion = this.replace(equaltion, "input4", this.getInputData(3));
    equaltion = this.replace(equaltion, "input5", this.getInputData(4));

    // 这一行要在所有的表达式计算之后执行，否则优先匹配input。例如input匹配了input2就会变为2
    equaltion = equaltion.replace("input", `${this.getInputData(0)}`);

    try {
      const calcResult = new Function(`return ${equaltion}`)();
      // 应该是定时执行的时候需要从这里取值
      this.updateResult(calcResult);
    } catch (error) {
      console.info(`运行错误:`, equaltion);
      this.updateResult(false);
    }
    this.exp_widget.value = expression;
  }

  updateResult(result: any) {
    this.setOutputData(0, result);
    this.result_widget.value = result;
    this.calculateResult = result; // 控制输入线是否高亮
  }
}

//register in the system
LiteGraph.registerNodeType("basic/equal", EqualAssertNode, "等式断言节点");
