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
    title: string;

    constructor(title: string = '原始定义节点', options: NodeParams) {
        super(title);
        this.properties = Object.assign({ precision: 0, value: 0, step: 10 }, options);

        let widgetType: string;
        switch (options?.widgetType) {
            case RawDefineNodeTypeEnum.Boolean:
                widgetType = 'toggle';
                this.properties.value = false;
                break;
            default:
                widgetType = 'number';
                this.properties.value = 0;

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

export class RawBooleanDefineNode extends RawDefineNode {
    constructor(title: string = '布尔定义节点', options: NodeParams) {
        super(title, {
            ...options,
            widgetType: RawDefineNodeTypeEnum.Boolean
        })
    }
}

//register in the system
LiteGraph.registerNodeType("basic/raw", RawDefineNode, '数字定义节点');
LiteGraph.registerNodeType("basic/raw_bool", RawBooleanDefineNode, '布尔定义节点');
