/**
 * 节点生成工具
 * 用于快速生成指定数量的节点并串联
 */

import { getInstance } from "../extends/Graph";
import { LGraphNode, LiteGraph } from "../litegraph";

export interface GenerateOptions {
  nodeCount: number; // 节点数量
  nodeType?: string; // 节点类型，默认为 "basic/raw"
  startPosition?: [number, number]; // 起始位置 [x, y]
  spacing?: [number, number]; // 节点间距 [x, y]
  connectNodes?: boolean; // 是否串联节点，默认 true
  nodeTitlePrefix?: string; // 节点标题前缀
  column?: number; // 节点所在列（用于网格布局）
}

export interface GenerationResult {
  nodes: LGraphNode[];
  links: number; // 连接数量
  generationTime: number; // 生成时间 (ms)
  dataSize: number; // 生成的数据大小 (bytes)
}

export class NodeGenerator {
  private graph = getInstance().graph;

  /**
   * 生成指定数量的节点并串联
   */
  async generateNodes(options: GenerateOptions): Promise<GenerationResult> {
    const startTime = performance.now();
    
    const {
      nodeCount,
      nodeType = "basic/passthrough", // 默认使用传递节点，支持输入输出
      startPosition = [50, 50],
      spacing = [300, 200],
      connectNodes = true,
      nodeTitlePrefix = "节点",
      column = 0
    } = options;

    // 清空现有节点（可选）
    // this.clearAllNodes();

    const nodes: LGraphNode[] = [];
    let links = 0;

    // 批量创建节点
    for (let i = 0; i < nodeCount; i++) {
      // 第一个节点如果是 raw 类型（只有输出），后续节点使用 passthrough（有输入输出）
      const actualNodeType = (i === 0 && nodeType === "basic/raw") 
        ? "basic/raw" 
        : (i === 0 && nodeType === "basic/passthrough")
        ? "basic/passthrough"
        : (i > 0 && nodeType === "basic/raw")
        ? "basic/passthrough" // 后续节点使用 passthrough 以便连接
        : nodeType;
      
      const node = LiteGraph.createNode(actualNodeType, `${nodeTitlePrefix} ${i + 1}`, {
        position: i,
        column: column,
        value: Math.random() * 100
      });

      if (!node) {
        console.warn(`无法创建节点 ${i + 1}`);
        continue;
      }

      // 设置节点位置
      const x = startPosition[0] + (i % 10) * spacing[0];
      const y = startPosition[1] + Math.floor(i / 10) * spacing[1];
      node.pos = [x, y];

      // 添加到图形
      this.graph.add(node);
      nodes.push(node);

      // 串联节点：将当前节点的输出连接到下一个节点的输入
      if (connectNodes && i > 0 && nodes.length > 1) {
        const prevNode = nodes[i - 1];
        
        // 检查节点是否有输出和输入
        if (prevNode.outputs && prevNode.outputs.length > 0 && 
            node.inputs && node.inputs.length > 0) {
          try {
            prevNode.connect(0, node, 0);
            links++;
          } catch (error) {
            console.warn(`连接节点失败: ${i} -> ${i + 1}`, error);
          }
        }
      }
    }

    const generationTime = performance.now() - startTime;

    // 计算数据大小
    // const serializedData = this.graph.serialize();
    // const dataSize = new Blob([JSON.stringify(serializedData)]).size;

    return {
      nodes,
      links,
      generationTime: Math.round(generationTime * 100) / 100,
      dataSize: 0
    };
  }

  /**
   * 生成链式连接的节点（每个节点只有一个输入和一个输出）
   */
  async generateChainNodes(nodeCount: number, options?: Partial<GenerateOptions>): Promise<GenerationResult> {
    return this.generateNodes({
      nodeCount,
      connectNodes: true,
      ...options
    });
  }

  /**
   * 生成树形结构的节点
   */
  async generateTreeNodes(nodeCount: number, branchFactor: number = 2, options?: Partial<GenerateOptions>): Promise<GenerationResult> {
    const startTime = performance.now();
    const {
      nodeType = "basic/raw",
      startPosition = [50, 50],
      spacing = [300, 200],
      nodeTitlePrefix = "节点",
      column = 0
    } = options || {};

    const nodes: LGraphNode[] = [];
    let links = 0;

    // 创建根节点
    const rootNode = LiteGraph.createNode(nodeType, `${nodeTitlePrefix} 0`, {
      position: 0,
      column: column,
      value: Math.random() * 100
    });

    if (rootNode) {
      rootNode.pos = startPosition;
      this.graph.add(rootNode);
      nodes.push(rootNode);
    }

    // 按层级创建节点
    let currentLevel = [rootNode];
    let nodeIndex = 1;
    let level = 0;

    while (nodes.length < nodeCount && currentLevel.length > 0) {
      const nextLevel: LGraphNode[] = [];
      
      for (const parentNode of currentLevel) {
        if (nodes.length >= nodeCount) break;

        // 为每个父节点创建子节点
        for (let i = 0; i < branchFactor && nodes.length < nodeCount; i++) {
          const node = LiteGraph.createNode(nodeType, `${nodeTitlePrefix} ${nodeIndex}`, {
            position: nodeIndex,
            column: column + level + 1,
            value: Math.random() * 100
          });

          if (!node) {
            continue;
          }

          const x = startPosition[0] + (level + 1) * spacing[0];
          const y = startPosition[1] + (nextLevel.length + currentLevel.indexOf(parentNode) * branchFactor) * spacing[1];
          node.pos = [x, y];

          this.graph.add(node);
          nodes.push(node);
          nextLevel.push(node);

          // 连接父节点到子节点
          if (parentNode.outputs && parentNode.outputs.length > 0 && 
              node.inputs && node.inputs.length > 0) {
            try {
              parentNode.connect(0, node, 0);
              links++;
            } catch (error) {
              console.warn(`连接节点失败`, error);
            }
          }

          nodeIndex++;
        }
      }

      currentLevel = nextLevel;
      level++;
    }

    const generationTime = performance.now() - startTime;
    // const serializedData = this.graph.serialize();
    // const dataSize = new Blob([JSON.stringify(serializedData)]).size;

    return {
      nodes,
      links,
      generationTime: Math.round(generationTime * 100) / 100,
      dataSize: 0
    };
  }

  /**
   * 清空所有节点
   */
  clearAllNodes() {
    const nodes = [...this.graph._nodes];
    nodes.forEach(node => {
      this.graph.remove(node);
    });
  }

  /**
   * 获取当前节点数量
   */
  getNodeCount(): number {
    return this.graph._nodes.length;
  }

  /**
   * 获取当前连接数量
   */
  getLinkCount(): number {
    return Object.keys(this.graph.links).length;
  }
}

