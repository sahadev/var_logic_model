import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

//node constructor class
export class OutputNode extends LGraphNode {
    value_widget: any;

    constructor(title: string, options: NodeParams) {
        super(title)

        this.addInput('input', 'string');

        let properties = Object.assign({ value: 0, disabled: false }, options);
        this.value_widget = this.addWidget(
            'string',
            title,
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
LiteGraph.registerNodeType("basic/output", OutputNode, '终端节点');
