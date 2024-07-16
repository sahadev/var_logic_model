import { LGraphNode, LiteGraph } from "src/litegraph";

//node constructor class
class OutputNode extends LGraphNode {
    value_widget: any;

    constructor() {
        super('Output String')
        this.addInput("Number Input", 'number');
        this.addInput("String Input", 'string');
        this.addInput("Boolean Input", 'boolean');

        let properties = { value: 1, disabled: true };
        this.value_widget = this.addWidget(
            "string",
            "Value",
            properties.value,
            (v) => {
            },
            properties
        );

        // 这种组件需要用这种方式设置禁止操作
        // this.value_widget.disabled = true;


    }
    onExecute = function () {
        // 从输入端取到的值是没有延迟的
        this._value = this.getInputData(0) || this.getInputData(1) || this.getInputData(2);

        this.value_widget.value = `computed:${this._value || 0}`;
        this.calculateResult = this._value || false;
    }
}

//register in the system
LiteGraph.registerNodeType("basic/output", OutputNode);
