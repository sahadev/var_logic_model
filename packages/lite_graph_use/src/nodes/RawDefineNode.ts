// @ts-nocheck
import { LiteGraph } from "litegraph";

//node constructor class
function RawDefineNode(title: string) {
    this._ctor("原始数据定义节点");
    this.properties = { precision: 0, value: 1, step: 10 };
    this.value_widget = this.addWidget(
        "number",
        title,
        this.properties.value,
        (v) => {
            this.setProperty("value", v);
            this.setOutputData(0, v);
        },
        this.properties
    );

    // 外部输入节点
    // this.addInput("A", "number");
    this.addOutput("输出节点", "number");
}

//function to call when the node is executed
RawDefineNode.prototype.onExecute = function () {
    // 应该是定时执行的时候需要从这里取值
    this.setOutputData(0, this.properties.value);
};

//register in the system
LiteGraph.registerNodeType("build/raw", RawDefineNode);
