// @ts-ignore
// @ts-nocheck
import { LiteGraph } from "src/litegraph";

/**
 * 等式断言节点
 * @param title 表达式含义
 */
function EqualAssertNode(title: string) {
    this._ctor(title || "等式断言节点");
    this.properties = { value: "input > 0" };

    // 表达式输入框，可以修改表达式的值
    this.value_widget = this.addWidget(
        "string",
        "表达式",
        this.properties.value,
        (v: any) => {
            this.setProperty("value", v);
        },
        this.properties
    );
    
    // 计算结果展示框，可以修改标题
    this.result_widget = this.addWidget(
        "string",
        title,
        false,
        (v: any) => {
            // 修改标题
            // this.setProperty("title", v); // 设置控件的属性，这里是title的属性。如果控件有title的属性，则会更新title这个属性
            this.result_widget.name = v;
            this.title = v;
        },
        {
            modifyName: true,
            title: '' // 申明了title后，才能通过setProperty修改这个属性的值
        }
    );

    // 外部输入节点
    this.addInput("Number", "number");
    this.addInput("String", "string");
    this.addInput("Boolean", "boolean");
    this.addOutput("输出节点", "boolean");
}

//function to call when the node is executed
EqualAssertNode.prototype.onExecute = function () {
    this._value = this.getInputData(0);

    const expression = this.expression || this.properties.value;

    const equaltion = expression.replace('input', this._value);
    const calcResult = (new Function(`return ${equaltion}`))()
    // 应该是定时执行的时候需要从这里取值
    this.setOutputData(0, calcResult);
    this.result_widget.value = calcResult;
    this.value_widget.value = expression;
};

//register in the system
LiteGraph.registerNodeType("build/equal", EqualAssertNode);
