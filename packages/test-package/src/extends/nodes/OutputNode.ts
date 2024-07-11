// @ts-ignore
// @ts-nocheck
import { LiteGraph } from "src/litegraph";

//node constructor class
function OutputNode() {
    this.addInput("Number Input", 'number');
    this.addInput("String Input", 'string');
    this.addInput("Boolean Input", 'boolean');

    this.properties = { value: 1, disabled: true };
    this.value_widget = this.addWidget(
        "string",
        "Value",
        this.properties.value,
        (v) => {
        },
        this.properties
    );

    // 这种组件需要用这种方式设置禁止操作
    // this.value_widget.disabled = true;
}

//name to show
OutputNode.title = "Output String";

//function to call when the node is executed
OutputNode.prototype.onExecute = function () {
    // 从输入端取到的值是没有延迟的
    this._value = this.getInputData(0) || this.getInputData(1) || this.getInputData(2);

    this.value_widget.value = `computed:${this._value || 0}`;
}

//register in the system
LiteGraph.registerNodeType("basic/output", OutputNode);
