import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

/**
 * 原始定义节点
 * @param title 
 */
export class RawDefineNode extends LGraphNode {
    value_widget: any;
    properties: any;
    widgetType: RawDefineNodeTypeEnum

    constructor(title: string, options: NodeParams) {
        super(title);
        this.properties = { precision: 0, value: options.value, step: 10 };

        let widgetType: string;
        switch (options.widgetType) {
            case RawDefineNodeTypeEnum.Boolean:
                widgetType = 'toggle';
                break;
            default:
                widgetType = 'number';

        }

        this.value_widget = this.addWidget(
            widgetType,
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
    onExecute = function () {
        // 应该是定时执行的时候需要从这里取值
        this.setOutputData(0, this.properties.value);
    };
}

export enum RawDefineNodeTypeEnum {
    Boolean = 'boolean', String = 'string', Number = 'number',
};

//register in the system
LiteGraph.registerNodeType("build/raw", RawDefineNode);
