import { Button, Card, Group, NumberInput, Select, Stack, Text, Modal, Table, Progress, Badge } from "@mantine/core";
import { useState, useCallback, useEffect, useRef } from "react";
import { NodeGenerator } from "../utils/NodeGenerator";
import { PerformanceMonitor, PerformanceMetrics, PerformanceStats } from "../utils/PerformanceMonitor";
import { getInstance } from "../extends/Graph";
import { notifications } from "@mantine/notifications";

export const PerformanceTest = () => {
  const [nodeCount, setNodeCount] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics | null>(null);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [statsModalOpened, setStatsModalOpened] = useState(false);
  const [largeDataTestResult, setLargeDataTestResult] = useState<{ success: boolean; loadTime: number; error?: string } | null>(null);

  const generatorRef = useRef(new NodeGenerator());
  const monitorRef = useRef(new PerformanceMonitor());
  const graphInstance = getInstance();

  // 更新统计信息
  const updateStats = useCallback(() => {
    const currentStats = monitorRef.current.getStats();
    setStats(currentStats);
  }, []);

  // 开始监控
  const startMonitoring = useCallback(() => {
    monitorRef.current.start(
      (metrics) => {
        setCurrentMetrics(metrics);
        updateStats();
      },
      (error) => {
        notifications.show({
          title: "崩溃检测",
          message: `检测到错误: ${error.message}`,
          color: "red",
        });
      }
    );
    setIsMonitoring(true);
  }, [updateStats]);

  // 停止监控
  const stopMonitoring = useCallback(() => {
    monitorRef.current.stop();
    setIsMonitoring(false);
    updateStats();
  }, [updateStats]);

  // 生成节点
  const generateNodes = useCallback(async (count: number) => {
    setIsGenerating(true);
    
    try {
      // 清空现有节点
      generatorRef.current.clearAllNodes();
      
      // 开始监控
      if (!isMonitoring) {
        startMonitoring();
      }

      const startTime = performance.now();
      
      // 生成节点
      const result = await generatorRef.current.generateChainNodes(count, {
        nodeTitlePrefix: "测试节点",
        spacing: [250, 150]
      });

      const totalTime = performance.now() - startTime;

      // 记录渲染
      monitorRef.current.recordRender(result.nodes.length, result.links);

      const message = `成功生成 ${result.nodes.length} 个节点，${result.links} 个连接，耗时 ${result.generationTime.toFixed(2)}ms`;

      notifications.show({
        title: "生成完成",
        message: message,
        color: "green",
      });

      console.log(message);

      // 更新统计信息
      updateStats();

      // 自动开始图形执行
      graphInstance.start();
    } catch (error) {
      notifications.show({
        title: "生成失败",
        message: (error as Error).message,
        color: "red",
      });
      console.error((error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  }, [isMonitoring, startMonitoring, updateStats]);

  // 快速生成预设数量
  const quickGenerate = useCallback((count: number) => {
    setNodeCount(count);
    generateNodes(count);
  }, [generateNodes]);

  // 测试大文件加载
  const testLargeDataLoad = useCallback(async (sizeMB: number = 1) => {
    try {
      const result = await monitorRef.current.testLargeDataLoad(sizeMB);
      setLargeDataTestResult(result);
      
      if (result.success) {
        notifications.show({
          title: "大文件加载测试",
          message: `成功加载 ${sizeMB}MB 数据，耗时 ${result.loadTime.toFixed(2)}ms`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "大文件加载测试",
          message: `加载失败: ${result.error}`,
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "测试失败",
        message: (error as Error).message,
        color: "red",
      });
    }
  }, []);

  // 清空所有数据
  const clearAll = useCallback(() => {
    generatorRef.current.clearAllNodes();
    monitorRef.current.clear();
    setCurrentMetrics(null);
    setStats(null);
    graphInstance.stop();
    notifications.show({
      title: "已清空",
      message: "所有节点和监控数据已清空",
    });
  }, []);

  // 组件卸载时停止监控
  useEffect(() => {
    return () => {
      monitorRef.current.stop();
    };
  }, []);

  // 定期更新统计信息
  useEffect(() => {

    const interval = setInterval(() => {
      updateStats();
      
      // 记录当前节点和连接数
      const nodeCount = generatorRef.current.getNodeCount();
      const linkCount = generatorRef.current.getLinkCount();
      if (nodeCount > 0) {
        monitorRef.current.recordRender(nodeCount, linkCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring, updateStats]);

  return (
    <div className="fixed top-5 left-5 z-50 w-96">
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text size="lg" fw={700}>性能测试工具</Text>

          {/* 快速生成按钮 */}
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              color="blue"
              onClick={() => quickGenerate(100)}
              disabled={isGenerating}
            >
              100节点
            </Button>
            <Button
              size="xs"
              variant="light"
              color="green"
              onClick={() => quickGenerate(1000)}
              disabled={isGenerating}
            >
              1000节点
            </Button>
            <Button
              size="xs"
              variant="light"
              color="orange"
              onClick={() => quickGenerate(10000)}
              disabled={isGenerating}
            >
              10000节点
            </Button>
          </Group>

          {/* 自定义生成 */}
          <Group gap="xs" align="flex-end">
            <NumberInput
              label="节点数量"
              value={nodeCount}
              onChange={(value) => setNodeCount(Number(value) || 100)}
              min={1}
              max={100000}
              style={{ flex: 1 }}
            />
            <Button
              onClick={() => generateNodes(nodeCount)}
              disabled={isGenerating}
              loading={isGenerating}
            >
              生成
            </Button>
          </Group>

          {/* 监控控制 */}
          <Group gap="xs">
            <Button
              size="sm"
              variant={isMonitoring ? "filled" : "outline"}
              color={isMonitoring ? "red" : "green"}
              onClick={() => isMonitoring ? stopMonitoring() : startMonitoring()}
            >
              {isMonitoring ? "停止监控" : "开始监控"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setStatsModalOpened(true)}
              disabled={!stats}
            >
              查看统计
            </Button>
            <Button
              size="sm"
              variant="outline"
              color="red"
              onClick={clearAll}
            >
              清空
            </Button>
          </Group>

          {/* 当前指标显示 */}
          {currentMetrics && (
            <Card padding="sm" radius="sm" withBorder>
              <Stack gap="xs">
                <Text size="sm" fw={600}>实时指标</Text>
                <Group gap="xs" justify="space-between">
                  <Text size="xs">节点数: <Badge size="sm">{currentMetrics.nodeCount}</Badge></Text>
                  <Text size="xs">连接数: <Badge size="sm">{currentMetrics.linkCount}</Badge></Text>
                </Group>
                <Group gap="xs" justify="space-between">
                  <Text size="xs">FPS: <Badge color={currentMetrics.fps < 30 ? "red" : currentMetrics.fps < 50 ? "yellow" : "green"}>{currentMetrics.fps}</Badge></Text>
                  <Text size="xs">渲染时间: <Badge>{currentMetrics.renderTime.toFixed(2)}ms</Badge></Text>
                </Group>
                <Group gap="xs" justify="space-between">
                  <Text size="xs">内存: <Badge>{currentMetrics.memoryUsage}MB</Badge></Text>
                  <Text size="xs">CPU: <Badge>{currentMetrics.cpuUsage}%</Badge></Text>
                </Group>
              </Stack>
            </Card>
          )}

          {/* 大文件加载测试 */}
          <Group gap="xs">
            <Button
              size="sm"
              variant="outline"
              onClick={() => testLargeDataLoad(1)}
            >
              测试1MB加载
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => testLargeDataLoad(5)}
            >
              测试5MB加载
            </Button>
          </Group>

          {largeDataTestResult && (
            <Card padding="sm" radius="sm" withBorder>
              <Text size="xs" fw={600}>大文件测试结果</Text>
              <Group gap="xs" mt="xs">
                <Badge color={largeDataTestResult.success ? "green" : "red"}>
                  {largeDataTestResult.success ? "成功" : "失败"}
                </Badge>
                <Text size="xs">耗时: {largeDataTestResult.loadTime.toFixed(2)}ms</Text>
                {largeDataTestResult.error && (
                  <Text size="xs" c="red">{largeDataTestResult.error}</Text>
                )}
              </Group>
            </Card>
          )}
        </Stack>
      </Card>

      {/* 统计信息模态框 */}
      <Modal
        opened={statsModalOpened}
        onClose={() => setStatsModalOpened(false)}
        title="性能统计信息"
        size="lg"
        centered
      >
        {stats && (
          <Stack gap="md">
            <Table>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td fw={600}>平均渲染时间</Table.Td>
                  <Table.Td>{stats.avgRenderTime.toFixed(2)}ms</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>最大渲染时间</Table.Td>
                  <Table.Td>{stats.maxRenderTime.toFixed(2)}ms</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>最小渲染时间</Table.Td>
                  <Table.Td>{stats.minRenderTime.toFixed(2)}ms</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>平均FPS</Table.Td>
                  <Table.Td>{stats.avgFPS.toFixed(2)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>最低FPS</Table.Td>
                  <Table.Td>{stats.minFPS.toFixed(2)}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>平均内存使用</Table.Td>
                  <Table.Td>{stats.avgMemoryUsage.toFixed(2)}MB</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>最大内存使用</Table.Td>
                  <Table.Td>{stats.maxMemoryUsage.toFixed(2)}MB</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>平均CPU使用率</Table.Td>
                  <Table.Td>{stats.avgCPUUsage.toFixed(2)}%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>最大CPU使用率</Table.Td>
                  <Table.Td>{stats.maxCPUUsage.toFixed(2)}%</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>崩溃次数</Table.Td>
                  <Table.Td>
                    <Badge color={stats.crashCount > 0 ? "red" : "green"}>
                      {stats.crashCount}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td fw={600}>采样总数</Table.Td>
                  <Table.Td>{stats.totalSamples}</Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Stack>
        )}
      </Modal>
    </div>
  );
};

