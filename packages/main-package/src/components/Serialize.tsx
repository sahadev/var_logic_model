import { Button, Modal, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCallback, useState } from "react";
import { getInstance } from "src/extends/Graph";
const graphInstance = getInstance();
import { notifications } from "@mantine/notifications";

import { relativeNode } from "../extends/Demo";
import { dbManager } from "../utils/indexedDB";
const CONFIG_SAVE_KEY = "litegrapheditor_clipboard";

/**
 * 提供序列化的入口
 */
export const Serialize = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [importModalOpened, { open: openImportModal, close: closeImportModal }] = useDisclosure(false);
  const [importData, setImportData] = useState("");

  const openTask = () => {
    open();
    graphInstance.start();
  };

  const closeTask = () => {
    close();
    graphInstance.stop();
  };

  const loadConfig = useCallback(async () => {
    const localConfig = localStorage.getItem(CONFIG_SAVE_KEY);
    if (!localConfig) {
      notifications.show({
        title: "错误",
        message: "没有找到保存的数据",
        color: "red",
      });
      return;
    }
    try {
      graphInstance.graph.configure(JSON.parse(localConfig), false);
      notifications.show({
        title: "已加载",
        message: "Loaded",
      });
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "加载数据失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, []);

  const save = useCallback(async () => {
    const serializedData = graphInstance.graph.serialize();
    const dataString = JSON.stringify(serializedData);
    
    // 保存到 localStorage
    localStorage.setItem(CONFIG_SAVE_KEY, dataString);
    
    // 保存到 IndexedDB
    try {
      const timestamp = new Date().toLocaleString("zh-CN");
      const title = `记录 ${timestamp}`;
      await dbManager.addRecord(title, serializedData);
      
      // 刷新数据记录列表
      if ((window as any).refreshDataRecordList) {
        (window as any).refreshDataRecordList();
      }
      
      notifications.show({
        title: "已保存",
        message: "数据已保存到本地存储和记录列表",
      });
    } catch (error) {
      notifications.show({
        title: "警告",
        message: "保存到记录列表失败: " + (error as Error).message,
        color: "yellow",
      });
    }
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      const serializedData = JSON.stringify(graphInstance.graph.serialize(), null, 2);
      await navigator.clipboard.writeText(serializedData);
      notifications.show({
        title: "已复制",
        message: "数据已复制到剪贴板",
      });
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "复制失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, []);

  const handleImport = useCallback(() => {
    if (!importData.trim()) {
      notifications.show({
        title: "错误",
        message: "请输入要导入的数据",
        color: "red",
      });
      return;
    }

    try {
      const parsedData = JSON.parse(importData);
      graphInstance.graph.configure(parsedData, false);
      notifications.show({
        title: "导入成功",
        message: "数据已成功导入",
      });
      setImportData("");
      closeImportModal();
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "导入失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, [importData, closeImportModal]);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setImportData(clipboardText);
      openImportModal();
    } catch (error) {
      notifications.show({
        title: "错误",
        message: "读取剪贴板失败: " + (error as Error).message,
        color: "red",
      });
    }
  }, [openImportModal]);

  const loadDemo = useCallback(() => {
    relativeNode();
  }, []);

  return (
    <>
      <div className="fixed bottom-5 right-5 flex gap-2 z-50 flex-nowrap">
        <Button
          variant="filled"
          color={opened ? "red" : "green"}
          size="md"
          radius="md"
          onClick={() => (opened ? closeTask() : openTask())}
          className="shadow-lg hover:shadow-xl transition-all font-semibold"
          style={{
            minWidth: "120px",
          }}
        >
          <span className="mr-1.5">{opened ? "⏹" : "▶"}</span>
          {opened ? "停止仿真" : "开始仿真"}
        </Button>
        
        <Button
          variant="filled"
          color="blue"
          size="md"
          radius="md"
          onClick={save}
          className="shadow-lg hover:shadow-xl transition-all font-semibold"
          style={{
            minWidth: "120px",
          }}
        >
          <span className="mr-1.5">💾</span>
          保存到LS及DB
        </Button>
        
        <Button
          variant="filled"
          color="cyan"
          size="md"
          radius="md"
          onClick={loadConfig}
          className="shadow-lg hover:shadow-xl transition-all font-semibold"
          style={{
            minWidth: "120px",
          }}
        >
          <span className="mr-1.5">📂</span>
          从LS加载
        </Button>
        
        <Button
          variant="filled"
          color="violet"
          size="md"
          radius="md"
          onClick={copyToClipboard}
          className="shadow-lg hover:shadow-xl transition-all font-semibold"
          style={{
            minWidth: "120px",
          }}
        >
          <span className="mr-1.5">📋</span>
          复制
        </Button>
        
        <Button
          variant="filled"
          color="orange"
          size="md"
          radius="md"
          onClick={handlePasteFromClipboard}
          className="shadow-lg hover:shadow-xl transition-all font-semibold"
          style={{
            minWidth: "120px",
          }}
        >
          <span className="mr-1.5">📥</span>
          导入
        </Button>
        
        <Button
          variant="light"
          color="gray"
          size="md"
          radius="md"
          onClick={loadDemo}
          className="shadow-md hover:shadow-lg transition-all"
          style={{
            minWidth: "100px",
          }}
        >
          <span className="mr-1.5">🎯</span>
          加载Demo
        </Button>
      </div>

      <Modal
        opened={importModalOpened}
        onClose={closeImportModal}
        title="导入数据"
        centered
        size="lg"
      >
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder="请粘贴 JSON 数据..."
            value={importData}
            onChange={(event) => setImportData(event.currentTarget.value)}
            minRows={10}
            maxRows={20}
            autosize
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              color="gray"
              size="md"
              radius="md"
              onClick={closeImportModal}
              className="transition-all"
            >
              取消
            </Button>
            <Button
              variant="filled"
              color="blue"
              size="md"
              radius="md"
              onClick={handleImport}
              className="shadow-md hover:shadow-lg transition-all font-semibold"
            >
              <span className="mr-1.5">✓</span>
              导入
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
