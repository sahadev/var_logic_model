import { LGraphNode, LiteGraph } from "src/litegraph";
import { NodeParams } from "../Graph";

export type EqualAssertNodeOptions = NodeParams & {
    expression: string;
}

/**
 * 等式断言节点
 * @param title 表达式含义
 */
export class EqualAssertNode extends LGraphNode {
    exp_widget: any;
    result_widget: any;
    _value: number;
    _value2: number;
    title: string;
    expression: string;
    _value3: any;
    options: EqualAssertNodeOptions

    constructor(title: string, options: EqualAssertNodeOptions) {
        super(title || "等式断言节点");

        this.options = options;
        this.title = title;

        // 表达式输入框，可以修改表达式的值
        this.exp_widget = this.addWidget(
            "string",
            "表达式",
            options.expression,
            (v: any) => {
                this.options.expression = v;
            },
            options
        );

        // 计算结果展示框，可以修改标题
        this.result_widget = this.addWidget(
            "string",
            title,
            false,
            (v: any) => {
                // 修改标题
                // this.setProperty("title", v); // 设置控件的属性，这里是title的属性。如果控件有title的属性，则会更新title这个属性
                this.result_widget.name = v;
                this.title = v;
            },
            {
                modifyName: true,
                title: '' // 申明了title后，才能通过setProperty修改这个属性的值
            }
        );

        // 外部输入节点
        this.addInput("Input 1", "number");
        this.addInput("Input 2", "number");
        this.addOutput("输出节点", "boolean");
    }

    onExecute() {
        this._value = this.getInputData(0);
        this._value2 = this.getInputData(1);

        // expression 来自于外部的options
        const expression = this.options.expression;

        let equaltion = expression;

        if (this._value2 || this._value2 === 0 || !this._value2) {
            equaltion = equaltion.replace('input2', `${this._value2}`);
        }

        // 这一行要在所有的表达式计算之后执行，否则优先匹配input。例如input匹配了input2就会变为2
        equaltion = equaltion.replace('input', `${this._value}`); 
        
        try {
            const calcResult = (new Function(`return ${equaltion}`))()
            // console.info(`this._value2`, this._value2, expression, calcResult)
            // 应该是定时执行的时候需要从这里取值
            this.updateResult(calcResult)
        } catch (error) {
            console.info(`运行错误:`, equaltion)
            this.updateResult(false)
        }
        this.exp_widget.value = expression;
    };

    updateResult(result: any) {
        this.setOutputData(0, result);
        this.result_widget.value = result;
        this.calculateResult = result; // 控制输入线是否高亮
    }
}

//register in the system
LiteGraph.registerNodeType("build/equal", EqualAssertNode);
