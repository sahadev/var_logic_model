
// import "litegraph/css/litegraph.css";
import "./nodes/RawDefineNode";
import "./nodes/EqualAssertNode";
import "./nodes/AndOperateNode";
import "./nodes/OrOperateNode";
import "./nodes/OutputNode";
import { LiteGraph } from "../LiteGraph/LiteGraph";
import { LGraph } from "../LiteGraph/LGraph";
import { OutputNode } from "./nodes/OutputNode";
import { EqualAssertNode } from "./nodes/EqualAssertNode";
import { RawDefineNode } from "./nodes/RawDefineNode";
import { LGraphCanvas } from "src/litegraph";
import { AndOperateNode } from "./nodes/AndOperateNode";
import { OrOperateNode } from "./nodes/OrOperateNode";

// 网格大小
const GRID_WIDTH = 300;
const GRID_HEIGHT = 200;

// 构建坐标表格
const x_num: number = 10,
    y_num: number = 20;

// 起始坐标偏移量
const x_offset: number = 50;

const gridStartPostion = [];

// x不动y先动，按列构建
for (let i = 0; i < x_num; i++) {
    const rowPosition = [];
    for (let j = 0; j < y_num; j++) {
        rowPosition.push([x_offset + i * GRID_WIDTH, x_offset + j * GRID_HEIGHT]);
    }
    gridStartPostion.push(rowPosition);
}

export type NodeParams = {
    position: number; // 所处的位置顺序
    title: string; // 节点的标题
    value?: any; // 节点的值，可变更的值。
    widgetType?: any; // 节点控件的类型
    column?: number; // 节点所在列
}

class Graph {
    graph: LGraph;

    constructor() {
        this.graph = new LGraph();
        const canvas = new LGraphCanvas("#mycanvas", this.graph);
        canvas.resize(window.innerWidth, window.innerHeight);
    }

    start() {
        this.graph.start(200); // 控制真正的渲染间隔
    }

    stop() {
        this.graph.stop(); // 控制真正的渲染间隔
    }

    /**
     * 原始定义节点
     * @param params 
     * @returns 
     */
    addRawNode(params: NodeParams): RawDefineNode {
        const output = LiteGraph.createNode("basic/raw", params.title, {
            ...params
        });
        output.pos = gridStartPostion[params.column || 0][params.position];
        this.graph.add(output);
        return output;
    }

    /**
     * 断言节点
     * @param params 
     * @returns 
     */
    addEqualNode(params: NodeParams): EqualAssertNode {
        const output = LiteGraph.createNode("basic/equal", params.title, {
            expression: params.value,
            ...params
        });
        output.pos = gridStartPostion[params.column || 1][params.position];
        this.graph.add(output);
        return output;
    }

    /**
     * 与操作节点
     * @param params 
     * @returns 
     */
    addAndNode(params: NodeParams): AndOperateNode {
        const output = LiteGraph.createNode("basic/and", params.title, {
            ...params
        });

        output.pos = gridStartPostion[2][params.position];

        this.graph.add(output);
        return output;
    }


    /**
     * 或操作节点
     * @param params 
     * @returns 
     */
    addOrNode(params: NodeParams): OrOperateNode {
        const output = LiteGraph.createNode("basic/or", params.title, {
            ...params
        });

        output.pos = gridStartPostion[4][params.position];

        this.graph.add(output);
        return output;
    }

    /**
     * 末端节点
     * @param params 
     * @returns 
     */
    addOutput(params: NodeParams): OutputNode {
        const output = LiteGraph.createNode("basic/output", params.title, {
            ...params
        });

        output.pos = gridStartPostion[7][params.position];

        this.graph.add(output);
        return output;
    }

}

let graphInstance: Graph | null = null;

export const getInstance = () => {
    if (!graphInstance) {
        graphInstance = new Graph();
    }
    return graphInstance;
};
