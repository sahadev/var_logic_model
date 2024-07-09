// eslint-disable
// @ts-nocheck
import { LGraph, LGraphCanvas, LiteGraph } from "litegraph";
import 'litegraph/css/litegraph.css'
import './nodes/AddNode';
import './nodes/OutputNode';

class Graph {
    graph: LGraph;

    constructor() {

        this.graph = new LGraph();
        const canvas = new LGraphCanvas("#mycanvas", this.graph);
        canvas.resize(1200, 1000)
        this.graph.start(1000);
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

        console.info(`input`, input.name_widget)

        input.name_widget.value = 'PackageLevel';
        input.value_widget.value = 2;

        input.pos = [200, 450];
        this.graph.add(input);
        return input;
    }

    addOutput() {
        const output = LiteGraph.createNode('basic/output');
        output.pos = [800, 450]

        this.graph.add(output);
        return output;
    }

}

let graphInstance: Graph | null = null;

export const getInstance = () => {
    if (!graphInstance) {
        graphInstance = new Graph()
    }
    return graphInstance;
};