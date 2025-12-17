import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

/**
 * 传递节点 - 用于测试
 * 简单的输入输出传递节点
 */
export class PassThroughNode extends LGraphNode {
  value_widget: any;
  properties: any;

  constructor(title: string = "传递节点", options?: NodeParams) {
    super(title);
    
    this.properties = Object.assign(
      { value: 0 },
      options
    );

    // 添加输入
    this.addInput("输入", "number");
    
    // 添加输出
    this.addOutput("输出", "number");

    // 添加显示控件
    this.value_widget = this.addWidget(
      "number",
      "当前值",
      this.properties.value,
      (v) => {
        this.setProperty("value", v);
      },
      this.properties
    );
  }

  // 执行函数
  onExecute = function () {
    // 从输入获取值，如果没有输入则使用属性值
    const inputValue = this.getInputData(0);
    const value = inputValue !== undefined && inputValue !== null ? inputValue : this.properties.value;
    
    // 设置输出
    this.setOutputData(0, value);
    
    // 更新显示
    if (this.value_widget) {
      this.value_widget.value = value;
    }
  };
}

// 注册节点类型
LiteGraph.registerNodeType("basic/passthrough", PassThroughNode, "传递节点");

