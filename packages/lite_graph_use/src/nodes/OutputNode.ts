// @ts-nocheck
import { LiteGraph } from "litegraph";

//node constructor class
function OutputNode() {
    this.addInput("input", 'number');
    this.properties = { value: 1 };
    this.value_widget = this.addWidget(
        "string",
        "Value",
        this.properties.value,
        (v) => {
        },
        this.properties
    );
}

//name to show
OutputNode.title = "Output String";

//function to call when the node is executed
OutputNode.prototype.onExecute = function () {
    // 从输入端取到的值是没有延迟的
    this._value = this.getInputData(0);
    this.value_widget.value = `computed:${this._value}`;
}

//register in the system
LiteGraph.registerNodeType("basic/output", OutputNode);
