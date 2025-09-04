import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

/**
 * 原始定义节点
 * @param title
 */
export class RawDefineNode extends LGraphNode {
  value_widget: any;
  properties: any;
  widgetType: RawDefineNodeTypeEnum;
  title: string;

  constructor(title: string = "原始定义节点", options: NodeParams) {
    super(title);
    this.properties = Object.assign(
      { precision: 0, value: 0, step: 10 },
      options
    );

    let widgetType: string;
    switch (options?.widgetType) {
      case RawDefineNodeTypeEnum.Boolean:
        widgetType = "toggle";
        this.properties.value = false;
        break;
      default:
        widgetType = "number";
        this.properties.value = 0;
    }

    this.value_widget = this.addWidget(
      widgetType,
      "当前值",
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
  Boolean = "boolean",
  String = "string",
  Number = "number",
}

export class RawBooleanDefineNode extends RawDefineNode {
  constructor(title: string = "布尔定义节点", options: NodeParams) {
    super(title, {
      ...options,
      widgetType: RawDefineNodeTypeEnum.Boolean,
    });
  }
}
export class RawStringDefineNode extends RawDefineNode {
  constructor(title: string = "字符串定义节点", options: NodeParams) {
    super(title, {
      ...options,
      widgetType: RawDefineNodeTypeEnum.String,
    });
  }
}

//Constant
export class ConstantNumber extends LGraphNode {
  static title = "数字定义节点";
  static desc = "数字定义节点";
  
  widget: any;
  widgets_up: boolean;
  size: [number, number];

  constructor() {
    super("数字定义节点");
    this.addOutput("value", "number");
    this.addProperty("value", 1.0);
    this.widget = this.addWidget("number", "value", 1, "value");
    this.widgets_up = true;
    this.size = [180, 30];
  }

  onExecute() {
    this.setOutputData(0, parseFloat(this.properties["value"]));
  }

  getTitle() {
    if (this.flags.collapsed) {
      return this.properties.value;
    }
    return this.title;
  }

  setValue(v: any) {
    this.setProperty("value", v);
  }

  onDrawBackground(ctx: any) {
    this.outputs[0].label = this.properties["value"].toFixed(3);
  }
}


export class ConstantBoolean extends LGraphNode {
  static title = "布尔定义节点";
  static desc = "布尔定义节点";
  
  widget: any;
  serialize_widgets: boolean;
  widgets_up: boolean;
  size: [number, number];

  constructor() {
    super("布尔定义节点");
    this.addOutput("bool", "boolean");
    this.addProperty("value", true);
    this.widget = this.addWidget("toggle", "value", true, "value");
    this.serialize_widgets = true;
    this.widgets_up = true;
    this.size = [140, 30];
  }

  getTitle() {
    if (this.flags.collapsed) {
      return this.properties.value;
    }
    return this.title;
  }

  onExecute() {
    this.setOutputData(0, this.properties["value"]);
  }

  setValue(v: any) {
    this.setProperty("value", v);
  }

  onGetInputs() {
    return [["toggle", LiteGraph.ACTION]];
  }

  onAction(action: any) {
    this.setValue(!this.properties.value);
  }
}


export class ConstantString extends LGraphNode {
  static title = "字符串定义节点";
  static desc = "字符串定义节点";
  
  widget: any;
  widgets_up: boolean;
  size: [number, number];

  constructor() {
    super("字符串定义节点");
    this.addOutput("string", "string");
    this.addProperty("value", "");
    this.widget = this.addWidget("text", "value", "", "value");
    this.widgets_up = true;
    this.size = [180, 30];
  }

  getTitle() {
    if (this.flags.collapsed) {
      return this.properties.value;
    }
    return this.title;
  }

  onExecute() {
    this.setOutputData(0, this.properties["value"]);
  }

  setValue(v: any) {
    this.setProperty("value", v);
  }

  onDropFile(file: any) {
    var that = this;
    var reader = new FileReader();
    reader.onload = function (e: any) {
      that.setProperty("value", e.target.result);
    };
    reader.readAsText(file);
  }
}

LiteGraph.registerNodeType("basic/string", ConstantString);
LiteGraph.registerNodeType("basic/boolean", ConstantBoolean);
LiteGraph.registerNodeType("basic/const", ConstantNumber);


// //register in the system
LiteGraph.registerNodeType("basic/raw", RawDefineNode, "数字定义节点");
LiteGraph.registerNodeType(
  "basic/raw_bool",
  RawBooleanDefineNode,
  "布尔定义节点"
);