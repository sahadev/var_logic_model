// eslint-disable
// @ts-nocheck
import { LGraph, LGraphCanvas, LiteGraph } from "litegraph";
import "litegraph/css/litegraph.css";
import "./nodes/AddNode";
import "./nodes/OutputNode";
import "./nodes/RawDefineNode";
import "./nodes/EqualAssertNode";

// 网格大小
const GRID_WIDTH = 300;
const GRID_HEIGHT = 200;

// 构建坐标表格
const x_num: number = 10,
    y_num: number = 6;

// 起始坐标偏移量
const x_offset: number = 100;

const gridStartPostion = [];

// x不动y先动，按列构建
for (let i = 0; i < x_num; i++) {
    const rowPosition = [];
    for (let j = 0; j < y_num; j++) {
        rowPosition.push([x_offset + i * GRID_WIDTH, x_offset + j * GRID_HEIGHT]);
    }
    gridStartPostion.push(rowPosition);
}


class Graph {
    graph: LGraph;

    constructor() {
        this.graph = new LGraph();
        const canvas = new LGraphCanvas("#mycanvas", this.graph);
        canvas.resize(window.innerWidth, window.innerHeight);
        this.graph.start(200); // 控制真正的渲染间隔
    }

    addNode() {
        const node_const = LiteGraph.createNode("basic/const");
        node_const.pos = [200, 200];
        this.graph.add(node_const);

        // @ts-ignore
        node_const.setValue(5.5);
        return node_const;
    }

    addWatchNode() {
        const node_watch = LiteGraph.createNode("basic/watch");
        node_watch.pos = [700, 200];
        this.graph.add(node_watch);
        return node_watch;
    }

    addAddNode() {
        const addNode = LiteGraph.createNode("basic/sum");
        addNode.pos = [550, 450];
        this.graph.add(addNode);
        return addNode;
    }

    addInput() {
        const input = LiteGraph.createNode("graph/input");

        input.name_widget.value = "PackageLevel";
        input.value_widget.value = 2;

        input.pos = [200, 450];
        this.graph.add(input);
        return input;
    }

    addConstInput() {
        const input = LiteGraph.createNode("basic/const");
        input.pos = [200, 450];
        this.graph.add(input);
        return input;
    }

    addRawNode(index: number = 0) {
        const output = LiteGraph.createNode("build/raw", "packageLevel");
        output.pos = gridStartPostion[0][index];
        this.graph.add(output);
        return output;
    }

    addEqualNode(index: number = 0) {
        const output = LiteGraph.createNode("build/equal", "表达式");
        output.pos = gridStartPostion[1][index];
        this.graph.add(output);
        return output;
    }

    addOutput(index: number = 0) {
        const output = LiteGraph.createNode("basic/output");

        output.pos = gridStartPostion[2][index];

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
