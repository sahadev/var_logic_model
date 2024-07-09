// @ts-nocheck
import { LiteGraph } from "litegraph";

//node constructor class
function OutputNode() {
    this.addInput("input", 'number');
    this.properties = { value: 1 };
    this.value_widget = this.addWidget(
        "number",
        "Value",
        this.properties.value,
        function (v) {
            that.setProperty("value", v);
        }
    );
}

//name to show
OutputNode.title = "Output String";

//function to call when the node is executed
OutputNode.prototype.onExecute = function () {
    this._value = this.getInputData(0);

    this.value_widget.value = this._value;
}

//register in the system
LiteGraph.registerNodeType("basic/output", OutputNode);
