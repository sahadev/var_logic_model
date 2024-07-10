// @ts-nocheck
import { LiteGraph } from "litegraph";

/**
 * 等式断言节点
 * @param title 
 */
function EqualAssertNode(title: string) {
    this._ctor("等式断言节点");
    this.properties = { value: "input > 0" };
    this.value_widget = this.addWidget(
        "string",
        title,
        this.properties.value,
        (v: any) => {
            this.setProperty("value", v);
            this.setOutputData(0, v);
        },
        this.properties
    );
    this.result_widget = this.addWidget(
        "string",
        '计算结果',
        false,
        (v: any) => {
        },
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
    const equaltion = this.properties.value.replace('input', this._value);
    const calcResult = (new Function(`return ${equaltion}`))()
    // 应该是定时执行的时候需要从这里取值
    this.setOutputData(0, calcResult);
    this.result_widget.value = calcResult;
};

//register in the system
LiteGraph.registerNodeType("build/equal", EqualAssertNode);
