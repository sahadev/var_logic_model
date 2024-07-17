import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

const INPUT_NUMBER = 5;
/**
 * 与操作节点
 * 
 * 可以将多个输入合并
 */
export class AndOperateNode extends LGraphNode {
    value_widget: any;
    inputNumber: 5;

    constructor(title: string, options: NodeParams) {
        super(title)

        for (let index = 0; index < INPUT_NUMBER; index++) {
            this.addInput('input', 'string');
        }

        let properties = { value: false, disabled: true };

        this.value_widget = this.addWidget(
            'string',
            title,
            properties.value,
            (v) => {
            },
            properties
        );

    }
    onExecute = function () {
        // 从输入端取到的值是没有延迟的
        let inputResultArray = [];

        // 先把有输入的值放进去
        for (let index = 0; index < INPUT_NUMBER; index++) {
            // 输入了false
            if (this.getInputData(index) || this.getInputData(index) == false) {
                inputResultArray.push(this.getInputData(index))
            }
        }

        let equaltion = '';
        if (inputResultArray.length > 0) {
            equaltion = inputResultArray.join('&&');
        } else {
            equaltion = 'false';
        }

        this._value = (new Function(`return ${equaltion}`))()

        this.value_widget.value = `computed:${this._value || 0}`;
        this.calculateResult = this._value || false;
    }
}

debugger
//register in the system
LiteGraph.registerNodeType("basic/and", AndOperateNode);
